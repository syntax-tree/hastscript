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

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;

/**
 * Parse a simple selector into a HAST node.
 *
 * @param {string?} selector - Simple CSS selector.
 * @return {Node} - HAST node.
 */
function parse(selector) {
    var id = null;
    var className = [];
    var parts = (selector || '').split(classIdSplit);
    var name = 'div';
    var node;
    var part;
    var type;
    var index;

    node = {
        'type': 'element',
        'tagName': null,
        'properties': {},
        'children': []
    };

    for (index = 0; index < parts.length; index++) {
        part = parts[index];

        if (part) {
            type = part.charAt(0);

            if (type === '.') {
                className.push(part.substring(1, part.length));
            } else if (type === '#') {
                id = part.substring(1, part.length);
            } else {
                name = part;
            }
        }
    }

    node.tagName = name.toLowerCase();
    node.properties.id = id || null;
    node.properties.className = className;

    return node;
}

module.exports = parse;
