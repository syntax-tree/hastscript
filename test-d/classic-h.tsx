/* @jsx h */
/* @jsxFrag null */
import {expectType} from 'tsd'
import type {Root, Element} from 'hast'
import {h} from '../index.js'

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

// @ts-expect-error: not a valid property value.
const a = <a invalid={[true]} />

// @ts-expect-error: This is where the classic runtime differs from the
// automatic runtime.
// The automatic runtime the children prop to define JSX children, whereas
// it’s used as an attribute in the classic runtime.
const b = <a children={<b />} />

declare function Bar(properties?: Record<string, unknown>): Element

// @ts-expect-error: components are not supported.
const c = <Bar />
