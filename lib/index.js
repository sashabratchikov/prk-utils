const esprima = require('esprima');
const esquery = require('esquery');
const esquery_jsx = require('esquery-jsx/jsx');
const escodegen = require('escodegen');
const espree = require('espree');
const request = require('request-promise');
const Promise = require('bluebird');
const fs = require('fs');
const babel = require('@babel/core');
const ReactTestRenderer = require('react-test-renderer');
const React = require('react');

const compareCSS = require('./compareCSS.js');
const compareHTML = require('./compareHTML.js');
const compareJS = require('./compareJS.js');
const convertHTMLError = require('./convertHTMLError.js');
const convertCSSError = require('./convertCSSError.js');

const addError = (errors, errorKey) => {
  if (!errors.includes(errorKey)) {
    errors.push(errorKey);
  }
};

const defaultCheckerFunction = (array) => !!array && array[0] !== undefined;

const checkExpressionCorrect = (tree, query, expressionName, errors, options = {}) => {
  const res = esquery(tree, query);
  const wrongExpressionError = `test.errors.node.expression.${expressionName}.wrongExpression`;
  const { checkerFunc = defaultCheckerFunction } = options;

  if (!checkerFunc(res)) {
    addError(errors, wrongExpressionError);
    return false;
  }

  return true;
};

const __readFileMemo = {};

const readFile = (fileName) => {
  if (!__readFileMemo.hasOwnProperty(fileName)) {
    try {
      __readFileMemo[fileName] = fs.readFileSync(fileName).toString();
    } catch (excep) {
      __readFileMemo[fileName] = null;
    }
  }
  return __readFileMemo[fileName];
}

const checkFiles = (answers, errors) => {
  if (!Array.isArray(errors) || errors.length > 0) return;
  for (let answer of answers) {
    const paneContent = readFile(answer.fullName);
    if (paneContent === null) {
      const readFILEerror = {
        id: "test.errors.common.noFile",
        values: {
          file: answer.name
        }
      };
      errors.push(readFILEerror);
      return;
    }
    if (answer.language === 'html') {
      const result = compareHTML(paneContent, answer.content);
      if (!result.result) {
        addError(errors, convertHTMLError(result));
      }
    } else if (answer.language === 'css') {
      const result = compareCSS(paneContent, answer.content);
      if (!result.result) {
        addError(errors, convertCSSError(result));
      }
    } else if (answer.language === 'javascript') {
      compareJS(paneContent, answer.content, errors);
    }
    if (errors.length > 0) {
      errors[0].values.file = answer.name;
      return;
    }
  }
};

const jsxToJS = jsx => babel.transform(jsx, {
  plugins: [
    '@babel/plugin-transform-react-jsx',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-modules-commonjs'
  ]
}).code;

const tsToJS = jsx => babel.transform(jsx, {
  plugins: [
    '@babel/plugin-transform-typescript',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-modules-commonjs'
  ]
}).code;

function getReactTestRendererComponent(importStr, componentStr) {
  const old_readFileSync = fs.readFileSync;
  const mock_readFileSync = function (...args) {
    const content = old_readFileSync(...args);
    fs.readFileSync = old_readFileSync;
    const jsContent = jsxToJS(content);
    fs.readFileSync = mock_readFileSync;
    return jsContent;
  }
  const jsx = `${importStr}
  output=(${componentStr})`
  const js = jsxToJS(jsx);
  let output;
  fs.readFileSync = mock_readFileSync;
  eval(js);
  fs.readFileSync = old_readFileSync;
  return ReactTestRenderer.create(output);
}

module.exports = {
  esprima,
  esquery,
  esquery_jsx,
  escodegen,
  espree,
  request,
  Promise,
  checkExpressionCorrect,
  checkFiles,
  readFile,
  jsxToJS,
  getReactTestRendererComponent,
  tsToJS
};
