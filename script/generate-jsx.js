'use strict'

var fs = require('fs')
var path = require('path')
var buble = require('buble')
var babel = require('@babel/core')

var doc = String(fs.readFileSync(path.join('test', 'jsx.jsx')))

fs.writeFileSync(
  path.join('test', 'jsx-buble.js'),
  buble.transform(doc.replace(/'name'/, "'jsx (buble)'"), {
    jsx: 'h',
    jsxFragment: 'null'
  }).code
)

fs.writeFileSync(
  path.join('test', 'jsx-babel.js'),
  babel.transform(doc.replace(/'name'/, "'jsx (babel)'"), {
    plugins: [
      ['@babel/plugin-transform-react-jsx', {pragma: 'h', pragmaFrag: 'null'}]
    ]
  }).code
)
