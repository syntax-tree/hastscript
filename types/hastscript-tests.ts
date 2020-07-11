import h = require('hastscript')

h()
h('.bar', {class: 'bar'})
h('.foo', {class: 'bar'}, h('.baz'))
