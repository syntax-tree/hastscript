import {html, svg, find, normalize} from 'property-information'
import {parseSelector} from 'hast-util-parse-selector'
import {parse as spaces} from 'space-separated-tokens'
import {parse as commas} from 'comma-separated-tokens'
import {svgCaseSensitiveTagNames} from './svg-case-sensitive-tag-names.js'

var own = {}.hasOwnProperty

export const h = factory(html, 'div')
h.displayName = 'html'

export const s = factory(svg, 'g', svgCaseSensitiveTagNames)
s.displayName = 'svg'

function factory(schema, defaultTagName, caseSensitive) {
  var adjust = caseSensitive && createAdjustMap(caseSensitive)

  return h

  // Hyperscript compatible DSL for creating virtual hast trees.
  function h(selector, properties) {
    var node =
      selector === undefined || selector === null
        ? {type: 'root', children: []}
        : parseSelector(selector, defaultTagName)
    var name =
      selector === undefined || selector === null
        ? null
        : node.tagName.toLowerCase()
    var index = 1
    var property

    // Normalize the name.
    if (name !== undefined && name !== null) {
      node.tagName = adjust && own.call(adjust, name) ? adjust[name] : name
    }

    // Handle props.
    if (properties) {
      if (
        name === undefined ||
        name === null ||
        typeof properties === 'string' ||
        'length' in properties ||
        isNode(name, properties)
      ) {
        // Nope, it’s something for `children`.
        index--
      } else {
        for (property in properties) {
          if (own.call(properties, property)) {
            addProperty(schema, node.properties, property, properties[property])
          }
        }
      }
    }

    // Handle children.
    while (++index < arguments.length) {
      addChild(node.children, arguments[index])
    }

    if (name === 'template') {
      node.content = {type: 'root', children: node.children}
      node.children = []
    }

    return node
  }
}

function isNode(name, value) {
  var type = value.type

  if (name === 'input' || !type || typeof type !== 'string') {
    return false
  }

  if (typeof value.children === 'object' && 'length' in value.children) {
    return true
  }

  type = type.toLowerCase()

  if (name === 'button') {
    return (
      type !== 'menu' &&
      type !== 'submit' &&
      type !== 'reset' &&
      type !== 'button'
    )
  }

  return 'value' in value
}

function addProperty(schema, properties, key, value) {
  var info = find(schema, key)
  var result = value
  var index = -1
  var finalResult

  // Ignore nullish and NaN values.
  if (
    result === undefined ||
    result === null ||
    (typeof result === 'number' && Number.isNaN(result))
  ) {
    return
  }

  // Handle list values.
  if (typeof result === 'string') {
    if (info.spaceSeparated) {
      result = spaces(result)
    } else if (info.commaSeparated) {
      result = commas(result)
    } else if (info.commaOrSpaceSeparated) {
      result = spaces(commas(result).join(' '))
    }
  }

  // Accept `object` on style.
  if (info.property === 'style' && typeof result !== 'string') {
    result = style(result)
  }

  // Class names (which can be added both on the `selector` and here).
  if (info.property === 'className' && properties.className) {
    result = properties.className.concat(result)
  }

  if (typeof result === 'object' && 'length' in result) {
    finalResult = []
    while (++index < result.length) {
      finalResult[index] = parsePrimitive(info, info.property, result[index])
    }
  } else {
    finalResult = parsePrimitive(info, info.property, result)
  }

  properties[info.property] = finalResult
}

function addChild(nodes, value) {
  var index = -1

  if (typeof value === 'string' || typeof value === 'number') {
    nodes.push({type: 'text', value: String(value)})
  } else if (typeof value === 'object' && 'length' in value) {
    while (++index < value.length) {
      addChild(nodes, value[index])
    }
  } else if (typeof value === 'object' && 'type' in value) {
    if (value.type === 'root') {
      addChild(nodes, value.children)
    } else {
      nodes.push(value)
    }
  } else {
    throw new Error('Expected node, nodes, or string, got `' + value + '`')
  }
}

// Parse a single primitives.
function parsePrimitive(info, name, value) {
  var result = value

  if (
    (info.number || info.positiveNumber) &&
    !Number.isNaN(Number(result)) &&
    result !== ''
  ) {
    result = Number(result)
  }

  // Accept `boolean` and `string`.
  if (
    (info.boolean || info.overloadedBoolean) &&
    typeof result === 'string' &&
    (result === '' || normalize(value) === normalize(name))
  ) {
    result = true
  }

  return result
}

function style(value) {
  var result = []
  var key

  for (key in value) {
    if (own.call(value, key)) {
      result.push([key, value[key]].join(': '))
    }
  }

  return result.join('; ')
}

function createAdjustMap(values) {
  var result = {}
  var index = -1

  while (++index < values.length) {
    result[values[index].toLowerCase()] = values[index]
  }

  return result
}
