const esprima = require('esprima');
const esquery = require('esquery');
const escodegen = require('escodegen');
const espree = require('espree');
const request = require('request-promise');

const addError = (errors, errorKey) => {
  if (!errors.includes(errorKey)) {
    errors.push(errorKey);
  }
}

const defaultCheckerFunction = (array) => {
  return !array || array[0] !== undefined;
};

const checkExpressionCorrect = (tree, query, expressionName, errors, options = {}) => {
  const res = esquery(tree, query);
  const wrongExpressionError = `test.errors.js.expression.${expressionName}.wrongExpression`;
  const { checkerFunc = defaultCheckerFunction } = options;

  if (!checkerFunc(res)) {
    addError(errors, wrongExpressionError);
    return false;
  }

  return true;
}

module.exports = {
  esprima,
  esquery,
  escodegen,
  espree,
  request,
  checkExpressionCorrect,
};
