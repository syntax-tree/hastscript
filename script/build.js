import fs from 'fs'
import path from 'path'
import {svgTagNames} from 'svg-tag-names'

const casing = svgTagNames.filter((d) => d !== d.toLowerCase())

fs.writeFileSync(
  path.join('lib', 'svg-case-sensitive-tag-names.js'),
  'export const svgCaseSensitiveTagNames = ' +
    JSON.stringify(casing, null, 2) +
    '\n'
)
