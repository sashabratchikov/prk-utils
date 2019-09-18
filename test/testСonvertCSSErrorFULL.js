const { assert, expect } = require('chai');

const compareCSS = require('../lib/compareCSS.js');
const convertCSSError = require('../lib/convertCSSError.js');

describe('compareCSS + convertCSSError', function () {
  it('not error', function () {
    expect(
      convertCSSError.bind(null, { result: true })
    ).to.throw();
  });
  it('wrong error', function () {
    const result = convertCSSError({ result: false, errors: [{ code: '-' }] });
    const expected = { id: 'trainer.testSyntaxError' };
    assert.deepEqual(result, expected);
  });
  it('wrong error 2', function () {
    const result = convertCSSError({ result: false, errors: [{ code: 'compareError' }] });
    const expected = { id: 'trainer.testSyntaxError' };
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const css = `div{color:black}`;
    const cssMaster = `div{color:red}`;
    const result = convertCSSError(compareCSS(css, cssMaster));
    const expected = {
      id: "test.errors.common.compareErrorWrongProperty", values: {
        expected: "red",
        property: "color",
        real: "black",
        selector: "div"
      }
    };
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const css = `div{color:}`;
    const cssMaster = `div{color:red}`;
    const result = convertCSSError(compareCSS(css, cssMaster));
    const expected = {
      id: "test.errors.common.compareErrorWrongProperty", values: {
        expected: "red",
        property: "color",
        real: " ",
        selector: "div"
      }
    };
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const css = `div{color:red;height:67px}`;
    const cssMaster = `div{color:red}`;
    const result = convertCSSError(compareCSS(css, cssMaster));
    const expected = {
      id: "test.errors.common.compareErrorRedundantProperty",
      values: {
        property: "height", selector: "div"
      }
    };
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const css = `div{color:red} body{}`;
    const cssMaster = `div{color:red}`;
    const result = convertCSSError(compareCSS(css, cssMaster));
    const expected = {
      id: "test.errors.common.compareErrorRedundantSelector",
      values: {
        selector: "body"
      }
    };
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const css = `div{}`;
    const cssMaster = `div{color:red}`;
    const result = convertCSSError(compareCSS(css, cssMaster));
    const expected = {
      id: "test.errors.common.compareErrorNoProperty",
      values: {
        selector: "div",
        property: "color"
      }
    };
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const css = `body{}`;
    const cssMaster = `div{color:red}`;
    const result = convertCSSError(compareCSS(css, cssMaster));
    const expected = {
      id: "test.errors.common.compareErrorNoSelector",
      values: {
        selector: "div"
      }
    };
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const css = `body{{}}`;
    const cssMaster = `body{}`;
    const result = convertCSSError(compareCSS(css, cssMaster));
    const expected = {
      id: "test.errors.common.SyntaxErrorCSS",
      values: {
        line: '1'
      }
    };
    assert.deepEqual(result, expected);
  });
});
