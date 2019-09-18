const { assert, expect } = require('chai');

const rewire = require("rewire");
const convertHTMLError = require('../lib/convertHTMLError.js');
const convertHTMLErrorRequire = rewire('../lib/convertHTMLError.js');
const getErrorObject = convertHTMLErrorRequire.__get__('getErrorObject');


describe('getExpectedTagName', function () {
  it('not error', function () {
    expect(
      convertHTMLError.bind(null, { result: true })
    ).to.throw();
  });
  it('wrong error', function () {
    expect(
      convertHTMLError.bind(null, { result: false, error: false })
    ).to.throw();
  });
  it('wrong error 2', function () {
    const result = convertHTMLError({ result: false, error: 'notFunction' });
    const expected = { id: "trainer.testSyntaxError" };
    assert.deepEqual(result, expected);
  });
  it('wrong error 3', function () {
    const result = convertHTMLError({ result: false, error: 'wrongType' });
    const expected = { id: "trainer.testSyntaxError" };
    assert.deepEqual(result, expected);
  });
  it('wrong error 4', function () {
    const result = convertHTMLError({ result: false, error: 'wrongType', expected: 'EOF_TOKEN' });
    const expected = { id: "trainer.testSyntaxError" };
    assert.deepEqual(result, expected);
  });
  it('wrong error 5', function () {
    const result = convertHTMLError({ result: false, error: 'CSSerror' });
    const expected = { id: "trainer.testSyntaxError" };
    assert.deepEqual(result, expected);
  });
  it('wrong error 6', function () {
    const result = convertHTMLError({ result: false, error: 'CSSerror', code: 'compareError' });
    const expected = { id: "trainer.testSyntaxError" };
    assert.deepEqual(result, expected);
  });
  it('wrong error 7', function () {
    const result = convertHTMLError({ result: false, error: 'CSSerror', code: 'compareError', selector: 'bad' });
    const expected = { id: "trainer.testSyntaxError" };
    assert.deepEqual(result, expected);
  });
  it('wrong error 8', function () {
    const result = convertHTMLError({ result: false, error: 'wrongType', expected: 'START_TAG_TOKEN' });
    const expected = { id: "trainer.testSyntaxError" };
    assert.deepEqual(result, expected);
  });
  it('wrong error 9', function () {
    const result = convertHTMLError({ result: false, error: 'wrongType', expected: "CHARACTER_TOKEN" });
    const expected = { id: "trainer.testSyntaxError" };
    assert.deepEqual(result, expected);
  });
  it('wrong error 10', function () {
    const result = getErrorObject({
      result: false,
      error: 'wrongType',
      expected: 'WRONG_TAG_TOKEN',
      real: 'WRONG_TAG_TOKEN'
    }).getExpectedTagName();
    const expected = undefined;
    assert.deepEqual(result, expected);
  });
  it('wrong error 11', function () {
    const result = getErrorObject({
      result: false,
      error: 'wrongType',
      expected: 'WRONG_TAG_TOKEN',
      real: 'WRONG_TAG_TOKEN'
    }).getRealTagName();
    const expected = undefined;
    assert.deepEqual(result, expected);
  });
});
