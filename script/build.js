import fs from 'node:fs/promises'
import {svgTagNames} from 'svg-tag-names'

const casing = svgTagNames.filter((d) => d !== d.toLowerCase())

await fs.writeFile(
  new URL('../lib/svg-case-sensitive-tag-names.js', import.meta.url),
  'export const svgCaseSensitiveTagNames = ' +
    JSON.stringify(casing, null, 2) +
    '\n'
)
