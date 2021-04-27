import fs from 'fs'
import path from 'path'
import babel from '@babel/core'
import {Parser} from 'acorn'
import acornJsx from 'acorn-jsx'
import {generate} from 'astring'
import {buildJsx} from 'estree-util-build-jsx'

var doc = String(fs.readFileSync(path.join('test', 'jsx.jsx')))

fs.writeFileSync(
  path.join('test', 'jsx-build-jsx.js'),
  generate(
    buildJsx(
      // @ts-ignore Acorn nodes are assignable to ESTree nodes.
      Parser.extend(acornJsx()).parse(
        doc.replace(/'name'/, "'jsx (build-jsx)'"),
        {sourceType: 'module'}
      ),
      {pragma: 'h', pragmaFrag: 'null'}
    )
  )
)

fs.writeFileSync(
  path.join('test', 'jsx-babel.js'),
  babel.transform(doc.replace(/'name'/, "'jsx (babel)'"), {
    plugins: [
      ['@babel/plugin-transform-react-jsx', {pragma: 'h', pragmaFrag: 'null'}]
    ]
  }).code
)
