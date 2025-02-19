/** @jsxImportSource hastscript */

import assert from 'node:assert/strict'
import test from 'node:test'
import {h} from 'hastscript'

test('name', async function (t) {
  await t.test('should support a self-closing element', async function () {
    assert.deepEqual(<a />, h('a'))
  })

  await t.test('should support a value as a child', async function () {
    assert.deepEqual(<a>b</a>, h('a', 'b'))
  })

  await t.test('should support an uppercase tag name', async function () {
    const A = 'a'

    // Note: this file is a template, generated with different runtimes.
    // @ts-ignore: TS (depending on this build) sometimes doesn’t understand.
    assert.deepEqual(<A />, h(A))
  })

  await t.test('should support expressions as children', async function () {
    assert.deepEqual(<a>{1 + 1}</a>, h('a', '2'))
  })

  await t.test('should support a fragment', async function () {
    assert.deepEqual(<></>, {type: 'root', children: []})
  })

  await t.test('should support a fragment with text', async function () {
    assert.deepEqual(<>a</>, {
      type: 'root',
      children: [{type: 'text', value: 'a'}]
    })
  })

  await t.test('should support a fragment with an element', async function () {
    assert.deepEqual(
      <>
        <a />
      </>,
      {type: 'root', children: [h('a')]}
    )
  })

  await t.test(
    'should support a fragment with an expression',
    async function () {
      assert.deepEqual(<>{-1}</>, {
        type: 'root',
        children: [{type: 'text', value: '-1'}]
      })
    }
  )

  await t.test('should support members as names (`a.b`)', async function () {
    const com = {acme: {a: 'A', b: 'B'}}

    assert.deepEqual(
      // Note: this file is a template, generated with different runtimes.
      // @ts-ignore: TS (depending on this build) sometimes doesn’t understand.
      <com.acme.a />,
      h(com.acme.a)
    )
  })

  await t.test('should support a boolean attribute', async function () {
    assert.deepEqual(<a b />, h('a', {b: true}))
  })

  await t.test('should support a double quoted attribute', async function () {
    assert.deepEqual(<a b="" />, h('a', {b: ''}))
  })

  await t.test('should support a single quoted attribute', async function () {
    assert.deepEqual(<a b='"' />, h('a', {b: '"'}))
  })

  await t.test('should support expression value attributes', async function () {
    assert.deepEqual(<a b={1 + 1} />, h('a', {b: 2}))
  })

  await t.test(
    'should support expression spread attributes',
    async function () {
      const properties = {a: 1, b: 2}

      assert.deepEqual(<a {...properties} />, h('a', properties))
    }
  )

  await t.test(
    'should support text, elements, and expressions in jsx',
    async function () {
      assert.deepEqual(
        <a>
          <b />c<d>e</d>
          {1 + 1}
        </a>,
        h('a', [h('b'), 'c', h('d', 'e'), '2'])
      )
    }
  )

  await t.test(
    'should support a fragment in an element (#1)',
    async function () {
      assert.deepEqual(
        <a>
          <>{1}</>
        </a>,
        h('a', '1')
      )
    }
  )

  await t.test(
    'should support a fragment in an element (#2)',
    async function () {
      const dl = [
        ['Firefox', 'A red panda.'],
        ['Chrome', 'A chemical element.']
      ]

      assert.deepEqual(
        <dl>
          {dl.map(function ([title, definition]) {
            return (
              <>
                <dt>{title}</dt>
                <dd>{definition}</dd>
              </>
            )
          })}
        </dl>,
        h('dl', [
          h('dt', dl[0][0]),
          h('dd', dl[0][1]),
          h('dt', dl[1][0]),
          h('dd', dl[1][1])
        ])
      )
    }
  )
})
