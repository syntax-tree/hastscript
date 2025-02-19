import fs from 'node:fs/promises'
import {svgTagNames} from 'svg-tag-names'

/** @type {Array<string>} */
const irregular = []

for (const name of svgTagNames) {
  if (name !== name.toLowerCase()) irregular.push(name)
}

await fs.writeFile(
  new URL('../lib/svg-case-sensitive-tag-names.js', import.meta.url),
  [
    '/**',
    ' * List of case-sensitive SVG tag names.',
    ' *',
    ' * @type {ReadonlyArray<string>}',
    ' */',
    'export const svgCaseSensitiveTagNames = ' +
      JSON.stringify(irregular, undefined, 2),
    ''
  ].join('\n')
)
