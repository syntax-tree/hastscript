/**
 * @import {Element, Root} from 'hast'
 * @import {Child, Properties, PropertyValue, Result, Style, createH as CreateH} from './create-h.js'
 */

/**
 * @typedef {Record<string, Child | PropertyValue | Style>} JSXProps
 */

// Make VS code see references to above symbols.
''

/**
 * Create an automatic runtime.
 *
 * @param {ReturnType<CreateH>} f
 *   `h` function.
 * @returns
 *   Automatic JSX runtime.
 */
export function createAutomaticRuntime(f) {
  /**
   * Create a root or an element.
   *
   * @overload
   * @param {null} type
   *   `null` to get a root.
   * @param {{children?: Child}} properties
   *   Properties with children.
   * @param {string | null | undefined} [key]
   *   Key (ignored).
   * @returns {Root}
   *   Root.
   *
   * @overload
   * @param {string} type
   *   Element name.
   * @param {JSXProps} properties
   *   Properties with children.
   * @param {string | null | undefined} [key]
   *   Key (ignored).
   * @returns {Element}
   *   Element.
   *
   * @param {string | null} type
   *   Element name or `null` to get a root.
   * @param {Properties & {children?: Child}} properties
   *   Properties.
   * @returns {Result}
   *   Result.
   */
  function jsx(type, properties) {
    const {children, ...properties_} = properties
    const result =
      // @ts-ignore: `children` is fine: TS has a recursion problem which
      // sometimes generates broken types.
      type === null ? f(null, children) : f(type, properties_, children)
    return result
  }

  return {Fragment: null, jsxDEV: jsx, jsxs: jsx, jsx}
}
