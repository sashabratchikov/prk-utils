const { assert, expect } = require('chai');

const compareCSS = require('../lib/compareCSS.js');

describe('compareCSS', function () {
  it('should return {result:true}', function () {
    const result = compareCSS('div{color:black}', 'div{color:black}');
    const expected = { result: true };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const result = compareCSS('div{{}}');
    const expected = {
      result: false,
      errors: [
        { code: "SyntaxError", line: 1 }
      ]
    };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const result = compareCSS('div{}', 'body{}');
    const expected = {
      result: false,
      errors: [{
        code: "compareError",
        compareError: "noSelector",
        selector: "body"
      }]
    };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const result = compareCSS('div{color:black}', 'div{font-size: 14px}');
    const expected = {
      result: false,
      errors: [{
        code: "compareError",
        compareError: "noProperty",
        selector: "div",
        property: "font-size"
      }]
    };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const result = compareCSS('div{color:black}', 'div{color:red}');
    const expected = {
      result: false,
      errors: [{
        code: "compareError",
        compareError: "wrongProperty",
        selector: "div",
        property: "color",
        real: 'black',
        expected: 'red'
      }]
    };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const result = compareCSS('div{}body{}', 'body{}');
    const expected = {
      result: false,
      errors: [{
        code: "compareError",
        compareError: "redundantSelector",
        selector: "div"
      }]
    };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const result = compareCSS('div{font-size: 14px;color:black}', 'div{color:black}');
    const expected = {
      result: false,
      errors: [{
        code: "compareError",
        compareError: "redundantProperty",
        selector: "div",
        property: "font-size"
      }]
    };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const result = compareCSS('color:black', 'color:black;height:100px;', true);
    const expected = {
      result: false,
      errors: [
        {
          code: "compareError",
          compareError: "noProperty",
          property: "height"
        }
      ]
    };
    assert.deepEqual(result, expected);
  });
  it('should throw error', function () {
    expect(
      compareCSS.bind(null, 'color:black', 'color:black height:100px;', true)
    ).to.throw();
  });
});
