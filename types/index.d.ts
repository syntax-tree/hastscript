// TypeScript Version: 3.5

import {Element, Properties, Node} from 'hast'

declare function hastscript(
  selector?: string,
  properties?: Properties,
  children?: string | Node | Array<string | Node>
): Element

export = hastscript
