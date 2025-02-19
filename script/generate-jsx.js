import fs from 'node:fs/promises'
import acornJsx from 'acorn-jsx'
import {buildJsx} from 'estree-util-build-jsx'
import {fromJs} from 'esast-util-from-js'
import {toJs} from 'estree-util-to-js'

const document = await fs.readFile(
  new URL('../test/jsx.jsx', import.meta.url),
  'utf8'
)

const treeAutomatic = fromJs(
  document.replace(/'name'/, "'jsx (estree-util-build-jsx, automatic)'"),
  {module: true, plugins: [acornJsx()]}
)

const treeAutomaticDevelopment = fromJs(
  document.replace(
    /'name'/,
    "'jsx (estree-util-build-jsx, automatic, development)'"
  ),
  {module: true, plugins: [acornJsx()]}
)

const treeClassic = fromJs(
  document.replace(/'name'/, "'jsx (estree-util-build-jsx, classic)'"),
  {module: true, plugins: [acornJsx()]}
)

buildJsx(treeAutomatic, {importSource: 'hastscript', runtime: 'automatic'})
buildJsx(treeAutomaticDevelopment, {
  development: true,
  importSource: 'hastscript',
  runtime: 'automatic'
})
buildJsx(treeClassic, {pragmaFrag: 'null', pragma: 'h'})

await fs.writeFile(
  new URL('../test/jsx-build-jsx-automatic.js', import.meta.url),
  toJs(treeAutomatic).value
)

await fs.writeFile(
  new URL('../test/jsx-build-jsx-automatic-development.js', import.meta.url),
  // There’s a problem with `this` that TS doesn’t like.
  '// @ts-nocheck\n\n' + toJs(treeAutomaticDevelopment).value
)

await fs.writeFile(
  new URL('../test/jsx-build-jsx-classic.js', import.meta.url),
  toJs(treeClassic).value
)
