'use strict';
if (typeof React === 'undefined' && typeof require !== 'undefined') {
  var React = require('react');
  module.exports = createPermittedElements;
}

function createPermittedElements (type, html, permittedTags, props) {
  const parser = new CreatePermittedElements(type, html, permittedTags, props);
  return parser.createPermittedElements();
};

function tagName(tag) {
  return tag.replace(/[<>/]/g, '');
}

function _isTag (tags) {
  return function (tag) {
    return tags.indexOf(tagName(tag)) !== -1;
  };
}

function isSelfClosingTag (tag) {
  return tagName(tag) === 'br';
}

function isClosingTag (tag) {
  return tag.match('</');
}

class CreatePermittedElements {
  constructor (type, html, permittedTags, props) {
    this.type = type;
    this.html = html;
    this.permittedTags = Array.isArray(permittedTags) ? permittedTags : [];
    this.props = props;
    this.isTag = _isTag(permittedTags);

    this.parserState = {
      inTag: [],
      lastElement: null
    };
  }

  splitHtml () {
    const tagRegex = this.permittedTags.map(tag => `</?${tag}>`).join('|');
    this.regex = new RegExp(`(${tagRegex})`, 'g');
    return (this.html || '').split(this.regex);
  }

  createPermittedElements () {
    let inTag = [];

    return React.createElement(this.type, this.props, this.splitHtml().map((el, index) => {
      let parsedElement;
      const elementIsTag = this.isTag(el);
      const elementIsClosingTag = isClosingTag(el);

      if (isSelfClosingTag(el)) {
        parsedElement = React.createElement(tagName(el), { key: index });
      } else if (elementIsTag && !elementIsClosingTag) {
        this.parserState.inTag.push(el);
      } else if (elementIsClosingTag && this.parserState.inTag.length > 1) {
        parsedElement = React.createElement(
          tagName(this.parserState.inTag.pop()),
          { key: index },
          React.createElement(
            tagName(this.parserState.inTag.pop()),
            {},
            this.parserState.lastElement
          )
        );
      } else if (elementIsClosingTag && this.parserState.inTag.length === 1) {
        parsedElement = React.createElement(
          tagName(this.parserState.inTag.pop()),
          { key: index },
          this.parserState.lastElement
        );
      } else if (!elementIsTag && this.parserState.inTag.length === 0) {
        parsedElement = el;
      }
      this.parserState.lastElement = el;
      return parsedElement;
    }));
  }
}
