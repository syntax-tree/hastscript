'use strict'

var test = require('tape')
var u = require('unist-builder')
var h = require('..')

test('name', function (t) {
  t.deepEqual(<a />, h('a'), 'should support a self-closing element')

  t.deepEqual(<a>b</a>, h('a', 'b'), 'should support a value as a child')

  var A = 'a'

  t.deepEqual(<A />, h(A), 'should support an uppercase tag name')

  t.deepEqual(
    <a>{1 + 1}</a>,
    h('a', '2'),
    'should support expressions as children'
  )

  t.deepEqual(<></>, u('root', []), 'should support a fragment')

  t.deepEqual(
    <>a</>,
    u('root', [u('text', 'a')]),
    'should support a fragment with text'
  )

  t.deepEqual(
    <>
      <a />
    </>,
    u('root', [h('a')]),
    'should support a fragment with an element'
  )

  t.deepEqual(
    <>{-1}</>,
    u('root', [u('text', '-1')]),
    'should support a fragment with an expression'
  )

  var com = {acme: {a: 'A', b: 'B'}}

  t.deepEqual(
    <com.acme.a />,
    h(com.acme.a),
    'should support members as names (`a.b`)'
  )

  t.deepEqual(<a b />, h('a', {b: true}), 'should support a boolean attribute')

  t.deepEqual(
    <a b="" />,
    h('a', {b: ''}),
    'should support a double quoted attribute'
  )

  t.deepEqual(
    <a b='"' />,
    h('a', {b: '"'}),
    'should support a single quoted attribute'
  )

  t.deepEqual(
    <a b={1 + 1} />,
    h('a', {b: 2}),
    'should support expression value attributes'
  )

  var props = {a: 1, b: 2}

  t.deepEqual(
    <a {...props} />,
    h('a', props),
    'should support expression spread attributes'
  )

  t.deepEqual(
    <a>
      <b />c<d>e</d>
      {1 + 1}
    </a>,
    h('a', [h('b'), 'c', h('d', 'e'), '2']),
    'should support text, elements, and expressions in jsx'
  )

  t.deepEqual(
    <a>
      <>{1}</>
    </a>,
    h('a', '1'),
    'should support a fragment in an element (#1)'
  )

  var dl = [
    ['Firefox', 'A red panda.'],
    ['Chrome', 'A chemical element.']
  ]

  t.deepEqual(
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

  t.end()
})
