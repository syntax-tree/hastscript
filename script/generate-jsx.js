import fs from 'node:fs/promises'
import acornJsx from 'acorn-jsx'
import {fromJs} from 'esast-util-from-js'
import {toJs} from 'estree-util-to-js'
import {buildJsx} from 'estree-util-build-jsx'

const doc = String(
  await fs.readFile(new URL('../test/jsx.jsx', import.meta.url))
)

await fs.writeFile(
  new URL('../test/jsx-build-jsx-classic.js', import.meta.url),
  toJs(
    buildJsx(
      fromJs(doc.replace(/'name'/, "'jsx (estree-util-build-jsx, classic)'"), {
        plugins: [acornJsx()],
        module: true
      }),
      {pragma: 'h', pragmaFrag: 'null'}
    )
  ).value
)

await fs.writeFile(
  new URL('../test/jsx-build-jsx-automatic.js', import.meta.url),

  toJs(
    buildJsx(
      fromJs(
        doc.replace(/'name'/, "'jsx (estree-util-build-jsx, automatic)'"),
        {plugins: [acornJsx()], module: true}
      ),
      {runtime: 'automatic', importSource: 'hastscript'}
    )
  ).value
)
