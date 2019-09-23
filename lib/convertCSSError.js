const markdownString = require('./markdownString.js');
const getSmall = require('./getSmallDiff.js');

module.exports = function (error) {
  if (error.result || !Array.isArray(error.errors) || !error.errors[0].code) {
    throw new Error('NOT ERROR');
  }
  const result = convert(error.errors[0]);
  if (result.values) for (let key in result.values) {
    result.values[key] = markdownString(result.values[key]);
  }
  return result;
}
function convert(error) {
  if (error.code === "SyntaxError") {
    return {
      id: 'test.errors.common.SyntaxErrorCSS', values: {
        line: error.line
      }
    };
  }
  if (error.code === "compareError") {
    if (error.compareError === "noSelector")
      return {
        id: 'test.errors.common.compareErrorNoSelector', values: {
          selector: error.selector
        }
      };
    if (error.compareError === "noProperty")
      return {
        id: 'test.errors.common.compareErrorNoProperty', values: {
          selector: error.selector,
          property: error.property
        }
      };
    if (error.compareError === "wrongProperty") {
      const [real, expected] = getSmall(error.real, error.expected, 15);
      return {
        id: 'test.errors.common.compareErrorWrongProperty', values: {
          selector: error.selector,
          property: error.property,
          expected, real
        }
      };
    }
    if (error.compareError === "redundantSelector")
      return {
        id: 'test.errors.common.compareErrorRedundantSelector', values: {
          selector: error.selector
        }
      };
    if (error.compareError === "redundantProperty")
      return {
        id: 'test.errors.common.compareErrorRedundantProperty', values: {
          selector: error.selector,
          property: error.property
        }
      };
  }
  return { id: 'trainer.testSyntaxError' };
}
