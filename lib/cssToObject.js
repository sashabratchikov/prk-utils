const cssTree = require('css-tree');
/**
 * convert css string to object like {selector{property:value}}
 * TODO:need double selector error?
 */
module.exports.line = function (css) {
  css = String(css);
  const parseErrors = [];
  const tree = cssTree.parse(css, {
    onParseError: function (error) {
      parseErrors.push({ code: error.name, line: error.line });
    }, positions: true, context: 'declarationList'
  });
  const properties = {};
  cssTree.walk(tree, function (node) {
    if (node.type === 'Declaration') {
      properties[node.property] = cssTree.generate(node.value);
    }
  });
  if (parseErrors.length > 0)
    return {
      result: false,
      errors: parseErrors
    };
  return {
    result: true,
    properties
  };
}
module.exports.file = function (css) {
  css = String(css);
  const parseErrors = [];
  const tree = cssTree.parse(css, {
    onParseError: function (error) {
      parseErrors.push({ code: error.name, line: error.line });
    }, positions: true
  });
  const rules = [];
  cssTree.walk(tree, function (node) {
    if (node.type === 'Rule') {
      rules.push(node);
    }
  });
  const rulesObject = {};
  for (let rule of rules) {
    rulesObject[cssTree.generate(rule.prelude)] = {};
    cssTree.walk(rule, function (node) {
      if (node.type === 'Declaration') {
        rulesObject[cssTree.generate(rule.prelude)][node.property] = cssTree.generate(node.value);
      }
    });
  }
  if (parseErrors.length > 0)
    return {
      result: false,
      errors: parseErrors
    };
  return {
    result: true,
    rules: rulesObject
  };
}
