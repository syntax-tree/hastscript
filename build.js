'use strict'

var fs = require('fs')
var tagNames = require('svg-tag-names')

var casing = tagNames.filter(function(d) {
  return d !== d.toLowerCase()
})

var doc = JSON.stringify(casing, null, 2) + '\n'

fs.writeFileSync('./svg-case-sensitive-tag-names.json', doc)
