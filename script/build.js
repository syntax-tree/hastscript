import fs from 'fs'
import {svgTagNames} from 'svg-tag-names'

var casing = svgTagNames.filter((d) => d !== d.toLowerCase())

fs.writeFileSync(
  'svg-case-sensitive-tag-names.js',
  'export const svgCaseSensitiveTagNames = ' +
    JSON.stringify(casing, null, 2) +
    '\n'
)
