import fs from 'node:fs/promises'
import acornJsx from 'acorn-jsx'
import {fromJs} from 'esast-util-from-js'
import {toJs} from 'estree-util-to-js'
import {buildJsx} from 'estree-util-build-jsx'

const doc = String(
  await fs.readFile(new URL('../test/jsx.jsx', import.meta.url))
)

const treeAutomatic = fromJs(
  doc.replace(/'name'/, "'jsx (estree-util-build-jsx, automatic)'"),
  {plugins: [acornJsx()], module: true}
)

const treeAutomaticDevelopment = fromJs(
  doc.replace(
    /'name'/,
    "'jsx (estree-util-build-jsx, automatic, development)'"
  ),
  {plugins: [acornJsx()], module: true}
)

const treeClassic = fromJs(
  doc.replace(/'name'/, "'jsx (estree-util-build-jsx, classic)'"),
  {
    plugins: [acornJsx()],
    module: true
  }
)

buildJsx(treeAutomatic, {
  runtime: 'automatic',
  importSource: 'hastscript'
})
buildJsx(treeAutomaticDevelopment, {
  runtime: 'automatic',
  importSource: 'hastscript',
  development: true
})
buildJsx(treeClassic, {pragma: 'h', pragmaFrag: 'null'})

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
