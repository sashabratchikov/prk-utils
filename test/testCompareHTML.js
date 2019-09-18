const { assert, expect } = require('chai');

const rewire = require("rewire");

const compareHTML = require('../lib/compareHTML.js');
const compareHTMLrewire = rewire('../lib/compareHTML.js');
const checkChars = compareHTMLrewire.__get__('checkChars');
const checkClass = compareHTMLrewire.__get__('checkClass');
const checkHref = compareHTMLrewire.__get__('checkHref');
const checkAttributes = compareHTMLrewire.__get__('checkAttributes');
const cmpTokens = compareHTMLrewire.__get__('cmpTokens');
const getStyles = compareHTMLrewire.__get__('getStyles');
const checkStyleAttribute = compareHTMLrewire.__get__('checkStyleAttribute');
const checkStyle = compareHTMLrewire.__get__('checkStyle');

describe('checkChar', function () {
  it('should return {result:true}', function () {
    const token1 = { chars: 'text' };
    const token2 = { chars: 'text' };
    const result = checkChars(token1, token2);
    const expected = { result: true };
    assert.deepEqual(result, expected);
  });
  it('should return {result:true}', function () {
    const token1 = { chars: 'Чёрный' };
    const token2 = { chars: 'черный' };
    const result = checkChars(token1, token2);
    const expected = { result: true };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const token1 = { chars: 'белый', location: { startLine: 5 } };
    const token2 = { chars: 'черный' };
    const result = checkChars(token1, token2);
    const expected = {
      result: false,
      error: "wrongText",
      expected: "черный",
      line: 5,
      real: "белый"
    };
    assert.deepEqual(result, expected);
  });
});

describe('checkClass', function () {
  it('should return {result:true}', function () {
    const result = checkClass('  class1    class2', '  class2     class1 ', { startLine: 6 });
    const expected = { result: true };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false} no class', function () {
    const result = checkClass('  class1 class2', 'classNeed     class1', { startLine: 7 });
    const expected = {
      result: false,
      className: "classNeed",
      error: "needClass"
    };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false} 2 classes', function () {
    const result = checkClass('class1 classWrong', 'class1', { startLine: 8 });
    const expected = {
      result: false,
      className: "classWrong",
      error: "redundantClass"
    };
    assert.deepEqual(result, expected);
  });
});

describe('checkHref', function () {
  it('should return {result:true}', function () {
    const result = checkHref('site.net', 'site.net', { startLine: 6 });
    const expected = { result: true };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const result = checkHref('otherSite.net', 'site.net', { startLine: 7 });
    const expected = {
      result: false,
      expected: "site.net",
      real: "otherSite.net",
      error: "wrongAttributeValue",
      attributeName: "href"
    };
    assert.deepEqual(result, expected);
  });
  xit('should return {result:true}', function () {
    const result = checkHref('site.net', 'https://site.net/', { startLine: 8 });
    const expected = { result: true };
    assert.deepEqual(result, expected);
  });
});
describe('checkAttributes', function () {
  it('should return {result:true}', function () {
    const token1 = {
      attrs: [
        { name: "attr2", value: "val2" },
        { name: "attr1", value: "val1" }
      ],
      location: {
        attrs: { arrt2: { startLine: 2 }, arrt1: { startLine: 1 } }
      }
    };
    const token2 = {
      attrs: [
        { name: "attr1", value: "val1" },
        { name: "attr2", value: "val2" }
      ],
      location: {
        attrs: { arrt2: { startLine: 2 }, arrt1: { startLine: 1 } }
      }
    };
    const result = checkAttributes(token1, token2);
    const expected = { result: true };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const token1 = {
      tagName: 'tagName1',
      attrs: [
        { name: "attr2", value: "val3" },
        { name: "attr1", value: "val4" }
      ],
      location: {
        attrs: { attr2: { startLine: 5 }, attr1: { startLine: 6 } }
      }
    };
    const token2 = {
      attrs: [
        { name: "attr1", value: "val1" },
        { name: "attr2", value: "val2" }
      ],
      location: {
        attrs: { attr2: { startLine: 2 }, attr1: { startLine: 1 } }
      }
    };
    const result = checkAttributes(token1, token2);
    const expected = {
      result: false,
      attributeName: "attr1",
      error: "wrongAttributeValue",
      expected: "val1",
      line: 6,
      real: "val4",
      tagName: 'tagName1'
    };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const token1 = {
      tagName: "funTag",
      attrs: [
        { name: "attr1", value: "val1" },
        { name: "attr2", value: "val2" }
      ],
      location: {
        attrs: { attr2: { startLine: 5 }, attr1: { startLine: 6 } },
        startLine: 4
      }
    };
    const token2 = {
      attrs: [
        { name: "attr1", value: "val1" }
      ],
      location: {
        attrs: { attr2: { startLine: 2 }, attr1: { startLine: 1 } }
      }
    };
    const result = checkAttributes(token1, token2);
    const expected = {
      result: false,
      attributeName: "attr2",
      error: "redundantAttribute",
      line: 4,
      tagName: "funTag"
    };
    assert.deepEqual(result, expected);
  });
  it('should return {result:true} special attributes', function () {
    const token1 = {
      attrs: [
        { name: "href", value: "val2" },
        { name: "class", value: "val1" },
        { name: "style", value: "color:black" }
      ],
      location: {
        attrs: { href: { startLine: 3 }, class: { startLine: 2 }, style: { startLine: 1 } }
      }
    };
    const token2 = {
      attrs: [
        { name: "href", value: "val2" },
        { name: "class", value: "val1" },
        { name: "style", value: "color:black" }
      ],
      location: {
        attrs: { href: { startLine: 3 }, class: { startLine: 2 }, style: { startLine: 1 } }
      }
    };
    const result = checkAttributes(token1, token2);
    const expected = { result: true };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false} special attributes', function () {
    const token1 = {
      tagName: 'lalal',
      attrs: [
        { name: "href", value: "valWrong1" },
        { name: "class", value: "valWrong2" }
      ],
      location: {
        attrs: { href: { startLine: 2 }, class: { startLine: 1 } }
      }
    };
    const token2 = {
      attrs: [
        { name: "href", value: "val1" },
        { name: "class", value: "val2" }
      ],
      location: {
        attrs: { arrt2: { startLine: 2 }, arrt1: { startLine: 1 } }
      }
    };
    const result = checkAttributes(token1, token2);
    const expected = {
      result: false,
      error: "wrongAttributeValue",
      attributeName: "href",
      expected: "val1",
      real: "valWrong1",
      line: 2,
      tagName: 'lalal'
    };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false} special attributes (order)', function () {
    const token1 = {
      tagName: 'megaTag',
      attrs: [
        { name: "href", value: "valWrong1" },
        { name: "class", value: "valWrong2" }
      ],
      location: {
        attrs: { href: { startLine: 2 }, class: { startLine: 1 } }
      }
    };
    const token2 = {
      attrs: [
        { name: "class", value: "val2" },
        { name: "href", value: "val1" }
      ],
      location: {
        attrs: { arrt2: { startLine: 2 }, arrt1: { startLine: 1 } }
      }
    };
    const result = checkAttributes(token1, token2);
    const expected = {
      result: false,
      error: "needClass",
      className: "val2",
      line: 1,
      tagName: 'megaTag'
    };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false} special attributes', function () {
    const token1 = {
      tagName: "123",
      attrs: [
        { name: "style", value: "color:black" },
        { name: "href", value: "valWrong1" },
        { name: "class", value: "valWrong2" },
      ],
      location: {
        attrs: { href: { startLine: 2 }, class: { startLine: 1 }, style: { startLine: 3 } }
      }
    };
    const token2 = {
      attrs: [
        { name: "style", value: "color:red" },
        { name: "href", value: "val1" },
        { name: "class", value: "val2" }
      ],
      location: {
        attrs: { arrt2: { startLine: 2 }, arrt1: { startLine: 1 } }
      }
    };
    const result = checkAttributes(token1, token2);
    const expected = {
      result: false,
      error: "CSSerror",
      code: "compareError",
      compareError: "wrongProperty",
      expected: "red",
      line: 3,
      property: "color",
      real: "black",
      tagName: "123"
    };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false} no attribute', function () {
    const token1 = {
      tagName: 'testTag',
      location: {
        attrs: {},
        startLine: 4
      }
    };
    const token2 = {
      attrs: [
        { name: "attr1", value: "val1" }
      ],
      location: {
        attrs: { attr2: { startLine: 2 }, attr1: { startLine: 1 } }
      }
    };
    const result = checkAttributes(token1, token2);
    const expected = {
      result: false,
      attributeName: "attr1",
      error: "needAttribute",
      line: 4,
      tagName: 'testTag'
    };
    assert.deepEqual(result, expected);
  });
});
describe('cmpTokens', function () {
  it('should return {result:true}', function () {
    const token1 = {
      type: "CHARACTER_TOKEN",
      chars: 'белый'
    };
    const token2 = {
      type: "CHARACTER_TOKEN",
      chars: 'белый'
    };
    const result = cmpTokens(token1, token2);
    const expected = { result: true };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const token1 = {
      type: "WRONG2TYPE",
      location: { startLine: 25 }
    };
    const token2 = {
      type: "TYPE1"
    };
    const result = cmpTokens(token1, token2);
    const expected = {
      result: false,
      error: "wrongType",
      expected: "TYPE1",
      line: 25,
      real: "WRONG2TYPE",
      expectedChars: undefined,
      expectedTagName: undefined,
      realChars: undefined,
      realTagName: undefined
    };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const token1 = {
      type: "START_TAG_TOKEN",
      tagName: "body",
      location: { startLine: 26 }
    };
    const token2 = {
      type: "START_TAG_TOKEN",
      tagName: "html",
    };
    const result = cmpTokens(token1, token2);
    const expected = {
      result: false,
      error: "wrongName",
      expected: "START_TAG_TOKEN",
      expectedTagName: "html",
      line: 26,
      real: "START_TAG_TOKEN",
      realTagName: "body"
    };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const token1 = {
      type: "START_TAG_TOKEN",
      tagName: "html",
      attrs: [
        { name: "attr1", value: "val1" }
      ],
      location: { startLine: 26 }
    };
    const token2 = {
      type: "START_TAG_TOKEN",
      tagName: "html",
    };
    const result = cmpTokens(token1, token2);
    const expected = {
      result: false,
      error: "redundantAttribute",
      line: 26,
      attributeName: "attr1",
      tagName: "html"
    };
    assert.deepEqual(result, expected);
  });
});
describe('getStyles', function () {
  it('should return cssString', function () {
    const styles = getStyles('<style></style><style>div{}</style>');
    const expected = [{ line: 1, text: 'div{}' }, { line: 1, text: '' }];
    assert.deepEqual(styles, expected);
  });
});
describe('checkStyleAttribute', function () {
  it('should return {result:true}', function () {
    const result = checkStyleAttribute('color:black;height:100px', 'height:100px;color:black');
    const expected = {
      result: true
    };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const result = checkStyleAttribute('color:black height:100px', 'height:100px', { startLine: 1 });
    const expected = {
      result: false,
      code: "SyntaxError",
      line: 1,
      error: "CSSerror"
    };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const result = checkStyleAttribute('color:black;height:100px', 'height:100px', { startLine: 1 });
    const expected = {
      result: false,
      code: "compareError",
      compareError: "redundantProperty",
      property: "color",
      error: "CSSerror"
    };
    assert.deepEqual(result, expected);
  });
});
describe('checkStyle', function () {
  it('should return {result:true}', function () {
    const result = checkStyle(
      '<style></style><style>div{}</style>',
      '<style></style><style>div{}</style>'
    );
    const expected = {
      result: true
    };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const result = checkStyle(
      '<style></style><style>div{color:black}</style>',
      '<style></style><style>div{}</style>'
    );
    const expected = {
      result: false,
      errors: [{
        code: "compareError",
        compareError: "redundantProperty",
        property: "color", selector: "div"
      }]
    };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const result = checkStyle(
      '<style></style><style>div{{}}</style>',
      '<style></style><style>div{}</style>'
    );
    const expected = {
      result: false,
      errors: [{ code: "SyntaxError", line: 1 }]
    };
    assert.deepEqual(result, expected);
  });
});
describe('compareHTML', function () {
  it('should return {result:true}', function () {
    const html1 = ``;
    const html2 = ``;
    const expected = {
      result: true
    };
    assert.deepEqual(compareHTML(html1, html2), expected);
  });
  it('should return {result:false}', function () {
    const html1 = `<h1></h1>`;
    const html2 = `<h1></h2>`;
    const expected = {
      result: false,
      error: "wrongName",
      expected: "END_TAG_TOKEN",
      expectedTagName: "h2",
      line: 1,
      realTagName: "h1",
      real: "END_TAG_TOKEN"
    };
    assert.deepEqual(compareHTML(html1, html2), expected);
  });
  it('should return {result:false}', function () {
    const html1 = `<style>div{{}}</style>`;
    const html2 = `<style>div{}</style>`;
    const expected = {
      result: false,
      error: "CSSerror",
      code: "SyntaxError",
      line: 1
    };
    assert.deepEqual(compareHTML(html1, html2), expected);
  });
});
