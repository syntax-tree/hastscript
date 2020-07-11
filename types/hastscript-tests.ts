import h = require('hastscript')

h() // $ExpectType Element
h('.bar', {class: 'bar'}) // $ExpectType Element
h('.bar', 'child text') // $ExpectType Element
h('.bar', ['child text']) // $ExpectType Element
h('.foo', {class: 'bar'}, h('.baz')) // $ExpectType Element
h('.foo', {class: 'bar'}, [h('.baz')]) // $ExpectType Element
h('.bar',{class: 'bar'} , 'child text') // $ExpectType Element
h('.bar',{class: 'bar'}, ['child text']) // $ExpectType Element
h(false) // $ExpectError
