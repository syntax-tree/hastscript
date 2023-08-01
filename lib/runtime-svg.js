import {runtime} from './runtime.js'
import {s} from './index.js'

// Export `JSX` as a global for TypeScript.
export * from './jsx-automatic.js'

export const {Fragment, jsx, jsxDEV, jsxs} = runtime(s)
