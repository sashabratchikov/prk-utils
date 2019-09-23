const markdownString = require('./markdownString.js');
const getSmall = require('./getSmallDiff.js');

function getErrorObject(tokenError) {
  function isText(type) {
    return type === "CHARACTER_TOKEN";
  }
  function isTag(type) {
    return type === "START_TAG_TOKEN"
      || type === "END_TAG_TOKEN"
      || type === "DOCTYPE_TOKEN";
  }
  function isEnd(type) {
    return type === "EOF_TOKEN";
  }
  return {
    isTextExpected: function () {
      return isText(tokenError.expected);
    },
    isTagExpected: function () {
      return isTag(tokenError.expected);
    },
    isEndExpected: function () {
      return isEnd(tokenError.expected);
    },
    isTextReal: function () {
      return isText(tokenError.real);
    },
    isTagReal: function () {
      return isTag(tokenError.real);
    },
    isEndReal: function () {
      return isEnd(tokenError.real);
    },
    getRealTagName: function () {
      if (tokenError.real === "START_TAG_TOKEN")
        return tokenError.realTagName;
      if (tokenError.real === "END_TAG_TOKEN")
        return '/' + tokenError.realTagName;
      if (tokenError.real === "DOCTYPE_TOKEN")
        return '!DOCTYPE html';
    },
    getExpectedTagName: function () {
      if (tokenError.expected === "START_TAG_TOKEN")
        return tokenError.expectedTagName;
      if (tokenError.expected === "END_TAG_TOKEN")
        return '/' + tokenError.expectedTagName;
      if (tokenError.expected === "DOCTYPE_TOKEN")
        return '!DOCTYPE html';
    },
    getRealText: function () {
      return tokenError.realChars;
    },
    getExpectedText: function () {
      return tokenError.expectedChars;
    }
  };
}
const errorHandler = {
  wrongType: function (error) {
    const errorObj = getErrorObject(error);
    if (errorObj.isTextExpected()) {
      if (errorObj.isTagReal()) {
        return {
          id: 'test.errors.common.expectedTextRealTag', values: {
            line: error.line,
            tagName: errorObj.getRealTagName(),
            text: errorObj.getExpectedText()
          }
        };
      }
      if (errorObj.isEndReal()) {
        return {
          id: 'test.errors.common.expectedText', values: {
            line: error.line,
            text: errorObj.getExpectedText()
          }
        };
      }
    }
    if (errorObj.isTagExpected()) {
      if (errorObj.isTextReal()) {
        return {
          id: 'test.errors.common.expectedTagRealText', values: {
            line: error.line,
            tagName: errorObj.getExpectedTagName(),
            text: errorObj.getRealText()
          }
        };
      }
      if (errorObj.isEndReal()) {
        const tagName = errorObj.getExpectedTagName();
        const line = /\!doctype/i.test(tagName) ? error.line : error.line + 1;
        return {
          id: 'test.errors.common.expectedTag', values: {
            line, tagName
          }
        };
      }
      if (errorObj.isTagReal()) {
        return {
          id: 'test.errors.common.expectedTagRealTag', values: {
            line: error.line,
            tagNameExpected: errorObj.getExpectedTagName(),
            tagNameReal: errorObj.getRealTagName()
          }
        };
      }
    }
    if (errorObj.isEndExpected()) {
      if (errorObj.isTextReal()) {
        return {
          id: 'test.errors.common.redundantText', values: {
            line: error.line,
            text: errorObj.getRealText()
          }
        };
      }
      if (errorObj.isTagReal()) {
        return {
          id: 'test.errors.common.redundantTag', values: {
            line: error.line,
            tagName: errorObj.getRealTagName()
          }
        };
      }
    }
  },
  wrongName: function (error) {
    let tagNameExpected = error.expectedTagName;
    let tagNameReal = error.realTagName;
    if (error.expected === "END_TAG_TOKEN") {
      tagNameExpected = '/' + tagNameExpected;
      tagNameReal = '/' + tagNameReal;
    }
    return {
      id: 'test.errors.common.expectedTagRealTag', values: {
        line: error.line,
        tagNameExpected, tagNameReal
      }
    };
  },
  wrongText: function (error) {
    return {
      id: 'test.errors.common.expectedTextRealText', values: {
        line: error.line,
        textExpected: error.expected,
        textReal: error.real
      }
    };
  },
  needAttribute: function (error) {
    return {
      id: 'test.errors.common.needAttribute', values: {
        line: error.line,
        attr: error.attributeName,
        tagName: error.tagName
      }
    };
  },
  wrongAttributeValue: function (error) {
    const [valueReal, valueExpected] = getSmall(error.real, error.expected, 15);
    return {
      id: 'test.errors.common.wrongAttribute', values: {
        line: error.line,
        attr: error.attributeName,
        tagName: error.tagName,
        valueExpected, valueReal
      }
    };
  },
  redundantAttribute: function (error) {
    return {
      id: 'test.errors.common.redundantAttribute', values: {
        line: error.line,
        attr: error.attributeName,
        tagName: error.tagName
      }
    };
  },
  needClass: function (error) {
    return {
      id: 'test.errors.common.needClass', values: {
        line: error.line,
        className: error.className,
        tagName: error.tagName
      }
    };
  },
  redundantClass: function (error) {
    return {
      id: 'test.errors.common.redundantClass', values: {
        line: error.line,
        className: error.className,
        tagName: error.tagName
      }
    };
  },
  CSSerror: function (error) {
    if (errorHandler.hasOwnProperty(error.code)) {
      return errorHandler[error.code](error);
    }
  },
  JSinHTML: function (error) {
    return error.body;
  },
  compareError: function (error) {
    if (!error.selector) {
      if (error.compareError === "noProperty")
        return {
          id: 'test.errors.common.compareErrorNoPropertyStyleAttribute', values: {
            line: error.line,
            tagName: error.tagName,
            property: error.property
          }
        };
      if (error.compareError === "wrongProperty")
        return {
          id: 'test.errors.common.compareErrorWrongPropertyStyleAttribute', values: {
            line: error.line,
            tagName: error.tagName,
            property: error.property,
            expected: error.expected,
            real: error.real
          }
        };
      if (error.compareError === "redundantProperty")
        return {
          id: 'test.errors.common.compareErrorRedundantPropertyStyleAttribute', values: {
            line: error.line,
            tagName: error.tagName,
            property: error.property
          }
        };
    } else {
      if (error.compareError === "noSelector")
        return {
          id: 'test.errors.common.compareErrorNoSelectorStyleTag', values: {
            selector: error.selector
          }
        };
      if (error.compareError === "noProperty")
        return {
          id: 'test.errors.common.compareErrorNoPropertyStyleTag', values: {
            selector: error.selector,
            property: error.property
          }
        };
      if (error.compareError === "wrongProperty")
        return {
          id: 'test.errors.common.compareErrorWrongPropertyStyleTag', values: {
            selector: error.selector,
            property: error.property,
            expected: error.expected,
            real: error.real
          }
        };
      if (error.compareError === "redundantSelector")
        return {
          id: 'test.errors.common.compareErrorRedundantSelectorStyleTag', values: {
            selector: error.selector
          }
        };
      if (error.compareError === "redundantProperty")
        return {
          id: 'test.errors.common.compareErrorRedundantPropertyStyleTag', values: {
            selector: error.selector,
            property: error.property
          }
        };
    }
  },
  SyntaxError: function (error) {
    if (error.tagName) {
      return {
        id: 'test.errors.common.SyntaxErrorStyleAttribute', values: {
          line: error.line,
          tagName: error.tagName
        }
      };
    } else {
      return {
        id: 'test.errors.common.SyntaxErrorStyleTag', values: {
          line: error.line
        }
      };
    }
  }
};
module.exports = function (error) {
  if (error.result || !error.error) {
    throw new Error('NOT ERROR');
  }
  if (errorHandler.hasOwnProperty(error.error)) {
    const outputError = errorHandler[error.error](error);
    if (typeof outputError === 'object') {
      for (let key in outputError.values) {
        outputError.values[key] = markdownString(outputError.values[key]);
      }
      return outputError;
    }
  }
  return { id: 'trainer.testSyntaxError' };
}
