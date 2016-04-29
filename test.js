'use strict';
const assert = require('assert');
const createPermittedElements = require('./index');
const createTree = require('./index').createTree;
const ReactDOM = require('react-dom/server');
const tap = require('tap');

tap.test('returns something without HTML or permitted tags', test => {
  const actual = ReactDOM.renderToString(createPermittedElements('p'));
  const expected = '<p data-reactroot="" data-reactid="1" data-react-checksum="891620788"></p>';
  test.equal(actual, expected);
  test.end();
});

tap.test('handles empty HTML string', test => {
  const actual = ReactDOM.renderToString(createPermittedElements('p', '', ['b', 'br', 'em', 'strong', 'i']));
  const expected = '<p data-reactroot="" data-reactid="1" data-react-checksum="1902909839"><!-- react-text: 2 --><!-- /react-text --></p>';
  test.equal(actual, expected);
  test.end();
});

tap.test('handles HTML with no matching replacements', test => {
  const actual = ReactDOM.renderToString(createPermittedElements('p', 'This has nothing to do', ['b', 'br', 'em', 'strong', 'i']));
  const expected = '<p data-reactroot="" data-reactid="1" data-react-checksum="700195216"><!-- react-text: 2 -->This has nothing to do<!-- /react-text --></p>';
  test.equal(actual, expected);
  test.end();
});

tap.test('replaces permitted elements', test => {
  const actual = ReactDOM.renderToString(createPermittedElements('p', 'This is <b>bold</b><br>and this <i>is italic</i>', ['b', 'br', 'em', 'strong', 'i']));
  const expected = '<p data-reactroot="" data-reactid="1" data-react-checksum="-1219994142"><!-- react-text: 2 -->This is <!-- /react-text --><b data-reactid="3">bold</b><!-- react-text: 4 --><!-- /react-text --><br data-reactid="5"/><!-- react-text: 6 -->and this <!-- /react-text --><i data-reactid="7">is italic</i><!-- react-text: 8 --><!-- /react-text --></p>';
  test.equal(actual, expected);
  test.end();
});

tap.test('ignores other elements', test => {
  const actual = ReactDOM.renderToString(createPermittedElements('p', 'This is <b>bold</b><br>and this <i>is italic</i>', ['br']));
  const expected = '<p data-reactroot="" data-reactid="1" data-react-checksum="-890158278"><!-- react-text: 2 -->This is &lt;b&gt;bold&lt;/b&gt;<!-- /react-text --><br data-reactid="3"/><!-- react-text: 4 -->and this &lt;i&gt;is italic&lt;/i&gt;<!-- /react-text --></p>';

  test.equal(actual, expected);
  test.end();
});

tap.test('handles simple nested elements', test => {
  const actual = ReactDOM.renderToString(createPermittedElements('p', 'This is <b><i>bold and italic</i></b> maybe', ['b', 'i']));
  const expected = '<p data-reactroot="" data-reactid="1" data-react-checksum="-1975825789"><!-- react-text: 2 -->This is <!-- /react-text --><i data-reactid="3"><b data-reactid="4">bold and italic</b></i><!-- react-text: 5 --><!-- /react-text --><!-- react-text: 6 --> maybe<!-- /react-text --></p>';

  test.equal(actual, expected);
  test.end();
});
