import assert from 'node:assert/strict'
import test from 'node:test'
import {h, s} from '../index.js'

test('core', async function (t) {
  await t.test('should expose the public api (`/`)', async function () {
    assert.deepEqual(Object.keys(await import('../index.js')).sort(), [
      'h',
      's'
    ])
  })

  await t.test(
    'should expose the public api (`/jsx-runtime`)',
    async function () {
      assert.deepEqual(Object.keys(await import('../jsx-runtime.js')).sort(), [
        'Fragment',
        'jsx',
        'jsxDEV',
        'jsxs'
      ])
    }
  )

  await t.test(
    'should expose the public api (`/html/jsx-runtime`)',
    async function () {
      assert.deepEqual(
        Object.keys(await import('../html/jsx-runtime.js')).sort(),
        ['Fragment', 'jsx', 'jsxDEV', 'jsxs']
      )
    }
  )

  await t.test(
    'should expose the public api (`/svg/jsx-runtime`)',
    async function () {
      assert.deepEqual(
        Object.keys(await import('../svg/jsx-runtime.js')).sort(),
        ['Fragment', 'jsx', 'jsxDEV', 'jsxs']
      )
    }
  )
})

test('selector', async function (t) {
  await t.test(
    'should create a `root` node without arguments',
    async function () {
      assert.deepEqual(h(), {type: 'root', children: []})
    }
  )

  await t.test(
    'should create a `div` element w/ an empty string name',
    async function () {
      assert.deepEqual(h(''), {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: []
      })
    }
  )

  await t.test('should append to the selector’s classes', async function () {
    assert.deepEqual(h('.bar', {class: 'baz'}), {
      type: 'element',
      tagName: 'div',
      properties: {className: ['bar', 'baz']},
      children: []
    })
  })

  await t.test(
    'should create a `div` element when given an id selector',
    async function () {
      assert.deepEqual(h('#id'), {
        type: 'element',
        tagName: 'div',
        properties: {id: 'id'},
        children: []
      })
    }
  )

  await t.test(
    'should create an element with the last ID when given multiple in a selector',
    async function () {
      assert.deepEqual(h('#a#b'), {
        type: 'element',
        tagName: 'div',
        properties: {id: 'b'},
        children: []
      })
    }
  )

  await t.test(
    'should create a `div` element when given a class selector',
    async function () {
      assert.deepEqual(h('.foo'), {
        type: 'element',
        tagName: 'div',
        properties: {className: ['foo']},
        children: []
      })
    }
  )

  await t.test(
    'should create a `foo` element when given a tag selector',
    async function () {
      assert.deepEqual(h('foo'), {
        type: 'element',
        tagName: 'foo',
        properties: {},
        children: []
      })
    }
  )

  await t.test(
    'should create a `foo` element with an ID when given a both as a selector',
    async function () {
      assert.deepEqual(h('foo#bar'), {
        type: 'element',
        tagName: 'foo',
        properties: {id: 'bar'},
        children: []
      })
    }
  )

  await t.test(
    'should create a `foo` element with a class when given a both as a selector',
    async function () {
      assert.deepEqual(h('foo.bar'), {
        type: 'element',
        tagName: 'foo',
        properties: {className: ['bar']},
        children: []
      })
    }
  )

  await t.test('should support multiple classes', async function () {
    assert.deepEqual(h('.foo.bar'), {
      type: 'element',
      tagName: 'div',
      properties: {className: ['foo', 'bar']},
      children: []
    })
  })
})

test('property names', async function (t) {
  await t.test(
    'should support correctly cased property names',
    async function () {
      assert.deepEqual(h('', {className: 'foo'}), {
        type: 'element',
        tagName: 'div',
        properties: {className: ['foo']},
        children: []
      })
    }
  )

  await t.test('should map attributes to property names', async function () {
    assert.deepEqual(h('', {class: 'foo'}), {
      type: 'element',
      tagName: 'div',
      properties: {className: ['foo']},
      children: []
    })
  })

  await t.test(
    'should map attribute-like values to property names',
    async function () {
      assert.deepEqual(h('', {CLASS: 'foo'}), {
        type: 'element',
        tagName: 'div',
        properties: {className: ['foo']},
        children: []
      })
    }
  )

  await t.test(
    'should *not* map property-like values to property names',
    async function () {
      assert.deepEqual(h('', {'class-name': 'foo'}), {
        type: 'element',
        tagName: 'div',
        properties: {'class-name': 'foo'},
        children: []
      })
    }
  )
})

test('property names (unknown)', async function (t) {
  await t.test('should keep lower-cased unknown names', async function () {
    assert.deepEqual(h('', {allowbigscreen: true}), {
      type: 'element',
      tagName: 'div',
      properties: {allowbigscreen: true},
      children: []
    })
  })

  await t.test('should keep camel-cased unknown names', async function () {
    assert.deepEqual(h('', {allowBigScreen: true}), {
      type: 'element',
      tagName: 'div',
      properties: {allowBigScreen: true},
      children: []
    })
  })

  await t.test('should keep weirdly cased unknown names', async function () {
    assert.deepEqual(h('', {'allow_big-screen': true}), {
      type: 'element',
      tagName: 'div',
      properties: {'allow_big-screen': true},
      children: []
    })
  })
})

test('property names (other)', async function (t) {
  await t.test('should support aria attribute names', async function () {
    assert.deepEqual(h('', {'aria-valuenow': 1}), {
      type: 'element',
      tagName: 'div',
      properties: {ariaValueNow: 1},
      children: []
    })
  })

  await t.test('should support aria property names', async function () {
    assert.deepEqual(h('', {ariaValueNow: 1}), {
      type: 'element',
      tagName: 'div',
      properties: {ariaValueNow: 1},
      children: []
    })
  })

  await t.test('should support svg attribute names', async function () {
    assert.deepEqual(s('', {'color-interpolation-filters': 'sRGB'}), {
      type: 'element',
      tagName: 'g',
      properties: {colorInterpolationFilters: 'sRGB'},
      children: []
    })
  })

  await t.test('should support svg property names', async function () {
    assert.deepEqual(s('', {colorInterpolationFilters: 'sRGB'}), {
      type: 'element',
      tagName: 'g',
      properties: {colorInterpolationFilters: 'sRGB'},
      children: []
    })
  })

  await t.test('should support xml attribute names', async function () {
    assert.deepEqual(s('', {'xml:space': 'preserve'}), {
      type: 'element',
      tagName: 'g',
      properties: {xmlSpace: 'preserve'},
      children: []
    })
  })

  await t.test('should support xml property names', async function () {
    assert.deepEqual(s('', {xmlSpace: 'preserve'}), {
      type: 'element',
      tagName: 'g',
      properties: {xmlSpace: 'preserve'},
      children: []
    })
  })

  await t.test('should support xmlns attribute names', async function () {
    assert.deepEqual(s('', {'xmlns:xlink': 'http://www.w3.org/1999/xlink'}), {
      type: 'element',
      tagName: 'g',
      properties: {xmlnsXLink: 'http://www.w3.org/1999/xlink'},
      children: []
    })
  })

  await t.test('should support xmlns property names', async function () {
    assert.deepEqual(s('', {xmlnsXLink: 'http://www.w3.org/1999/xlink'}), {
      type: 'element',
      tagName: 'g',
      properties: {xmlnsXLink: 'http://www.w3.org/1999/xlink'},
      children: []
    })
  })

  await t.test('should support xlink attribute names', async function () {
    assert.deepEqual(s('', {'xlink:arcrole': 'http://www.example.com'}), {
      type: 'element',
      tagName: 'g',
      properties: {xLinkArcRole: 'http://www.example.com'},
      children: []
    })
  })

  await t.test('should support xlink property names', async function () {
    assert.deepEqual(s('', {xLinkArcRole: 'http://www.example.com'}), {
      type: 'element',
      tagName: 'g',
      properties: {xLinkArcRole: 'http://www.example.com'},
      children: []
    })
  })
})

test('data property names', async function (t) {
  await t.test('should support data attribute names', async function () {
    assert.deepEqual(h('', {'data-foo': true}), {
      type: 'element',
      tagName: 'div',
      properties: {dataFoo: true},
      children: []
    })
  })

  await t.test(
    'should support numeric-first data attribute names',
    async function () {
      assert.deepEqual(h('', {'data-123': true}), {
        type: 'element',
        tagName: 'div',
        properties: {data123: true},
        children: []
      })
    }
  )

  await t.test('should support data property names', async function () {
    assert.deepEqual(h('', {dataFooBar: true}), {
      type: 'element',
      tagName: 'div',
      properties: {dataFooBar: true},
      children: []
    })
  })

  await t.test(
    'should support numeric-first data property names',
    async function () {
      assert.deepEqual(h('', {data123: true}), {
        type: 'element',
        tagName: 'div',
        properties: {data123: true},
        children: []
      })
    }
  )

  await t.test(
    'should support data attribute names with uncommon characters',
    async function () {
      assert.deepEqual(h('', {'data-foo.bar': true}), {
        type: 'element',
        tagName: 'div',
        properties: {'dataFoo.bar': true},
        children: []
      })
    }
  )

  await t.test(
    'should support data property names with uncommon characters',
    async function () {
      assert.deepEqual(h('', {'dataFoo.bar': true}), {
        type: 'element',
        tagName: 'div',
        properties: {'dataFoo.bar': true},
        children: []
      })
    }
  )

  await t.test('should keep invalid data attribute names', async function () {
    assert.deepEqual(h('', {'data-foo!bar': true}), {
      type: 'element',
      tagName: 'div',
      properties: {'data-foo!bar': true},
      children: []
    })
  })

  await t.test('should keep invalid data property names', async function () {
    assert.deepEqual(h('', {'dataFoo!bar': true}), {
      type: 'element',
      tagName: 'div',
      properties: {'dataFoo!bar': true},
      children: []
    })
  })
})

test('property values (unknown)', async function (t) {
  await t.test('should support unknown `string` values', async function () {
    assert.deepEqual(h('', {foo: 'bar'}), {
      type: 'element',
      tagName: 'div',
      properties: {foo: 'bar'},
      children: []
    })
  })

  await t.test('should support unknown `number` values', async function () {
    assert.deepEqual(h('', {foo: 3}), {
      type: 'element',
      tagName: 'div',
      properties: {foo: 3},
      children: []
    })
  })

  await t.test('should support unknown `boolean` values', async function () {
    assert.deepEqual(h('', {foo: true}), {
      type: 'element',
      tagName: 'div',
      properties: {foo: true},
      children: []
    })
  })

  await t.test('should support unknown `Array` values', async function () {
    assert.deepEqual(h('', {list: ['bar', 'baz']}), {
      type: 'element',
      tagName: 'div',
      properties: {list: ['bar', 'baz']},
      children: []
    })
  })

  await t.test(
    'should ignore properties with a value of `null`',
    async function () {
      assert.deepEqual(h('', {foo: null}), {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: []
      })
    }
  )

  await t.test(
    'should ignore properties with a value of `undefined`',
    async function () {
      assert.deepEqual(h('', {foo: undefined}), {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: []
      })
    }
  )

  await t.test(
    'should ignore properties with a value of `NaN`',
    async function () {
      assert.deepEqual(h('', {foo: Number.NaN}), {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: []
      })
    }
  )
})

test('boolean properties', async function (t) {
  await t.test('should cast valid known `boolean` values', async function () {
    assert.deepEqual(h('', {allowFullScreen: ''}), {
      type: 'element',
      tagName: 'div',
      properties: {allowFullScreen: true},
      children: []
    })
  })

  await t.test(
    'should not cast invalid known `boolean` values',
    async function () {
      assert.deepEqual(h('', {allowFullScreen: 'yup'}), {
        type: 'element',
        tagName: 'div',
        properties: {allowFullScreen: 'yup'},
        children: []
      })
    }
  )

  await t.test(
    'should not cast unknown boolean-like values',
    async function () {
      assert.deepEqual(h('img', {title: 'title'}), {
        type: 'element',
        tagName: 'img',
        properties: {title: 'title'},
        children: []
      })
    }
  )
})

test('overloaded boolean properties', async function (t) {
  await t.test(
    'should cast known empty overloaded `boolean` values',
    async function () {
      assert.deepEqual(h('', {download: ''}), {
        type: 'element',
        tagName: 'div',
        properties: {download: true},
        children: []
      })
    }
  )

  await t.test(
    'should cast known named overloaded `boolean` values',
    async function () {
      assert.deepEqual(h('', {download: 'downLOAD'}), {
        type: 'element',
        tagName: 'div',
        properties: {download: true},
        children: []
      })
    }
  )

  await t.test(
    'should not cast overloaded `boolean` values for different values',
    async function () {
      assert.deepEqual(h('', {download: 'example.ogg'}), {
        type: 'element',
        tagName: 'div',
        properties: {download: 'example.ogg'},
        children: []
      })
    }
  )
})

test('number properties', async function (t) {
  await t.test('should cast valid known `numeric` values', async function () {
    assert.deepEqual(h('textarea', {cols: '3'}), {
      type: 'element',
      tagName: 'textarea',
      properties: {cols: 3},
      children: []
    })
  })

  await t.test(
    'should not cast invalid known `numeric` values',
    async function () {
      assert.deepEqual(h('textarea', {cols: 'one'}), {
        type: 'element',
        tagName: 'textarea',
        properties: {cols: 'one'},
        children: []
      })
    }
  )

  await t.test('should cast known `numeric` values', async function () {
    assert.deepEqual(h('meter', {low: '40', high: '90'}), {
      type: 'element',
      tagName: 'meter',
      properties: {low: 40, high: 90},
      children: []
    })
  })
})

test('list properties', async function (t) {
  await t.test(
    'should cast know space-separated `array` values',
    async function () {
      assert.deepEqual(h('', {class: 'foo bar baz'}), {
        type: 'element',
        tagName: 'div',
        properties: {className: ['foo', 'bar', 'baz']},
        children: []
      })
    }
  )

  await t.test(
    'should cast know comma-separated `array` values',
    async function () {
      assert.deepEqual(h('input', {type: 'file', accept: 'video/*, image/*'}), {
        type: 'element',
        tagName: 'input',
        properties: {type: 'file', accept: ['video/*', 'image/*']},
        children: []
      })
    }
  )

  await t.test(
    'should cast a list of known `numeric` values',
    async function () {
      assert.deepEqual(h('a', {coords: ['0', '0', '82', '126']}), {
        type: 'element',
        tagName: 'a',
        properties: {coords: [0, 0, 82, 126]},
        children: []
      })
    }
  )
})

test('style property', async function (t) {
  await t.test('should support `style` as an object', async function () {
    assert.deepEqual(
      h('', {style: {color: 'red', '-webkit-border-radius': '3px'}}),
      {
        type: 'element',
        tagName: 'div',
        properties: {
          style: 'color: red; -webkit-border-radius: 3px'
        },
        children: []
      }
    )
  })

  await t.test('should support `style` as a string', async function () {
    assert.deepEqual(
      h('', {style: 'color:/*red*/purple; -webkit-border-radius: 3px'}),
      {
        type: 'element',
        tagName: 'div',
        properties: {
          style: 'color:/*red*/purple; -webkit-border-radius: 3px'
        },
        children: []
      }
    )
  })
})

test('children', async function (t) {
  await t.test('should ignore no children', async function () {
    assert.deepEqual(h('div', {}, []), {
      type: 'element',
      tagName: 'div',
      properties: {},
      children: []
    })
  })

  await t.test('should support `string` for a `Text`', async function () {
    assert.deepEqual(h('div', {}, 'foo'), {
      type: 'element',
      tagName: 'div',
      properties: {},
      children: [{type: 'text', value: 'foo'}]
    })
  })

  await t.test('should support a node', async function () {
    assert.deepEqual(h('div', {}, {type: 'text', value: 'foo'}), {
      type: 'element',
      tagName: 'div',
      properties: {},
      children: [{type: 'text', value: 'foo'}]
    })
  })

  await t.test('should support a node created by `h`', async function () {
    assert.deepEqual(h('div', {}, h('span', {}, 'foo')), {
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
    })
  })

  await t.test('should support nodes', async function () {
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
      }
    )
  })

  await t.test('should support nodes created by `h`', async function () {
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
      }
    )
  })

  await t.test(
    'should support `Array<string>` for a `Text`s',
    async function () {
      assert.deepEqual(h('div', {}, ['foo', 'bar']), {
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [
          {type: 'text', value: 'foo'},
          {type: 'text', value: 'bar'}
        ]
      })
    }
  )

  await t.test(
    'should allow omitting `properties` for a `string`',
    async function () {
      assert.deepEqual(h('strong', 'foo'), {
        type: 'element',
        tagName: 'strong',
        properties: {},
        children: [{type: 'text', value: 'foo'}]
      })
    }
  )

  await t.test(
    'should allow omitting `properties` for a node',
    async function () {
      assert.deepEqual(h('strong', h('span', 'foo')), {
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
      })
    }
  )

  await t.test(
    'should allow omitting `properties` for an array',
    async function () {
      assert.deepEqual(h('strong', ['foo', 'bar']), {
        type: 'element',
        tagName: 'strong',
        properties: {},
        children: [
          {type: 'text', value: 'foo'},
          {type: 'text', value: 'bar'}
        ]
      })
    }
  )

  await t.test(
    'should *not* allow omitting `properties` for an `input[type=text][value]`, as those are void and clash',
    async function () {
      assert.deepEqual(h('input', {type: 'text', value: 'foo'}), {
        type: 'element',
        tagName: 'input',
        properties: {type: 'text', value: 'foo'},
        children: []
      })
    }
  )

  await t.test(
    'should *not* allow omitting `properties` for a `[type]`, without `value` or `children`',
    async function () {
      assert.deepEqual(h('a', {type: 'text/html'}), {
        type: 'element',
        tagName: 'a',
        properties: {type: 'text/html'},
        children: []
      })
    }
  )

  await t.test(
    'should *not* allow omitting `properties` when `children` is not set to an array',
    async function () {
      assert.deepEqual(h('foo', {type: 'text/html', children: {bar: 'baz'}}), {
        type: 'element',
        tagName: 'foo',
        properties: {type: 'text/html', children: '[object Object]'},
        children: []
      })
    }
  )

  await t.test(
    'should *not* allow omitting `properties` when a button has a valid type',
    async function () {
      assert.deepEqual(h('button', {type: 'submit', value: 'Send'}), {
        type: 'element',
        tagName: 'button',
        properties: {type: 'submit', value: 'Send'},
        children: []
      })
    }
  )

  await t.test(
    'should *not* allow omitting `properties` when a button has a valid non-lowercase type',
    async function () {
      assert.deepEqual(h('button', {type: 'BUTTON', value: 'Send'}), {
        type: 'element',
        tagName: 'button',
        properties: {type: 'BUTTON', value: 'Send'},
        children: []
      })
    }
  )

  await t.test(
    'should *not* allow omitting `properties` when a button has a valid type',
    async function () {
      assert.deepEqual(h('button', {type: 'menu', value: 'Send'}), {
        type: 'element',
        tagName: 'button',
        properties: {type: 'menu', value: 'Send'},
        children: []
      })
    }
  )

  await t.test(
    'should allow omitting `properties` when a button has an invalid type',
    async function () {
      assert.deepEqual(h('button', {type: 'text', value: 'Send'}), {
        type: 'element',
        tagName: 'button',
        properties: {},
        children: [{type: 'text', value: 'Send'}]
      })
    }
  )

  await t.test(
    'should allow passing multiple child nodes as arguments',
    async function () {
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
        }
      )
    }
  )

  await t.test(
    'should allow passing multiple child nodes as arguments when there is no properties argument present',
    async function () {
      assert.deepEqual(h('section', h('p', 'first'), h('p', 'second')), {
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
      })
    }
  )

  await t.test('should throw when given an invalid value', async function () {
    assert.throws(function () {
      // @ts-expect-error: check how the runtime handles a boolean instead of a child.
      h('foo', {}, true)
    }, /Expected node, nodes, or string, got `true`/)
  })
})

test('<template>', async function (t) {
  await t.test('should support an empty template', async function () {
    assert.deepEqual(h('template'), {
      type: 'element',
      tagName: 'template',
      properties: {},
      children: [],
      content: {type: 'root', children: []}
    })
  })

  await t.test('should support a template with text', async function () {
    assert.deepEqual(h('template', 'Alpha'), {
      type: 'element',
      tagName: 'template',
      properties: {},
      children: [],
      content: {type: 'root', children: [{type: 'text', value: 'Alpha'}]}
    })
  })

  await t.test('should support a template with elements', async function () {
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
      }
    )
  })
})

test('svg', async function (t) {
  await t.test(
    'should create a `root` node without arguments',
    async function () {
      assert.deepEqual(s(), {type: 'root', children: []})
    }
  )

  await t.test(
    'should create a `g` element w/ an empty string name',
    async function () {
      assert.deepEqual(s(''), {
        type: 'element',
        tagName: 'g',
        properties: {},
        children: []
      })
    }
  )

  await t.test('should support trees', async function () {
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
      }
    )
  })

  await t.test(
    'should cast valid known space-separated values',
    async function () {
      assert.deepEqual(s('circle', {class: 'foo bar'}), {
        type: 'element',
        tagName: 'circle',
        properties: {className: ['foo', 'bar']},
        children: []
      })
    }
  )

  await t.test(
    'should cast valid known comma-separated values',
    async function () {
      assert.deepEqual(s('glyph', {'glyph-name': 'foo, bar'}), {
        type: 'element',
        tagName: 'glyph',
        properties: {glyphName: ['foo', 'bar']},
        children: []
      })
    }
  )

  await t.test(
    'should cast valid known comma- or space-separated values',
    async function () {
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
        }
      )
    }
  )

  await t.test('should cast valid known numeric values', async function () {
    assert.deepEqual(s('path', {'stroke-opacity': '0.7'}), {
      type: 'element',
      tagName: 'path',
      properties: {strokeOpacity: 0.7},
      children: []
    })
  })

  await t.test(
    'should cast valid known positive numeric values',
    async function () {
      assert.deepEqual(s('path', {'stroke-miterlimit': '1'}), {
        type: 'element',
        tagName: 'path',
        properties: {strokeMiterLimit: 1},
        children: []
      })
    }
  )
})

test('tag names', async function (t) {
  await t.test('should create lowercase tag names', async function () {
    assert.deepEqual(h('', [h('DIV'), h('dIv'), h('div')]), {
      type: 'element',
      tagName: 'div',
      properties: {},
      children: [
        {type: 'element', tagName: 'div', properties: {}, children: []},
        {type: 'element', tagName: 'div', properties: {}, children: []},
        {type: 'element', tagName: 'div', properties: {}, children: []}
      ]
    })
  })

  await t.test(
    'should create lowercase SVG tag names, and fix certain cases',
    async function () {
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
        }
      )
    }
  )
})
