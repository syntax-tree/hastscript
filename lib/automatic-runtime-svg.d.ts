/* eslint-disable @typescript-eslint/naming-convention -- names are defined by JSX. */

import type {Element, Root} from 'hast'
import type {Child} from './create-h.js'
import type {JSXProps} from './create-automatic-runtime.js'

export * from './jsx-automatic.js'

export const Fragment: null

export const jsxDEV: {
  (
    type: null,
    properties: {children?: Child},
    key?: string | null,
    ...unused: Array<unknown>
  ): Root
  (
    type: string,
    properties: JSXProps,
    key?: string | null,
    ...unused: Array<unknown>
  ): Element
}

export const jsxs: {
  (type: null, properties: {children?: Child}, key?: string | null): Root
  (type: string, properties: JSXProps, key?: string | null): Element
}

export const jsx: {
  (type: null, properties: {children?: Child}, key?: string | null): Root
  (type: string, properties: JSXProps, key?: string | null): Element
}
