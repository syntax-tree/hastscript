import assert from 'node:assert/strict'
import test from 'node:test'
import {h, s} from '../index.js'
import {h as hFromRoot} from '../html.js'
import {s as sFromRoot} from '../svg.js'
import * as coreMod from '../index.js'
import * as htmlMod from '../html.js'
import * as svgMod from '../svg.js'
import * as jsxCoreMod from '../jsx-runtime.js'
import * as jsxHtmlMod from '../html/jsx-runtime.js'
import * as jsxSvgMod from '../svg/jsx-runtime.js'

test('api', () => {
  assert.deepEqual(
    Object.keys(coreMod).sort(),
    ['h', 's'],
    'should expose the public api (`/`)'
  )
  assert.deepEqual(
    Object.keys(htmlMod).sort(),
    ['h'],
    'should expose the public api (`/html`)'
  )
  assert.deepEqual(
    Object.keys(svgMod).sort(),
    ['s'],
    'should expose the public api (`/svg`)'
  )
  assert.deepEqual(
    Object.keys(jsxCoreMod).sort(),
    ['Fragment', 'jsx', 'jsxDEV', 'jsxs'],
    'should expose the public api (`/jsx-runtime`)'
  )
  assert.deepEqual(
    Object.keys(jsxHtmlMod).sort(),
    ['Fragment', 'jsx', 'jsxDEV', 'jsxs'],
    'should expose the public api (`/html/jsx-runtime`)'
  )
  assert.deepEqual(
    Object.keys(jsxSvgMod).sort(),
    ['Fragment', 'jsx', 'jsxDEV', 'jsxs'],
    'should expose the public api (`/svg/jsx-runtime`)'
  )
})

test('hastscript', async (t) => {
  assert.equal(h, hFromRoot, '`h` should be exposed from `/html.js`')
  assert.equal(s, sFromRoot, '`s` should be exposed from `/svg.js`')

  assert.equal(typeof h, 'function', 'should expose a function')

  await t.test('selector', () => {
    assert.deepEqual(
      h(),
      {type: 'root', children: []},
      'should create a `root` node without arguments'
    )

    assert.deepEqual(
      h(''),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: []
      },
      'should create a `div` element w/ an empty string name'
    )

    assert.deepEqual(
      h('.bar', {class: 'baz'}),
      {
        type: 'element',
        tagName: 'div',
        properties: {className: ['bar', 'baz']},
        children: []
      },
      'should append to the selector’s classes'
    )

    assert.deepEqual(
      h('#id'),
      {
        type: 'element',
        tagName: 'div',
        properties: {id: 'id'},
        children: []
      },
      'should create a `div` element when given an id selector'
    )

    assert.deepEqual(
      h('#a#b'),
      {
        type: 'element',
        tagName: 'div',
        properties: {id: 'b'},
        children: []
      },
      'should create an element with the last ID when given multiple in a selector'
    )

    assert.deepEqual(
      h('.foo'),
      {
        type: 'element',
        tagName: 'div',
        properties: {className: ['foo']},
        children: []
      },
      'should create a `div` element when given a class selector'
    )

    assert.deepEqual(
      h('foo'),
      {
        type: 'element',
        tagName: 'foo',
        properties: {},
        children: []
      },
      'should create a `foo` element when given a tag selector'
    )

    assert.deepEqual(
      h('foo#bar'),
      {
        type: 'element',
        tagName: 'foo',
        properties: {id: 'bar'},
        children: []
      },
      'should create a `foo` element with an ID when given a both as a selector'
    )

    assert.deepEqual(
      h('foo.bar'),
      {
        type: 'element',
        tagName: 'foo',
        properties: {className: ['bar']},
        children: []
      },
      'should create a `foo` element with a class when given a both as a selector'
    )

    assert.deepEqual(
      h('.foo.bar'),
      {
        type: 'element',
        tagName: 'div',
        properties: {className: ['foo', 'bar']},
        children: []
      },
      'should support multiple classes'
    )
  })

  await t.test('properties', async (t) => {
    await t.test('known property names', () => {
      assert.deepEqual(
        h('', {className: 'foo'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {className: ['foo']},
          children: []
        },
        'should support correctly cased property names'
      )

      assert.deepEqual(
        h('', {class: 'foo'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {className: ['foo']},
          children: []
        },
        'should map attributes to property names'
      )

      assert.deepEqual(
        h('', {CLASS: 'foo'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {className: ['foo']},
          children: []
        },
        'should map attribute-like values to property names'
      )

      assert.deepEqual(
        h('', {'class-name': 'foo'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {'class-name': 'foo'},
          children: []
        },
        'should *not* map property-like values to property names'
      )
    })

    await t.test('unknown property names', () => {
      assert.deepEqual(
        h('', {allowbigscreen: true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {allowbigscreen: true},
          children: []
        },
        'should keep lower-cased unknown names'
      )

      assert.deepEqual(
        h('', {allowBigScreen: true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {allowBigScreen: true},
          children: []
        },
        'should keep camel-cased unknown names'
      )

      assert.deepEqual(
        h('', {'allow_big-screen': true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {'allow_big-screen': true},
          children: []
        },
        'should keep weirdly cased unknown names'
      )
    })

    await t.test('other namespaces', () => {
      assert.deepEqual(
        h('', {'aria-valuenow': 1}),
        {
          type: 'element',
          tagName: 'div',
          properties: {ariaValueNow: 1},
          children: []
        },
        'should support aria attribute names'
      )

      assert.deepEqual(
        h('', {ariaValueNow: 1}),
        {
          type: 'element',
          tagName: 'div',
          properties: {ariaValueNow: 1},
          children: []
        },
        'should support aria property names'
      )

      assert.deepEqual(
        s('', {'color-interpolation-filters': 'sRGB'}),
        {
          type: 'element',
          tagName: 'g',
          properties: {colorInterpolationFilters: 'sRGB'},
          children: []
        },
        'should support svg attribute names'
      )

      assert.deepEqual(
        s('', {colorInterpolationFilters: 'sRGB'}),
        {
          type: 'element',
          tagName: 'g',
          properties: {colorInterpolationFilters: 'sRGB'},
          children: []
        },
        'should support svg property names'
      )

      assert.deepEqual(
        s('', {'xml:space': 'preserve'}),
        {
          type: 'element',
          tagName: 'g',
          properties: {xmlSpace: 'preserve'},
          children: []
        },
        'should support xml attribute names'
      )

      assert.deepEqual(
        s('', {xmlSpace: 'preserve'}),
        {
          type: 'element',
          tagName: 'g',
          properties: {xmlSpace: 'preserve'},
          children: []
        },
        'should support xml property names'
      )

      assert.deepEqual(
        s('', {'xmlns:xlink': 'http://www.w3.org/1999/xlink'}),
        {
          type: 'element',
          tagName: 'g',
          properties: {xmlnsXLink: 'http://www.w3.org/1999/xlink'},
          children: []
        },
        'should support xmlns attribute names'
      )

      assert.deepEqual(
        s('', {xmlnsXLink: 'http://www.w3.org/1999/xlink'}),
        {
          type: 'element',
          tagName: 'g',
          properties: {xmlnsXLink: 'http://www.w3.org/1999/xlink'},
          children: []
        },
        'should support xmlns property names'
      )

      assert.deepEqual(
        s('', {'xlink:arcrole': 'http://www.example.com'}),
        {
          type: 'element',
          tagName: 'g',
          properties: {xLinkArcRole: 'http://www.example.com'},
          children: []
        },
        'should support xlink attribute names'
      )

      assert.deepEqual(
        s('', {xLinkArcRole: 'http://www.example.com'}),
        {
          type: 'element',
          tagName: 'g',
          properties: {xLinkArcRole: 'http://www.example.com'},
          children: []
        },
        'should support xlink property names'
      )
    })

    await t.test('data property names', () => {
      assert.deepEqual(
        h('', {'data-foo': true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {dataFoo: true},
          children: []
        },
        'should support data attribute names'
      )

      assert.deepEqual(
        h('', {'data-123': true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {data123: true},
          children: []
        },
        'should support numeric-first data attribute names'
      )

      assert.deepEqual(
        h('', {dataFooBar: true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {dataFooBar: true},
          children: []
        },
        'should support data property names'
      )

      assert.deepEqual(
        h('', {data123: true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {data123: true},
          children: []
        },
        'should support numeric-first data property names'
      )

      assert.deepEqual(
        h('', {'data-foo.bar': true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {'dataFoo.bar': true},
          children: []
        },
        'should support data attribute names with uncommon characters'
      )

      assert.deepEqual(
        h('', {'dataFoo.bar': true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {'dataFoo.bar': true},
          children: []
        },
        'should support data property names with uncommon characters'
      )

      assert.deepEqual(
        h('', {'data-foo!bar': true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {'data-foo!bar': true},
          children: []
        },
        'should keep invalid data attribute names'
      )

      assert.deepEqual(
        h('', {'dataFoo!bar': true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {'dataFoo!bar': true},
          children: []
        },
        'should keep invalid data property names'
      )
    })

    await t.test('unknown property values', () => {
      assert.deepEqual(
        h('', {foo: 'bar'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {foo: 'bar'},
          children: []
        },
        'should support unknown `string` values'
      )

      assert.deepEqual(
        h('', {foo: 3}),
        {
          type: 'element',
          tagName: 'div',
          properties: {foo: 3},
          children: []
        },
        'should support unknown `number` values'
      )

      assert.deepEqual(
        h('', {foo: true}),
        {
          type: 'element',
          tagName: 'div',
          properties: {foo: true},
          children: []
        },
        'should support unknown `boolean` values'
      )

      assert.deepEqual(
        h('', {list: ['bar', 'baz']}),
        {
          type: 'element',
          tagName: 'div',
          properties: {list: ['bar', 'baz']},
          children: []
        },
        'should support unknown `Array` values'
      )

      assert.deepEqual(
        h('', {foo: null}),
        {
          type: 'element',
          tagName: 'div',
          properties: {},
          children: []
        },
        'should ignore properties with a value of `null`'
      )

      assert.deepEqual(
        h('', {foo: undefined}),
        {
          type: 'element',
          tagName: 'div',
          properties: {},
          children: []
        },
        'should ignore properties with a value of `undefined`'
      )

      assert.deepEqual(
        h('', {foo: Number.NaN}),
        {
          type: 'element',
          tagName: 'div',
          properties: {},
          children: []
        },
        'should ignore properties with a value of `NaN`'
      )
    })

    await t.test('known booleans', () => {
      assert.deepEqual(
        h('', {allowFullScreen: ''}),
        {
          type: 'element',
          tagName: 'div',
          properties: {allowFullScreen: true},
          children: []
        },
        'should cast valid known `boolean` values'
      )

      assert.deepEqual(
        h('', {allowFullScreen: 'yup'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {allowFullScreen: 'yup'},
          children: []
        },
        'should not cast invalid known `boolean` values'
      )

      assert.deepEqual(
        h('img', {title: 'title'}),
        {
          type: 'element',
          tagName: 'img',
          properties: {title: 'title'},
          children: []
        },
        'should not cast unknown boolean-like values'
      )
    })

    await t.test('known overloaded booleans', () => {
      assert.deepEqual(
        h('', {download: ''}),
        {
          type: 'element',
          tagName: 'div',
          properties: {download: true},
          children: []
        },
        'should cast known empty overloaded `boolean` values'
      )

      assert.deepEqual(
        h('', {download: 'downLOAD'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {download: true},
          children: []
        },
        'should cast known named overloaded `boolean` values'
      )

      assert.deepEqual(
        h('', {download: 'example.ogg'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {download: 'example.ogg'},
          children: []
        },
        'should not cast overloaded `boolean` values for different values'
      )
    })

    await t.test('known numbers', () => {
      assert.deepEqual(
        h('textarea', {cols: '3'}),
        {
          type: 'element',
          tagName: 'textarea',
          properties: {cols: 3},
          children: []
        },
        'should cast valid known `numeric` values'
      )

      assert.deepEqual(
        h('textarea', {cols: 'one'}),
        {
          type: 'element',
          tagName: 'textarea',
          properties: {cols: 'one'},
          children: []
        },
        'should not cast invalid known `numeric` values'
      )

      assert.deepEqual(
        h('meter', {low: '40', high: '90'}),
        {
          type: 'element',
          tagName: 'meter',
          properties: {low: 40, high: 90},
          children: []
        },
        'should cast known `numeric` values'
      )
    })

    await t.test('known lists', () => {
      assert.deepEqual(
        h('', {class: 'foo bar baz'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {className: ['foo', 'bar', 'baz']},
          children: []
        },
        'should cast know space-separated `array` values'
      )

      assert.deepEqual(
        h('input', {type: 'file', accept: 'video/*, image/*'}),
        {
          type: 'element',
          tagName: 'input',
          properties: {type: 'file', accept: ['video/*', 'image/*']},
          children: []
        },
        'should cast know comma-separated `array` values'
      )

      assert.deepEqual(
        h('a', {coords: ['0', '0', '82', '126']}),
        {
          type: 'element',
          tagName: 'a',
          properties: {coords: [0, 0, 82, 126]},
          children: []
        },
        'should cast a list of known `numeric` values'
      )
    })

    await t.test('style', () => {
      assert.deepEqual(
        h('', {style: {color: 'red', '-webkit-border-radius': '3px'}}),
        {
          type: 'element',
          tagName: 'div',
          properties: {
            style: 'color: red; -webkit-border-radius: 3px'
          },
          children: []
        },
        'should support `style` as an object'
      )

      assert.deepEqual(
        h('', {style: 'color:/*red*/purple; -webkit-border-radius: 3px'}),
        {
          type: 'element',
          tagName: 'div',
          properties: {
            style: 'color:/*red*/purple; -webkit-border-radius: 3px'
          },
          children: []
        },
        'should support `style` as a string'
      )
    })
  })

  await t.test('children', () => {
    assert.deepEqual(
      h('div', {}, []),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: []
      },
      'should ignore no children'
    )

    assert.deepEqual(
      h('div', {}, 'foo'),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [{type: 'text', value: 'foo'}]
      },
      'should support `string` for a `Text`'
    )

    assert.deepEqual(
      h('div', {}, {type: 'text', value: 'foo'}),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [{type: 'text', value: 'foo'}]
      },
      'should support a node'
    )

    assert.deepEqual(
      h('div', {}, h('span', {}, 'foo')),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: {},
            children: [{type: 'text', value: 'foo'}]
          }
        ]
      },
      'should support a node created by `h`'
    )

    assert.deepEqual(
      h('div', {}, [
        {type: 'text', value: 'foo'},
        {type: 'text', value: 'bar'}
      ]),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [
          {type: 'text', value: 'foo'},
          {type: 'text', value: 'bar'}
        ]
      },
      'should support nodes'
    )

    assert.deepEqual(
      h('div', {}, [h('span', {}, 'foo'), h('strong', {}, 'bar')]),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: {},
            children: [{type: 'text', value: 'foo'}]
          },
          {
            type: 'element',
            tagName: 'strong',
            properties: {},
            children: [{type: 'text', value: 'bar'}]
          }
        ]
      },
      'should support nodes created by `h`'
    )

    assert.deepEqual(
      h('div', {}, ['foo', 'bar']),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [
          {type: 'text', value: 'foo'},
          {type: 'text', value: 'bar'}
        ]
      },
      'should support `Array<string>` for a `Text`s'
    )

    assert.deepEqual(
      h('strong', 'foo'),
      {
        type: 'element',
        tagName: 'strong',
        properties: {},
        children: [{type: 'text', value: 'foo'}]
      },
      'should allow omitting `properties` for a `string`'
    )

    assert.deepEqual(
      h('strong', h('span', 'foo')),
      {
        type: 'element',
        tagName: 'strong',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: {},
            children: [{type: 'text', value: 'foo'}]
          }
        ]
      },
      'should allow omitting `properties` for a node'
    )

    assert.deepEqual(
      h('strong', ['foo', 'bar']),
      {
        type: 'element',
        tagName: 'strong',
        properties: {},
        children: [
          {type: 'text', value: 'foo'},
          {type: 'text', value: 'bar'}
        ]
      },
      'should allow omitting `properties` for an array'
    )

    assert.deepEqual(
      h('input', {type: 'text', value: 'foo'}),
      {
        type: 'element',
        tagName: 'input',
        properties: {type: 'text', value: 'foo'},
        children: []
      },
      'should *not* allow omitting `properties` for an `input[type=text][value]`, as those are void and clash'
    )

    assert.deepEqual(
      h('a', {type: 'text/html'}),
      {
        type: 'element',
        tagName: 'a',
        properties: {type: 'text/html'},
        children: []
      },
      'should *not* allow omitting `properties` for a `[type]`, without `value` or `children`'
    )

    assert.deepEqual(
      h('foo', {type: 'text/html', children: {bar: 'baz'}}),
      {
        type: 'element',
        tagName: 'foo',
        properties: {type: 'text/html', children: '[object Object]'},
        children: []
      },
      'should *not* allow omitting `properties` when `children` is not set to an array'
    )

    assert.deepEqual(
      h('button', {type: 'submit', value: 'Send'}),
      {
        type: 'element',
        tagName: 'button',
        properties: {type: 'submit', value: 'Send'},
        children: []
      },
      'should *not* allow omitting `properties` when a button has a valid type'
    )

    assert.deepEqual(
      h('button', {type: 'BUTTON', value: 'Send'}),
      {
        type: 'element',
        tagName: 'button',
        properties: {type: 'BUTTON', value: 'Send'},
        children: []
      },
      'should *not* allow omitting `properties` when a button has a valid non-lowercase type'
    )

    assert.deepEqual(
      h('button', {type: 'menu', value: 'Send'}),
      {
        type: 'element',
        tagName: 'button',
        properties: {type: 'menu', value: 'Send'},
        children: []
      },
      'should *not* allow omitting `properties` when a button has a valid type'
    )

    assert.deepEqual(
      h('button', {type: 'text', value: 'Send'}),
      {
        type: 'element',
        tagName: 'button',
        properties: {},
        children: [{type: 'text', value: 'Send'}]
      },
      'should allow omitting `properties` when a button has an invalid type'
    )

    assert.deepEqual(
      h('section', {id: 'test'}, h('p', 'first'), h('p', 'second')),
      {
        type: 'element',
        tagName: 'section',
        properties: {id: 'test'},
        children: [
          {
            type: 'element',
            tagName: 'p',
            properties: {},
            children: [{type: 'text', value: 'first'}]
          },
          {
            type: 'element',
            tagName: 'p',
            properties: {},
            children: [{type: 'text', value: 'second'}]
          }
        ]
      },
      'should allow passing multiple child nodes as arguments'
    )

    assert.deepEqual(
      h('section', h('p', 'first'), h('p', 'second')),
      {
        type: 'element',
        tagName: 'section',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'p',
            properties: {},
            children: [{type: 'text', value: 'first'}]
          },
          {
            type: 'element',
            tagName: 'p',
            properties: {},
            children: [{type: 'text', value: 'second'}]
          }
        ]
      },
      'should allow passing multiple child nodes as arguments when there is no properties argument present'
    )

    assert.throws(
      () => {
        // @ts-expect-error runtime.
        h('foo', {}, true)
      },
      /Expected node, nodes, or string, got `true`/,
      'should throw when given an invalid value'
    )
  })

  await t.test('<template>', () => {
    assert.deepEqual(
      h('template'),
      {
        type: 'element',
        tagName: 'template',
        properties: {},
        children: [],
        content: {type: 'root', children: []}
      },
      'empty template'
    )

    assert.deepEqual(
      h('template', 'Alpha'),
      {
        type: 'element',
        tagName: 'template',
        properties: {},
        children: [],
        content: {type: 'root', children: [{type: 'text', value: 'Alpha'}]}
      },
      'template with text'
    )

    assert.deepEqual(
      h('template', [h('b', 'Bold'), ' and ', h('i', 'italic'), '.']),
      {
        type: 'element',
        tagName: 'template',
        properties: {},
        children: [],
        content: {
          type: 'root',
          children: [
            {
              type: 'element',
              tagName: 'b',
              properties: {},
              children: [{type: 'text', value: 'Bold'}]
            },
            {type: 'text', value: ' and '},
            {
              type: 'element',
              tagName: 'i',
              properties: {},
              children: [{type: 'text', value: 'italic'}]
            },
            {type: 'text', value: '.'}
          ]
        }
      },
      'template with elements'
    )
  })

  await t.test('svg', () => {
    assert.deepEqual(
      s(),
      {type: 'root', children: []},
      'should create a `root` node without arguments'
    )

    assert.deepEqual(
      s(''),
      {
        type: 'element',
        tagName: 'g',
        properties: {},
        children: []
      },
      'should create a `g` element w/ an empty string name'
    )

    assert.deepEqual(
      s(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          viewBox: '0 0 500 500',
          height: '500',
          width: '500'
        },
        [
          s('title', 'SVG `<circle>` element'),
          s('circle', {cx: '120', cy: '120', r: '100'})
        ]
      ),
      {
        type: 'element',
        tagName: 'svg',
        properties: {
          xmlns: 'http://www.w3.org/2000/svg',
          xmlnsXLink: 'http://www.w3.org/1999/xlink',
          viewBox: '0 0 500 500',
          height: '500',
          width: '500'
        },
        children: [
          {
            type: 'element',
            tagName: 'title',
            properties: {},
            children: [{type: 'text', value: 'SVG `<circle>` element'}]
          },
          {
            type: 'element',
            tagName: 'circle',
            properties: {cx: '120', cy: '120', r: '100'},
            children: []
          }
        ]
      },
      'should support trees'
    )

    assert.deepEqual(
      s('circle', {class: 'foo bar'}),
      {
        type: 'element',
        tagName: 'circle',
        properties: {className: ['foo', 'bar']},
        children: []
      },
      'should cast valid known space-separated values'
    )

    assert.deepEqual(
      s('glyph', {'glyph-name': 'foo, bar'}),
      {
        type: 'element',
        tagName: 'glyph',
        properties: {glyphName: ['foo', 'bar']},
        children: []
      },
      'should cast valid known comma-separated values'
    )

    assert.deepEqual(
      s('rect', {
        requiredFeatures:
          'http://www.w3.org/TR/SVG11/feature#SVG, http://www.w3.org/TR/SVG11/feature#SVGDOM http://www.w3.org/TR/SVG11/feature#SVG-static'
      }),
      {
        type: 'element',
        tagName: 'rect',
        properties: {
          requiredFeatures: [
            'http://www.w3.org/TR/SVG11/feature#SVG',
            'http://www.w3.org/TR/SVG11/feature#SVGDOM',
            'http://www.w3.org/TR/SVG11/feature#SVG-static'
          ]
        },
        children: []
      },
      'should cast valid known comma- or space-separated values'
    )

    assert.deepEqual(
      s('path', {'stroke-opacity': '0.7'}),
      {
        type: 'element',
        tagName: 'path',
        properties: {strokeOpacity: 0.7},
        children: []
      },
      'should cast valid known numeric values'
    )

    assert.deepEqual(
      s('path', {'stroke-miterlimit': '1'}),
      {
        type: 'element',
        tagName: 'path',
        properties: {strokeMiterLimit: 1},
        children: []
      },
      'should cast valid known positive numeric values'
    )
  })

  await t.test('tag names', () => {
    assert.deepEqual(
      h('', [h('DIV'), h('dIv'), h('div')]),
      {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [
          {type: 'element', tagName: 'div', properties: {}, children: []},
          {type: 'element', tagName: 'div', properties: {}, children: []},
          {type: 'element', tagName: 'div', properties: {}, children: []}
        ]
      },
      'should create lowercase tag names'
    )

    assert.deepEqual(
      s('', [
        s('RECT'),
        s('rEcT'),
        s('rect'),
        s('feFuncA'),
        s('FEFUNCA'),
        s('fefunca')
      ]),
      {
        type: 'element',
        tagName: 'g',
        properties: {},
        children: [
          {type: 'element', tagName: 'rect', properties: {}, children: []},
          {type: 'element', tagName: 'rect', properties: {}, children: []},
          {type: 'element', tagName: 'rect', properties: {}, children: []},
          {type: 'element', tagName: 'feFuncA', properties: {}, children: []},
          {type: 'element', tagName: 'feFuncA', properties: {}, children: []},
          {type: 'element', tagName: 'feFuncA', properties: {}, children: []}
        ]
      },
      'should create lowercase SVG tag names, and fix certain cases'
    )
  })
})
