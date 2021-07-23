import fs from 'node:fs'
import path from 'node:path'
import babel from '@babel/core'
import {Parser} from 'acorn'
import acornJsx from 'acorn-jsx'
import {generate} from 'astring'
import {buildJsx} from 'estree-util-build-jsx'

const doc = String(fs.readFileSync(path.join('test', 'jsx.jsx')))

fs.writeFileSync(
  path.join('test', 'jsx-build-jsx-classic.js'),
  generate(
    buildJsx(
      // @ts-expect-error Acorn nodes are assignable to ESTree nodes.
      Parser.extend(acornJsx()).parse(
        doc.replace(/'name'/, "'jsx (estree-util-build-jsx, classic)'"),
        {sourceType: 'module', ecmaVersion: 2021}
      ),
      {pragma: 'h', pragmaFrag: 'null'}
    )
  )
)

fs.writeFileSync(
  path.join('test', 'jsx-build-jsx-automatic.js'),
  generate(
    buildJsx(
      // @ts-expect-error Acorn nodes are assignable to ESTree nodes.
      Parser.extend(acornJsx()).parse(
        doc.replace(/'name'/, "'jsx (estree-util-build-jsx, automatic)'"),
        {sourceType: 'module', ecmaVersion: 2021}
      ),
      {runtime: 'automatic', importSource: '.'}
    )
  ).replace(/\/jsx-runtime(?=["'])/g, './lib/runtime-html.js')
)

fs.writeFileSync(
  path.join('test', 'jsx-babel-classic.js'),
  // @ts-expect-error Result always given.
  babel.transform(doc.replace(/'name'/, "'jsx (babel, classic)'"), {
    plugins: [
      ['@babel/plugin-transform-react-jsx', {pragma: 'h', pragmaFrag: 'null'}]
    ]
  }).code
)

fs.writeFileSync(
  path.join('test', 'jsx-babel-automatic.js'),
  // @ts-expect-error Result always given.
  babel
    .transformSync(doc.replace(/'name'/, "'jsx (babel, automatic)'"), {
      plugins: [
        [
          '@babel/plugin-transform-react-jsx',
          {runtime: 'automatic', importSource: '.'}
        ]
      ]
    })
    .code.replace(/\/jsx-runtime(?=["'])/g, './lib/runtime-html.js')
)
