/* @jsxRuntime automatic */
/* @jsxImportSource hastscript/svg */

import {expectType} from 'tsd'
import type {Root, Element} from 'hast'
import {s} from '../index.js'

type Result = Element | Root

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
expectType<Result>(<a>{s()}</a>)
expectType<Result>(<a>{s('b')}</a>)
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

// @ts-expect-error: not a valid property value.
const a = <a invalid={[true]} />

// This is where the automatic runtime differs from the classic runtime.
// The automatic runtime the children prop to define JSX children, whereas it’s used as an attribute in the classic runtime.

expectType<Result>(<a children={<b />} />)

declare function Bar(properties?: Record<string, unknown>): Element

// @ts-expect-error: components are not supported.
const b = <Bar />
