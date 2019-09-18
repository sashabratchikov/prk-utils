const { assert, expect } = require('chai');
const rimraf = require('rimraf');
const fs = require('fs');

const rewire = require('rewire');

const index = require('../lib/index.js');
const indexRewire = rewire('../lib/index.js');
const addError = indexRewire.__get__('addError');

describe('addError', function () {
  it('should modify array', function () {
    const errors = [];
    const errorKey = 'expr5';
    addError(errors, errorKey);
    assert.deepEqual(errors, ['expr5']);
  });
  it('should not modify array, same error', function () {
    const errors = ['expr5'];
    const errorKey = 'expr5';
    addError(errors, errorKey);
    assert.deepEqual(errors, ['expr5']);
  });
});

describe('checkExpressionCorrect', function () {
  const tree = {
    "type": "Program",
    "body": [
      {
        "type": "VariableDeclaration",
        "declarations": [
          {
            "type": "VariableDeclarator",
            "id": {
              "type": "Identifier",
              "name": "container"
            },
            "init": {
              "type": "CallExpression",
              "callee": {
                "type": "MemberExpression",
                "computed": false,
                "object": {
                  "type": "Identifier",
                  "name": "document"
                },
                "property": {
                  "type": "Identifier",
                  "name": "querySelector"
                }
              },
              "arguments": [
                {
                  "type": "Literal",
                  "value": ".container",
                  "raw": "'.container'"
                }
              ]
            }
          }
        ],
        "kind": "const"
      }
    ],
    "sourceType": "script"
  };
  it('should return true and not modify array', function () {
    const query = '[property.name = "querySelector"]';
    const expressionName = 'querySelectorExist';
    const errors = [];
    assert.strictEqual(index.checkExpressionCorrect(tree, query, expressionName, errors), true);
    assert.deepEqual(errors, []);
  });
  it('should return false and modify array', function () {
    const query = '[property.name = "log"]';
    const expressionName = 'querySelectorExist';
    const errors = [];
    const options = {};
    assert.strictEqual(index.checkExpressionCorrect(tree, query, expressionName, errors, options), false);
    assert.deepEqual(errors, ['test.errors.node.expression.querySelectorExist.wrongExpression']);
  });
  it('should return true and not modify array, checkerFunc:true', function () {
    const query = '[property.name = "querySelector"]';
    const expressionName = 'querySelectorExist';
    const errors = [];
    const options = { checkerFunc: () => true };
    assert.strictEqual(index.checkExpressionCorrect(tree, query, expressionName, errors, options), true);
    assert.deepEqual(errors, []);
  });
  it('should return false and modify array, checkerFunc:false', function () {
    const query = '[property.name = "querySelector"]';
    const expressionName = 'querySelectorExist';
    const errors = [];
    const options = { checkerFunc: () => false };
    assert.strictEqual(index.checkExpressionCorrect(tree, query, expressionName, errors, options), false);
    assert.deepEqual(errors, ['test.errors.node.expression.querySelectorExist.wrongExpression']);
  });
});

describe('checkFiles', function () {
  fs.mkdirSync('tmp');
  after('delete tmp', function () { rimraf('tmp', () => { }); });
  it('should not change array', function () {
    const errors = [];
    const indexFile = './tmp/index.html';
    fs.copyFileSync('./test/testFiles/1/index.html', indexFile);
    const answers = [{ "content": "<!DOCTYPE html>\n<html>\n<head>\n  <title>Я просто код</title>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <style>\n    h1 {\n      font-size: 90px;\n    }\n\n    h5 {\n\n    }\n\n    a {\n\n    }\n  </style>\n</head>\n<body>\n  <h1>Я бы</h1>\n  <h2>обнял</h2>\n  <h3>тебя</h3>\n  <h4>— но —</h4>\n  <h5 style=\"font-style: italic; font-size: 30px;\">я просто</h5>\n  <p><a href=\"http://embrace.t-radya.com/\" target=\"_blank\" style=\"color: steelblue; font-size: 20px;\">код</a></p>\n  <div align=\"center\"><img src=\"https://pictures.s3.yandex.net/code.gif\" alt=\"мой код\" width=\"512\"></div>\n</body>\n</html>\n", "name": indexFile, "language": "html" }];
    const expected = [];
    index.checkFiles(answers, errors);
    assert.deepEqual(errors, expected);
  });
  it('should not change array, wrong lang', function () {
    const errors = [];
    const indexFile = './tmp/index.html';
    fs.copyFileSync('./test/testFiles/2/index.html', indexFile);
    const answers = [{ "content": "", "name": indexFile, "language": "wrong" }];
    const expected = [];
    index.checkFiles(answers, errors);
    assert.deepEqual(errors, expected);
  });
  it('should change array', function () {
    const errors = [];
    const indexFile = './tmp/index.html';
    fs.copyFileSync('./test/testFiles/3/index.html', indexFile);
    const answers = [{ "content": "<!DOCTYPE html>\n<html>\n<head>\n  <title>Я просто код</title>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <style>\n    h1 {\n      font-size: 90px;\n    }\n\n    h5 {\n\n     font-style: italic;\n     font-size: 30px;\n}\n\n    a {\n\n    }\n  </style>\n</head>\n<body>\n  <h1>Я бы</h1>\n  <h2>обнял</h2>\n  <h3>тебя</h3>\n  <h4>— но —</h4>\n  <h5>я просто</h5>\n  <p><a href=\"http://embrace.t-radya.com/\" target=\"_blank\" style=\"color: steelblue; font-size: 20px;\">код</a></p>\n  <div align=\"center\"><img src=\"https://pictures.s3.yandex.net/code.gif\" alt=\"мой код\" width=\"512\"></div>\n</body>\n</html>\n", "name": indexFile, "language": "html" }];
    const expected = [{
      id: "test.errors.common.redundantAttribute", values: {
        attr: "style", line: "24", tagName: "h5", file: indexFile
      }
    }];
    index.checkFiles(answers, errors);
    assert.deepEqual(errors, expected);
  });
  it('should not change array', function () {
    const errors = [];
    const indexFile = './tmp/style.css';
    fs.copyFileSync('./test/testFiles/4/style.css', indexFile);
    const answers = [{ "content": "h1 {\n  font-size: 90px;\n  font-family: 'Playfair Display';\n}\n\nh2 {\n  font-family: 'Pacifico';\n  font-size: 70px;\n}\n\nh3 {\n  font-family: 'Prosto One';\n  font-size: 50px;\n}\n\nh4 {\n  font-family: 'Alegreya Sans SC';\n  font-size: 40px;\n}\n\nh5 {\n  font-style: italic;\n  font-size: 30px;\n  font-family: 'Arial';\n}\n\na {\n  color: steelblue;\n  font-size: 20px;\n}\n\ndiv {\n  text-align: center;\n}\n\nimg {\n  width: 512px;\n}\n\np {\n  font-family: 'PT Mono';\n  font-size: 20px;\n}\n", "language": "css", "name": indexFile }];
    const expected = [];
    index.checkFiles(answers, errors);
    assert.deepEqual(errors, expected);
  });
  it('should change array', function () {
    const errors = [];
    const indexFile = './tmp/style.css';
    fs.copyFileSync('./test/testFiles/5/style.css', indexFile);
    const answers = [{ "content": "h1 {\n  font-size: 90px;\n  font-family: 'Playfair Display';\n}\n\nh2 {\n  font-family: 'Pacifico';\n  font-size: 70px;\n  color: red;\n}\n\nh3 {\n  font-family: 'Prosto One';\n  font-size: 50px;\n}\n\nh4 {\n  font-family: 'Alegreya Sans SC';\n  font-size: 40px;\n}\n\nh5 {\n  font-style: italic;\n  font-size: 30px;\n  font-family: 'Arial';\n}\n\na {\n  color: steelblue;\n  font-size: 20px;\n}\n\ndiv {\n  text-align: center;\n}\n\nimg {\n  width: 512px;\n}\n\np {\n  font-family: 'PT Mono';\n  font-size: 20px;\n}\n", "language": "css", "name": indexFile }];
    const expected = [{
      id: "test.errors.common.compareErrorNoProperty", values: {
        property: "color", selector: "h2", file: indexFile
      }
    }];
    index.checkFiles(answers, errors);
    assert.deepEqual(errors, expected);
  });
  it('should change array', function () {
    const errors = [];
    const indexFile = './tmp/script.js';
    fs.copyFileSync('./test/testFiles/6/script.js', indexFile);
    const answers = [{ "content": "const k;", "language": "javascript", "name": indexFile }];
    const expected = [{
      id: "test.errors.common.compareJS", values: {
        line: 1, expected: "const", real: "let", file: indexFile
      }
    }];
    index.checkFiles(answers, errors);
    assert.deepEqual(errors, expected);
  });
  it('should change array', function () {
    const errors = [];
    const indexFile = './tmp/script2.js';
    const answers = [{ "content": "const k;", "language": "javascript", "name": indexFile }];
    const expected = [{
      id: "test.errors.common.noFile", values: {
        file: indexFile
      }
    }];
    index.checkFiles(answers, errors);
    assert.deepEqual(errors, expected);
  });
  it('should not change array', function () {
    const errors = [1];
    const answers = [];
    const expected = [1];
    index.checkFiles(answers, errors);
    assert.deepEqual(errors, expected);
  });
  it('should not change array', function () {
    const errors = null;
    const answers = [];
    const expected = null;
    index.checkFiles(answers, errors);
    assert.deepEqual(errors, expected);
  });
});
