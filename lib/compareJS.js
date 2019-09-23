const { tokenizer } = require("acorn");
const markdownString = require('./markdownString.js');
const getSmall = require('./getSmallDiff.js');

function stringify(token, stringValue, source) {
  const quotemark = source.charAt(token.start);
  const escape = new RegExp(quotemark, 'g');
  return quotemark + stringValue.replace(escape, '\\' + quotemark) + quotemark;
}

function getError(currentToken, originalToken, current, original) {
  let id = 'test.errors.common.';
  if (currentToken.type.label === 'eof') {
    id += 'needJS';
  } else if (originalToken.type.label === 'eof') {
    id += 'redundantJS';
  } else {
    id += 'compareJS';
  }
  let expected = originalToken.value, real = currentToken.value;
  if (expected === undefined) {
    expected = originalToken.type.label;
  }
  if (real === undefined) {
    real = currentToken.type.label;
  }
  if ((originalToken.type.label === 'template' && currentToken.type.label === 'template')
    || (originalToken.type.label === 'string' && currentToken.type.label === 'string')) {
    [real, expected] = getSmall(real, expected, 15);
  }
  if (originalToken.type.label === 'string') {
    expected = stringify(originalToken, expected, original);
  }
  if (currentToken.type.label === 'string') {
    real = stringify(currentToken, real, current);
  }
  expected = markdownString(expected);
  real = markdownString(real);
  return {
    id,
    values: {
      line: currentToken.loc.start.line,
      expected,
      real
    }
  };
}

module.exports = function (current, original, errors) {
  const currentTokenizer = tokenizer(current, { locations: true });
  const originalTokenizer = tokenizer(original);
  let currentToken, originalToken;
  do {
    try {
      currentToken = currentTokenizer.getToken();
    } catch (excep) {
      errors.push({ id: 'test.errors.common.LexicalErrorJS', values: { line: excep.loc.line } });
      return;
    }
    originalToken = originalTokenizer.getToken();
    if (currentToken.type.label !== originalToken.type.label || currentToken.value !== originalToken.value) {
      const error = getError(currentToken, originalToken, current, original);
      errors.push(error);
      break;
    }
  } while (currentToken.type.label !== 'eof' || originalToken.type.label !== 'eof')
}
