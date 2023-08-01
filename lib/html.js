/**
 * @typedef {import('./core.js').HChild} Child
 *   Acceptable child value.
 * @typedef {import('./core.js').HProperties} Properties
 *   Acceptable value for element properties.
 * @typedef {import('./core.js').HResult} Result
 *   Result from a `h` (or `s`) call.
 */

/**
 * @typedef {import('./jsx-classic.js').Element} h.JSX.Element
 * @typedef {import('./jsx-classic.js').ElementChildrenAttribute} h.JSX.ElementChildrenAttribute
 * @typedef {import('./jsx-classic.js').IntrinsicAttributes} h.JSX.IntrinsicAttributes
 * @typedef {import('./jsx-classic.js').IntrinsicElements} h.JSX.IntrinsicElements
 */

import {html} from 'property-information'
import {core} from './core.js'

// Note: this explicit type is needed, otherwise TS creates broken types.
/** @type {ReturnType<core>} */
export const h = core(html, 'div')
