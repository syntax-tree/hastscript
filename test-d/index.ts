import {expectType} from 'tsd'
import type {Root, Element} from 'hast'
import {h as hFromRoot} from '../html.js'
import {h, s} from '../index.js'
import {Fragment, jsx, jsxs} from '../jsx-runtime.js'
import {s as sFromRoot} from '../svg.js'

// Ensure files are loadable in TS.
expectType<Root>(hFromRoot())
expectType<Root>(sFromRoot())

expectType<Root>(h())
expectType<Root>(s())
// @ts-expect-error: not a tag name.
h(true)
expectType<Root>(h(null))
expectType<Root>(h(undefined))
expectType<Element>(h(''))
expectType<Element>(s(''))
expectType<Element>(h('', null))
expectType<Element>(h('', undefined))
expectType<Element>(h('', 1))
expectType<Element>(h('', 'a'))
// @ts-expect-error: not a child.
h('', true)
expectType<Element>(h('', [1, 'a', null]))
// @ts-expect-error: not a child.
h('', [true])

expectType<Element>(h('', {}))
expectType<Element>(h('', {}, [1, 'a', null]))
expectType<Element>(h('', {p: 1}))
expectType<Element>(h('', {p: null}))
expectType<Element>(h('', {p: undefined}))
expectType<Element>(h('', {p: true}))
expectType<Element>(h('', {p: false}))
expectType<Element>(h('', {p: 'a'}))
expectType<Element>(h('', {p: [1]}))
// @ts-expect-error: not a property value.
h('', {p: [true]})
expectType<Element>(h('', {p: ['a']}))
expectType<Element>(h('', {p: {x: 1}})) // Style
// @ts-expect-error: not a property value.
h('', {p: {x: true}})

expectType<Element>(
  s('svg', {xmlns: 'http://www.w3.org/2000/svg', viewbox: '0 0 500 500'}, [
    s('title', 'SVG `<circle` element'),
    s('circle', {cx: 120, cy: 120, r: 100})
  ])
)

expectType<Root>(jsx(Fragment, {}))
expectType<Root>(jsx(Fragment, {children: h('x')}))
expectType<Element>(jsx('a', {}))
expectType<Element>(jsx('a', {children: 'a'}))
expectType<Element>(jsx('a', {children: h('x')}))
expectType<Element>(jsxs('a', {children: ['a', 'b']}))
expectType<Element>(jsxs('a', {children: [h('x'), h('y')]}))
