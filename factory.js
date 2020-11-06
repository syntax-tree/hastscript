'use strict'

var find = require('property-information/find')
var normalize = require('property-information/normalize')
var parseSelector = require('hast-util-parse-selector')
var spaceSeparated = require('space-separated-tokens')
var commaSeparated = require('comma-separated-tokens')

module.exports = factory

var own = {}.hasOwnProperty

function factory(schema, defaultTagName, caseSensitive) {
  var adjust = caseSensitive && createAdjustMap(caseSensitive)

  return h

  // Hyperscript compatible DSL for creating virtual hast trees.
  function h(selector, properties) {
    var node =
      selector == null
        ? {type: 'root', children: []}
        : parseSelector(selector, defaultTagName)
    var name = selector == null ? null : node.tagName.toLowerCase()
    var index = 1
    var property

    // Normalize the name.
    if (name != null) {
      node.tagName = adjust && own.call(adjust, name) ? adjust[name] : name
    }

    // Handle props.
    if (properties) {
      if (
        name == null ||
        typeof properties === 'string' ||
        'length' in properties ||
        isNode(name, properties)
      ) {
        // Nope, it’s something for `children`.
        index--
      } else {
        for (property in properties) {
          addProperty(schema, node.properties, property, properties[property])
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
  if (result == null || result !== result) {
    return
  }

  // Handle list values.
  if (typeof result === 'string') {
    if (info.spaceSeparated) {
      result = spaceSeparated.parse(result)
    } else if (info.commaSeparated) {
      result = commaSeparated.parse(result)
    } else if (info.commaOrSpaceSeparated) {
      result = spaceSeparated.parse(commaSeparated.parse(result).join(' '))
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

  if ((info.number || info.positiveNumber) && !isNaN(result) && result !== '') {
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
    result.push([key, value[key]].join(': '))
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
