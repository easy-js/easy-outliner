/*!
 * utils.js
 * 
 * Copyright (c) 2014
 */

/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

// 3rd party
var _       = require('easy-utils');
var cheerio = require('cheerio');


/* -----------------------------------------------------------------------------
 * outliner
 * ---------------------------------------------------------------------------*/

/**
 * @public
 * @namespace
 *
 * @desc Module used to create document outlines based on hmtl structure.
 */
var outliner = {};

/**
 * @public
 * @memberof outliner
 *
 * @desc Create a rough document outline based on html page headings.
 *
 * @example
 * outliner.outline('<h1>1</h1><h2>2</h2>');
 *
 * @param {str} contents - HTML contents as a string.
 *
 * @returns {object} outline - Outline tree.
 */
outliner.outline = function (contents, depth) {
  var $ = cheerio.load(contents);

  // allow for a specified depth
  var headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  headings.length = depth || headings.length;

  // Build outline
  var outline  = [];
  var previous = outline;

  $(headings.join(', ')).each(function (i, el) {
    var $el      = $(el);
    var current  = outliner._child($el);
    var parent   = outliner._parent($el, current, previous);
    var location = parent.children ? parent.children : parent;

    // save a reference to our parent so that we are able
    // to traverse back up the tree.
    current.parent = parent;

    // add the new entry and cache current value
    location.push(current);
    previous = current;
  });

  return outline;
};

/**
 * @private
 * @memberof outliner
 *
 * @desc
 *
 * @param {object} $el - jQuery/cherrio el.
 */
outliner._parent = function ($el, current, previous) {
  // we should be nested under the previous node
  if (!previous.children || current.level > previous.level) {
    return previous;

  // we are brothers/sisters with the previous node :D
  } else if (current.level === previous.level) {
    return previous.parent;

  // we beed to traverse up the tree to find at what level we should
  // be appended to :(
  } else {
    return outliner._parent($el, current, previous.parent);
  }
};

/**
 * @private
 * @memberof outliner
 *
 * @desc
 *
 * @param {object} $el - jQuery/cherrio el.
 */
outliner._child = function ($el) {
  return {
    level: outliner._level($el),
    text: outliner._text($el),
    url: outliner._url($el),
    children: []
  };
};

/**
 * @private
 * @memberof outliner
 *
 * @desc
 *
 * @param {object} $el - jQuery/cherrio el.
 */
outliner._level = function ($el) {
  return parseInt($el[0].tagName.charAt(1));
};

/**
 * @private
 * @memberof outliner
 *
 * @desc
 *
 * @param {object} $el - jQuery/cherrio el.
 */
outliner._text = function ($el) {
  return $el.text();
};

/**
 * @private
 * @memberof outliner
 *
 * @desc
 *
 * @param {object} $el - jQuery/cherrio el.
 */
outliner._url = function ($el) {
  var $anchor = $el.children().first();

  return $anchor
    ? $anchor.attr('href')
    : null;
};

// var result = [
//   { text: 'H1 - 1', url: null, level: , parent: , children: [...] },
//   { text: 'H1 - 2', url: null, children: [...] }
// ]


/* -----------------------------------------------------------------------------
 * export
 * ---------------------------------------------------------------------------*/

module.exports = outliner;