// Dependencies:
var h = require('./index.js');

// AST:
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

// Yields:
console.log('js', require('util').inspect(tree, {'depth': null}));
