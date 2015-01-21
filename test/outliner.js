/*!
 * test/outliner.js
 * 
 * Copyright (c) 2014
 */

/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

// 3rd party
var assert = require('chai').assert;

// lib
var outliner = require('../lib/outliner');

/* -----------------------------------------------------------------------------
 * reusable
 * ---------------------------------------------------------------------------*/

var heading = function (h, c) {
  return '<h' + h + '><a href="#' + h + '">H' + h + ' - ' + c + '</a></h' + h + '>';
};


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('outliner.js', function () {

  /* ---------------------------------------------------------------------------
   * outline()
   * -------------------------------------------------------------------------*/

  describe('outline()', function () {

    beforeEach(function () {
      this.pageContents = '';
    });

    it('Should add child nodes.', function () {
      this.pageContents += heading(1, 1);
      this.pageContents += heading(2, 1);
      this.pageContents += heading(3, 1);

      var outline = outliner.outline(this.pageContents);

      assert.equal(outline[0].text, 'H1 - 1');
      assert.equal(outline[0].children[0].text, 'H2 - 1');
      assert.equal(outline[0].children[0].children[0].text, 'H3 - 1');
    });

    it('Should add skipped child nodes.', function () {
      this.pageContents += heading(1, 1);
      this.pageContents += heading(3, 1);
      this.pageContents += heading(4, 1);

      var outline = outliner.outline(this.pageContents);

      assert.equal(outline[0].text, 'H1 - 1');
      assert.equal(outline[0].children[0].text, 'H3 - 1');
      assert.equal(outline[0].children[0].children[0].text, 'H4 - 1');
    });

    it('Should traverse back a level.', function () {
      this.pageContents += heading(1, 1);
      this.pageContents += heading(3, 1);
      this.pageContents += heading(4, 1);
      this.pageContents += heading(2, 1);

      var outline = outliner.outline(this.pageContents);

      assert.equal(outline[0].text, 'H1 - 1');
      assert.equal(outline[0].children[0].text, 'H3 - 1');
      assert.equal(outline[0].children[0].children[0].text, 'H4 - 1');
      assert.equal(outline[0].children[1].text, 'H2 - 1');
    });

    it('Should traverse back to root.', function () {
      this.pageContents += heading(2, 1);
      this.pageContents += heading(3, 1);
      this.pageContents += heading(1, 1);

      var outline = outliner.outline(this.pageContents);

      assert.equal(outline[0].text, 'H2 - 1');
      assert.equal(outline[0].children[0].text, 'H3 - 1');
      assert.equal(outline[1].text, 'H1 - 1');
    });

    it('Should only outline to specified depth.', function () {
      this.pageContents += heading(1, 1);
      this.pageContents += heading(2, 1);
      this.pageContents += heading(3, 1);

      var outline = outliner.outline(this.pageContents, 2);

      assert.equal(outline[0].text, 'H1 - 1');
      assert.equal(outline[0].children[0].text, 'H2 - 1');
      assert.notOk(outline[0].children[0].children[0]);
    });

    it('Should grab url attribute.', function () {
      this.pageContents += heading(1, 1);

      var outline = outliner.outline(this.pageContents, 2);

      assert.equal(outline[0].url, '#1');
    });

  });

});