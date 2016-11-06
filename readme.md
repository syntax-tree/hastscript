# hastscript [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

[Hyperscript][] (and [`virtual-hyperscript`][virtual-hyperscript])
compatible DSL for creating virtual [HAST][] trees.

## Installation

[npm][]:

```bash
npm install hastscript
```

## Usage

```javascript
var h = require('hastscript');

var tree = h('.foo#some-id', [
    h('span', 'some text'),
    h('input', {
        'type': 'text',
        'value': 'foo'
    }),
    h('a.alpha', {
        'class': 'bravo charlie',
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
       properties: { className: [ 'alpha', 'bravo', 'charlie' ], download: true },
       children:
        [ { type: 'text', value: 'delta' },
          { type: 'text', value: 'echo' } ] } ] }
```

## API

### `h(selector?[, properties][, children])`

DSL for creating virtual [HAST][] trees.

###### Parameters

*   `selector` (`string`, optional)
    — Simple CSS selector, e.g., tag names (`foo`), IDs (`#bar`)
    and classes (`.baz`) are supported,
    defaults to a `div` element.
*   `properties` (`Object.<string, *>`, optional)
    — Map of properties;
*   `children` (`string`, `Node`, `Array.<string|Node>`, optional)
    — (List of) child nodes, when strings are encountered,
    they are normalised to [`text`][text] nodes.

###### Returns

[`Element`][element].

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/hastscript.svg

[travis]: https://travis-ci.org/wooorm/hastscript

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/hastscript.svg

[codecov]: https://codecov.io/github/wooorm/hastscript

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[hast]: https://github.com/wooorm/hast

[element]: https://github.com/wooorm/hast#element

[virtual-hyperscript]: https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript

[hyperscript]: https://github.com/dominictarr/hyperscript

[text]: https://github.com/wooorm/hast#text
