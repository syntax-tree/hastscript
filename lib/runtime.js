/**
 * @typedef {import('./core.js').HastElement} HastElement
 * @typedef {import('./core.js').HastRoot} HastRoot
 * @typedef {import('./core.js').HResult} HResult
 * @typedef {import('./core.js').HChild} HChild
 * @typedef {import('./core.js').HProperties} HProperties
 * @typedef {import('./core.js').HPropertyValue} HPropertyValue
 * @typedef {import('./core.js').HStyle} HStyle
 * @typedef {import('./core.js').core} Core
 *
 * @typedef {{[x: string]: HPropertyValue|HStyle|HChild}} JSXProps
 */

/**
 * @param {ReturnType<Core>} f
 */
export function runtime(f) {
  const jsx =
    /**
     * @type {{
     *   (type: null|undefined, props: {children?: HChild}, key?: string): HastRoot
     *   (type: string, props: JSXProps, key?: string): HastElement
     * }}
     */
    (
      /**
       * @param {string|null} type
       * @param {HProperties & {children?: HChild}} props
       * @returns {HResult}
       */
      function (type, props) {
        var {children, ...properties} = props
        return type === null ? f(type, children) : f(type, properties, children)
      }
    )

  return {Fragment: null, jsx, jsxs: jsx}
}
