/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module hastscript
 * @fileoverview Hyperscript compatible DSL for creating
 *   virtual HAST trees.
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var parseSelector = require('hast-util-parse-selector');
var camelcase = require('camelcase');
var propertyInformation = require('property-information');
var cssDeclarations = require('css-declarations').parse;
var spaces = require('space-separated-tokens').parse;
var commas = require('comma-separated-tokens').parse;

/**
 * Parse a (list of) primitives.
 *
 * @param {Object} info - Information.
 * @param {string} name - Property name.
 * @param {*} value - Values to parse.
 * @return {*} - Parsed `value`.
 */
function parsePrimitive(info, name, value) {
    var result = value;
    var index;
    var length;

    if (typeof value === 'object' && 'length' in value) {
        length = value.length;
        index = -1;
        result = [];

        while (++index < length) {
            result[index] = parsePrimitive(info, name, value[index]);
        }

        return result;
    }

    if (info.boolean) {
        result = true;
    } else if (info.numeric || info.positiveNumeric) {
        result = Number(result);
    } else if (info.overloadedBoolean) {
        /*
         * Accept `boolean` and `string`.
         */

        if (
            typeof result === 'string' &&
            (result === '' || value.toLowerCase() === name)
        ) {
            result = true;
        }
    }

    return result;
}

/**
 * Add `name` and its `value` to `properties`.
 * `properties` can be prefilled by `parseSelector`:
 * it can have `id` and `className` properties.
 *
 * @param {Object} properties - Attributes.
 * @param {string} name - Property name.
 * @param {*} value - Property value.
 */
function addProperty(properties, name, value) {
    var info = propertyInformation(name) || {};
    var result = value;
    var key;

    /*
     * Ignore nully and NaN values.
     */

    if (value === null || value === undefined || value !== value) {
        return;
    }

    /*
     * Handle values.
     */

    if (name === 'style') {
        /*
         * Accept both `string` and `object`.
         */

        if (typeof value === 'string') {
            result = cssDeclarations(result);
        } else {
            result = {};

            for (key in value) {
                result[key] = value[key];
            }
        }
    } else if (info.spaceSeparated) {
        /*
         * Accept both `string` and `Array`.
         */

        result = typeof value === 'string' ? spaces(result) : result;

        /*
         * Class-names (which can be added both on
         * the `selector` and here).
         */

        if (name === 'class' && properties.className) {
            result = properties.className.concat(result);
        }
    } else if (info.commaSeparated) {
        /*
         * Accept both `string` and `Array`.
         */

        result = typeof value === 'string' ? commas(result) : result;
    }

    result = parsePrimitive(info, name, result);

    properties[info.propertyName || camelcase(name)] = result;
}

/**
 * Add `value` as a child to `nodes`.
 *
 * @param {Array.<Node>} nodes - List of siblings.
 * @param {string|Node|Array.<string|Node>} value - List of
 *   children or child to add.
 */
function addChild(nodes, value) {
    var index;
    var length;

    if (value === null || value === undefined) {
        return;
    }

    if (typeof value === 'string' || typeof value === 'number') {
        value = {
            'type': 'text',
            'value': String(value)
        };
    }

    if (typeof value === 'object' && 'length' in value) {
        index = -1;
        length = value.length;

        while (++index < length) {
            addChild(nodes, value[index]);
        }

        return;
    }

    if (typeof value !== 'object' || !('type' in value)) {
        throw new Error(
            'Expected node, nodes, or string, got `' + value + '`'
        );
    }

    nodes.push(value);
}

/**
 * Check if `value` is a valid child node of
 * `tagName`.
 *
 * @param {string} tagName - Parent tag-name.
 * @param {Object} value - Node or properties like value.
 * @return {boolean} - Whether `value` is a node.
 */
function isNode(tagName, value) {
    var type = value.type;

    if (tagName === 'input' || !type || typeof type !== 'string') {
        return false;
    }

    if (typeof value.children === 'object' && 'length' in value.children) {
        return true;
    }

    if (tagName === 'button') {
        return type !== 'submit' && type !== 'reset' && type !== 'button';
    }

    return 'value' in value;
}

/**
 * Hyperscript compatible DSL for creating virtual HAST
 * trees.
 *
 * @param {string?} selector - Simple CSS selector to parse.
 * @param {Object?} properties - HTML attributes to add.
 * @param {string|Array.<string|Node>} children - List of
 *   children to add.
 * @return {Node} - HAST node.
 */
function h(selector, properties, children) {
    var node = parseSelector(selector);
    var property;

    if (
        properties &&
        !children &&
        (
            typeof properties === 'string' ||
            'length' in properties ||
            isNode(node.tagName, properties)
        )
    ) {
        children = properties;
        properties = null;
    }

    if (properties) {
        for (property in properties) {
            addProperty(node.properties, property, properties[property]);
        }
    }

    addChild(node.children, children);

    return node;
}

/*
 * Expose.
 */

module.exports = h;
