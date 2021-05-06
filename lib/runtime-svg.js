// Export `JSX` as a global for TypeScript.
export * from './jsx-automatic.js'
import {runtime} from './runtime.js'
import {s} from './svg.js'
export const {Fragment, jsx, jsxs} = runtime(s)
