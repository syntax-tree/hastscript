/**
 * @typedef {import('./core.js').Element} Element
 * @typedef {import('./core.js').Root} Root
 * @typedef {import('./core.js').HResult} HResult
 * @typedef {import('./core.js').HChild} HChild
 * @typedef {import('./core.js').HProperties} HProperties
 * @typedef {import('./core.js').HPropertyValue} HPropertyValue
 * @typedef {import('./core.js').HStyle} HStyle
 * @typedef {import('./core.js').core} Core
 *
 * @typedef {Record<string, HPropertyValue | HStyle | HChild>} JSXProps
 * @typedef {(props: Record<string, unknown>) => HResult} HComponent
 */

/**
 * Create an automatic runtime.
 *
 * @param {ReturnType<Core>} f
 */
export function runtime(f) {
  const jsx =
    /**
     * @type {{
     *   (type: null | undefined, props: {children?: HChild}, key?: string): Root
     *   (type: string, props: JSXProps, key?: string): Element
     * }}
     */
    (
      /**
       * @param {string | null | HComponent} component
       * @param {HProperties & {children?: HChild}} props
       * @returns {HResult}
       */
      function (component, props, key) {
        // If (typeof component === 'function') {
        //   return component({...props, key})
        // }

        const {children, ...properties} = props

        return component === null
          ? f(component, children)
          : // @ts-expect-error we can handle it.
            f(component, {...properties, key}, children)
      }
    )

  return {Fragment: null, jsx, jsxs: jsx, jsxDEV: jsx}
}
