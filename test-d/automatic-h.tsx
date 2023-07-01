/* @jsxRuntime automatic */
/* @jsxImportSource hastscript */

import {expectType, expectError} from 'tsd'
import type {Root, Element} from 'hast'
import {h} from '../index.js'
import {Fragment, jsx, jsxs} from '../jsx-runtime.js'

type Result = Element | Root

// JSX automatic runtime.
expectType<Root>(jsx(Fragment, {}))
expectType<Root>(jsx(Fragment, {children: h('h')}))
expectType<Element>(jsx('a', {}))
expectType<Element>(jsx('a', {children: 'a'}))
expectType<Element>(jsx('a', {children: h('h')}))
expectType<Element>(jsxs('a', {children: ['a', 'b']}))
expectType<Element>(jsxs('a', {children: [h('x'), h('y')]}))

expectType<Result>(<></>)
expectType<Result>(<a />)
expectType<Result>(<a b="c" />)
expectType<Result>(<a b={'c'} />)
expectType<Result>(<a>string</a>)
expectType<Result>(<a>{['string', 'string']}</a>)
expectType<Result>(
  <a>
    <></>
  </a>
)
expectType<Result>(<a>{h()}</a>)
expectType<Result>(<a>{h('b')}</a>)
expectType<Result>(
  <a>
    <b />c
  </a>
)
expectType<Result>(
  <a>
    <b />
    <c />
  </a>
)
expectType<Result>(<a>{[<b />, <c />]}</a>)
expectType<Result>(<a>{[<b />, <c />]}</a>)
expectType<Result>(<a>{[]}</a>)

expectError(<a invalid={[true]} />)

// This is where the automatic runtime differs from the classic runtime.
// The automatic runtime the children prop to define JSX children, whereas it’s used as an attribute in the classic runtime.

expectType<Result>(<a children={<b />} />)

declare function Bar(props?: Record<string, unknown>): Element
expectType<Result>(<Bar />)
