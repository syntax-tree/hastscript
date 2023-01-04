/** @jsxImportSource hastscript */

import assert from 'node:assert/strict'
import test from 'node:test'
import {u} from 'unist-builder'
import {h} from '../index.js'

test('name', () => {
  assert.deepEqual(<a />, h('a'), 'should support a self-closing element')

  assert.deepEqual(<a>b</a>, h('a', 'b'), 'should support a value as a child')

  const A = 'a'

  // Note: this file is a template, generated with different runtimes.
  // @ts-ignore: TS (depending on this build) sometimes doesn’t understand.
  assert.deepEqual(<A />, h(A), 'should support an uppercase tag name')

  assert.deepEqual(
    <a>{1 + 1}</a>,
    h('a', '2'),
    'should support expressions as children'
  )

  assert.deepEqual(<></>, u('root', []), 'should support a fragment')

  assert.deepEqual(
    <>a</>,
    u('root', [u('text', 'a')]),
    'should support a fragment with text'
  )

  assert.deepEqual(
    <>
      <a />
    </>,
    u('root', [h('a')]),
    'should support a fragment with an element'
  )

  assert.deepEqual(
    <>{-1}</>,
    u('root', [u('text', '-1')]),
    'should support a fragment with an expression'
  )

  const com = {acme: {a: 'A', b: 'B'}}

  assert.deepEqual(
    // Note: this file is a template, generated with different runtimes.
    // @ts-ignore: TS (depending on this build) sometimes doesn’t understand.
    <com.acme.a />,
    h(com.acme.a),
    'should support members as names (`a.b`)'
  )

  assert.deepEqual(
    <a b />,
    h('a', {b: true}),
    'should support a boolean attribute'
  )

  assert.deepEqual(
    <a b="" />,
    h('a', {b: ''}),
    'should support a double quoted attribute'
  )

  assert.deepEqual(
    <a b='"' />,
    h('a', {b: '"'}),
    'should support a single quoted attribute'
  )

  assert.deepEqual(
    <a b={1 + 1} />,
    h('a', {b: 2}),
    'should support expression value attributes'
  )

  const props = {a: 1, b: 2}

  assert.deepEqual(
    <a {...props} />,
    h('a', props),
    'should support expression spread attributes'
  )

  assert.deepEqual(
    <a>
      <b />c<d>e</d>
      {1 + 1}
    </a>,
    h('a', [h('b'), 'c', h('d', 'e'), '2']),
    'should support text, elements, and expressions in jsx'
  )

  assert.deepEqual(
    <a>
      <>{1}</>
    </a>,
    h('a', '1'),
    'should support a fragment in an element (#1)'
  )

  const dl = [
    ['Firefox', 'A red panda.'],
    ['Chrome', 'A chemical element.']
  ]

  assert.deepEqual(
    <dl>
      {dl.map(([title, definition]) => (
        <>
          <dt>{title}</dt>
          <dd>{definition}</dd>
        </>
      ))}
    </dl>,
    h('dl', [
      h('dt', dl[0][0]),
      h('dd', dl[0][1]),
      h('dt', dl[1][0]),
      h('dd', dl[1][1])
    ]),
    'should support a fragment in an element (#2)'
  )
})
