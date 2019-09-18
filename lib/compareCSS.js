const cssToObject = require('./cssToObject.js');

module.exports = function (current, original, attribute) {
  current = String(current);
  original = String(original);
  const currentCSS = cssToObject[attribute ? 'line' : 'file'](current);
  if (!currentCSS.result)
    return {
      result: false,
      errors: currentCSS.errors
    };
  const originalCSS = cssToObject[attribute ? 'line' : 'file'](original);
  if (!originalCSS.result) {
    throw new Error('master CSS has error');
  }
  if (attribute) {
    const propertyResult = checkProperty(currentCSS, originalCSS);
    if (!propertyResult.result) {
      return propertyResult;
    }
  } else {
    const rulesResult = checkRules(currentCSS, originalCSS);
    if (!rulesResult.result) {
      return rulesResult;
    }
  }
  return { result: true };
}
function checkProperty(currentCSS, originalCSS) {
  for (let property in originalCSS.properties) {
    if (!currentCSS.properties.hasOwnProperty(property)) {
      return {
        result: false,
        errors: [{
          code: 'compareError',
          compareError: 'noProperty',
          property
        }]
      };
    }
    if (originalCSS.properties[property] !== currentCSS.properties[property]) {
      return {
        result: false,
        errors: [{
          code: 'compareError',
          compareError: 'wrongProperty',
          property,
          real: currentCSS.properties[property],
          expected: originalCSS.properties[property]
        }]
      };
    }
  }
  for (let property in currentCSS.properties) {
    if (!originalCSS.properties.hasOwnProperty(property)) {
      return {
        result: false,
        errors: [{
          code: 'compareError',
          compareError: 'redundantProperty',
          property
        }]
      };
    }
  }
  return { result: true };
}
function checkRules(currentCSS, originalCSS) {
  for (let selector in originalCSS.rules) {
    if (!currentCSS.rules.hasOwnProperty(selector)) {
      return {
        result: false,
        errors: [{
          code: 'compareError',
          compareError: 'noSelector', selector
        }]
      };
    }
    for (let property in originalCSS.rules[selector]) {
      if (!currentCSS.rules[selector].hasOwnProperty(property)) {
        return {
          result: false,
          errors: [{
            code: 'compareError',
            compareError: 'noProperty',
            selector,
            property
          }]
        };
      }
      if (currentCSS.rules[selector][property] !== originalCSS.rules[selector][property]) {
        return {
          result: false,
          errors: [{
            code: 'compareError',
            compareError: 'wrongProperty',
            selector,
            property,
            real: currentCSS.rules[selector][property],
            expected: originalCSS.rules[selector][property]
          }]
        };
      }
    }
  }
  for (let selector in currentCSS.rules) {
    if (!originalCSS.rules.hasOwnProperty(selector)) {
      return {
        result: false,
        errors: [{
          code: 'compareError',
          compareError: 'redundantSelector', selector
        }]
      };
    }
    for (let property in currentCSS.rules[selector]) {
      if (!originalCSS.rules[selector].hasOwnProperty(property)) {
        return {
          result: false,
          errors: [{
            code: 'compareError',
            compareError: 'redundantProperty',
            selector,
            property
          }]
        };
      }
    }
  }
  return { result: true };
}
