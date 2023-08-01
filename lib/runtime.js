/**
 * @typedef {import('./core.js').core} Core
 * @typedef {import('./core.js').Element} Element
 * @typedef {import('./core.js').HChild} HChild
 * @typedef {import('./core.js').HProperties} HProperties
 * @typedef {import('./core.js').HPropertyValue} HPropertyValue
 * @typedef {import('./core.js').HResult} HResult
 * @typedef {import('./core.js').HStyle} HStyle
 * @typedef {import('./core.js').Root} Root
 *
 * @typedef {Record<string, HPropertyValue | HStyle | HChild>} JSXProps
 */

/**
 * Create an automatic runtime.
 *
 * @param {ReturnType<Core>} f
 *   `h` function.
 * @returns
 *   Automatic JSX runtime.
 */
export function runtime(f) {
  /**
   * @overload
   * @param {null} type
   * @param {{children?: HChild}} props
   * @param {string} [key]
   * @returns {Root}
   *
   * @overload
   * @param {string} type
   * @param {JSXProps} props
   * @param {string} [key]
   * @returns {Element}
   *
   * @param {string | null} type
   *   Element name or `null` to get a root.
   * @param {HProperties & {children?: HChild}} props
   *   Properties.
   * @returns {HResult}
   *   Result.
   */
  function jsx(type, props) {
    const {children, ...properties} = props
    const result =
      // @ts-ignore: `children` is fine: TS has a recursion problem which
      // sometimes generates broken types.
      type === null ? f(null, children) : f(type, properties, children)
    return result
  }

  return {Fragment: null, jsx, jsxDEV: jsx, jsxs: jsx}
}
