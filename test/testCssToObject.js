const { assert, expect } = require('chai');

const cssToObject = require('../lib/cssToObject.js');

describe('cssToObject', function () {
  it('should return {result:true}', function () {
    const result = cssToObject.file('div{color:black}');
    const expected = { result: true, rules: { div: { color: "black" } } };
    assert.deepEqual(result, expected);
  });
  it('should return {result:false}', function () {
    const result = cssToObject.file('div{{}}');
    const expected = {
      result: false,
      errors: [
        { code: "SyntaxError", line: 1 }
      ]
    };
    assert.deepEqual(result, expected);
  });
});
