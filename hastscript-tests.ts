import h = require('hastscript')
import s = require('hastscript/svg')

h() // $ExpectType Element
h('.bar', {class: 'bar'}) // $ExpectType Element
h('.bar', 'child text') // $ExpectType Element
h('.bar', ['child text']) // $ExpectType Element
h('.foo', {class: 'bar'}, h('.baz')) // $ExpectType Element
h('.foo', {class: 'bar'}, [h('.baz')]) // $ExpectType Element
h('.bar', {class: 'bar'}, 'child text') // $ExpectType Element
h('.bar', {class: 'bar'}, ['child text']) // $ExpectType Element
h(false) // $ExpectError

// $ExpectType
s('svg', {xmlns: 'http://www.w3.org/2000/svg', viewbox: '0 0 500 500'}, [
  s('title', 'SVG `<circle` element'),
  s('circle', {cx: 120, cy: 120, r: 100})
])
