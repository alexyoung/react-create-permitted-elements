## Create Permitted Elements

This project creates React elements based on HTML strings.

If you've got HTML fragments coming from a CMS, you've got three ways to handle it in React:

1. Use `dangerouslySetInnerHTML`
2. Sanitize the input with whitelisted tags
3. Use some kind of HTML parser to validate the HTML and change it into React elements

I wanted to use option 3 without depending on a real HTML parser, so I made `createPermittedElements`.

Here's what it looks like:

```
function Example1() {
  return createPermittedElements('p', 'This <b>is bold</b> and this <i>is italic</i> text.', ['b', 'i']);
}

ReactDOM.render(<Example1 />, document.getElementById('example-1'));
```

Look at the `examples/` folder for more, and checkout the tests.

### To-do

Support attributes in the HTML (my use case was basically bold/strong/etc. so I don't need this yet).
