# hastscript [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

[Hyperscript][] (and [`virtual-hyperscript`][virtual-hyperscript])
compatible DSL for creating virtual [HAST][] trees.

## Installation

[npm][npm-install]:

```bash
npm install hastscript
```

**hastscript** is also available as an AMD, CommonJS, and globals
module, [uncompressed and compressed][releases].

## Usage

Dependencies:

```javascript
var h = require('hastscript');
```

AST:

```javascript
var tree = h('.foo#some-id', [
    h('span', 'some text'),
    h('input', {
        'type': 'text',
        'value': 'foo'
    }),
    h('a.alpha', {
        'class': 'bravo charlie',
        'style': 'color:/*red*/purple',
        'download': 'download'
    }, ['delta', 'echo'])
]);
```

Yields:

```js
{ type: 'element',
  tagName: 'div',
  properties: { id: 'some-id', className: [ 'foo' ] },
  children: 
   [ { type: 'element',
       tagName: 'span',
       properties: {},
       children: [ { type: 'text', value: 'some text' } ] },
     { type: 'element',
       tagName: 'input',
       properties: { type: 'text', value: 'foo' },
       children: [] },
     { type: 'element',
       tagName: 'a',
       properties: 
        { className: [ 'alpha', 'bravo', 'charlie' ],
          style: { color: 'purple' },
          download: true },
       children: 
        [ { type: 'text', value: 'delta' },
          { type: 'text', value: 'echo' } ] } ] }
```

## API

### `h(selector?[, properties][, children])`

DSL for creating virtual [HAST][] trees.

**Parameters**:

*   `selector` (`string`, optional)
    — Simple CSS selector, e.g., tag names (`foo`), IDs (`#bar`)
    and classes (`.baz`) are supported,
    defaults to a `div` element.

*   `properties` (`Object.<string, *>`, optional)
    — Map of properties;

    When providing an object to `properties.style`,
    make sure you camel-case those properties.

*   `children` (`string`, `Node`, `Array.<string|Node>`, optional)
    — (List of) child nodes, when strings are encountered,
    they are normalised to [`text`][text] nodes.

**Returns**: [`Node`][hast-node] — A HAST node.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/hastscript.svg

[travis]: https://travis-ci.org/wooorm/hastscript

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/hastscript.svg

[codecov]: https://codecov.io/github/wooorm/hastscript

[npm-install]: https://docs.npmjs.com/cli/install

[releases]: https://github.com/wooorm/hastscript/releases

[license]: LICENSE

[author]: http://wooorm.com

[hast]: https://github.com/wooorm/hast

[hast-node]: https://github.com/wooorm/hast#node

[virtual-hyperscript]: https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript

[hyperscript]: https://github.com/dominictarr/hyperscript

[text]: https://github.com/wooorm/hast#text
