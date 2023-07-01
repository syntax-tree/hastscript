import type {HProperties, HChild, HResult} from './core.js'

declare global {
  namespace JSX {
    /**
     * Return value of JSX syntax.
     */
    type Element = HResult

    /**
     * This defines the prop types for known elements.
     *
     * For `hastscript` this defines any string may be used in combination with `hast` `Properties`.
     *
     * This **must** be an interface.
     */
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      [name: string]:
        | HProperties
        | {
            children?: HChild
          }
    }
  }
}
