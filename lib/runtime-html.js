// Export `JSX` as a global for TypeScript.
export * from './jsx-automatic.js'
import {runtime} from './runtime.js'
import {h} from './html.js'
export const {Fragment, jsx, jsxs} = runtime(h)
