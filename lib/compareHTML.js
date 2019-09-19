const getTokenizer = require('./getParse5tokenizer.js');
const compareCSS = require('./compareCSS.js');
const compareJS = require('./compareJS.js');
const parse5 = require('parse5');

function cmpTokens(tokenCurrent, tokenOriginal) {
  if (tokenCurrent.type !== tokenOriginal.type)
    return {
      result: false,
      error: 'wrongType',
      expected: tokenOriginal.type,
      expectedTagName: tokenOriginal.tagName,
      expectedChars: tokenOriginal.chars,
      real: tokenCurrent.type,
      realTagName: tokenCurrent.tagName,
      realChars: tokenCurrent.chars,
      line: tokenCurrent.location.startLine
    };
  if (tokenOriginal.type === "CHARACTER_TOKEN") {
    return checkChars(tokenCurrent, tokenOriginal);
  }
  if (tokenCurrent.tagName !== tokenOriginal.tagName)
    return {
      result: false,
      error: 'wrongName',
      expected: tokenOriginal.type,
      expectedTagName: tokenOriginal.tagName,
      real: tokenCurrent.type,
      realTagName: tokenCurrent.tagName,
      line: tokenCurrent.location.startLine
    };
  const resultAttributes = checkAttributes(tokenCurrent, tokenOriginal);
  if (!resultAttributes.result) {
    return resultAttributes;
  }
  return { result: true };
}

function checkChars(tokenCurrent, tokenOriginal) {
  const currentChars = tokenCurrent.chars
    .toLocaleLowerCase()
    .replace(/ё/g, 'е');
  const originalChars = tokenOriginal.chars
    .toLocaleLowerCase()
    .replace(/ё/g, 'е');
  if (currentChars !== originalChars)
    return {
      result: false,
      error: 'wrongText',
      expected: tokenOriginal.chars,
      real: tokenCurrent.chars,
      line: tokenCurrent.location.startLine
    };
  return { result: true };
}

function checkAttributes(tokenCurrent, tokenOriginal) {
  const attributesCurrent = {};
  if (tokenCurrent.attrs) {
    for (let attr of tokenCurrent.attrs) {
      attributesCurrent[attr.name] = attr.value;
    }
  }
  if (tokenOriginal.attrs) {
    for (let attr of tokenOriginal.attrs) {
      if (!attributesCurrent.hasOwnProperty(attr.name))
        return {
          result: false,
          error: 'needAttribute',
          tagName: tokenCurrent.tagName,
          attributeName: attr.name,
          line: tokenCurrent.location.startLine
        }
      switch (attr.name) {
        case 'class':
          const resultClass = checkClass(attributesCurrent[attr.name], attr.value);
          if (!resultClass.result) {
            resultClass.line = tokenCurrent.location.attrs[attr.name].startLine;
            resultClass.tagName = tokenCurrent.tagName;
            return resultClass;
          }
          break;
        case 'style':
          const resultStyle = checkStyleAttribute(attributesCurrent[attr.name], attr.value);
          if (!resultStyle.result) {
            resultStyle.line = tokenCurrent.location.attrs[attr.name].startLine;
            resultStyle.tagName = tokenCurrent.tagName;
            return resultStyle;
          }
          break;
        case 'href':
          const resultHref = checkHref(attributesCurrent[attr.name], attr.value);
          if (!resultHref.result) {
            resultHref.line = tokenCurrent.location.attrs[attr.name].startLine;
            resultHref.tagName = tokenCurrent.tagName;
            return resultHref;
          }
          break;
        default:
          if (attributesCurrent[attr.name] !== attr.value) {
            return {
              result: false,
              error: 'wrongAttributeValue',
              expected: attr.value,
              real: attributesCurrent[attr.name],
              attributeName: attr.name,
              tagName: tokenCurrent.tagName,
              line: tokenCurrent.location.attrs[attr.name].startLine
            };
          }
      }
      delete attributesCurrent[attr.name];
    }
  }
  const attributesCurrentNames = Object.keys(attributesCurrent);
  if (attributesCurrentNames.length > 0) {
    return {
      result: false,
      error: 'redundantAttribute',
      attributeName: attributesCurrentNames[0],
      tagName: tokenCurrent.tagName,
      line: tokenCurrent.location.startLine
    };
  }
  return { result: true };
}

function checkClass(classStrCurrent, classStrOriginal) {
  const currentClass = {};
  for (let className of classStrCurrent.split(' ')) {
    if (className.length === 0) continue;
    currentClass[className] = 1;
  }
  for (let className of classStrOriginal.split(' ')) {
    if (className.length === 0) continue;
    if (!currentClass.hasOwnProperty(className)) {
      return {
        result: false,
        error: 'needClass',
        className
      };
    }
    delete currentClass[className];
  }
  const currentClassNames = Object.keys(currentClass);
  if (currentClassNames.length > 0) {
    return {
      result: false,
      error: 'redundantClass',
      className: currentClassNames[0]
    };
  }
  return { result: true };
}

function checkHref(hrefCurrent, hrefOriginal) {
  if (hrefCurrent === hrefOriginal) return { result: true };
  return {
    result: false,
    error: 'wrongAttributeValue',
    attributeName: 'href',
    expected: hrefOriginal,
    real: hrefCurrent
  };
}

function checkStyleAttribute(styleCurrent, styleOriginal) {
  const cssResult = compareCSS(styleCurrent, styleOriginal, true);
  if (!cssResult.result) {
    return { result: false, error: 'CSSerror', ...cssResult.errors[0] };
  }
  return { result: true };
}

function getTagContent(html, tagName) {
  const styleList = [];
  const stack = [parse5.parse(html, { sourceCodeLocationInfo: true })];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node.tagName === tagName) {
      styleList.push({
        line: node.sourceCodeLocation.startLine,
        text: node.childNodes.length > 0 ? node.childNodes[0].value : ''
      });
    }
    if (!Array.isArray(node.childNodes)) continue;
    for (let child of node.childNodes) {
      stack.push(child);
    }
  }
  return styleList;
}

function checkTagContent(current, original, tagName) {
  const currentContent = getTagContent(current, tagName);
  const originalContent = getTagContent(original, tagName);
  for (let index = 0; index < currentContent.length; index++) {
    if (tagName === 'style') {
      const cssResult = compareCSS(currentContent[index].text, originalContent[index].text, false);
      if (!cssResult.result) {
        for (let errorIndex = 0; errorIndex < cssResult.errors.length; errorIndex++) {
          if (cssResult.errors[errorIndex].line) {
            cssResult.errors[errorIndex].line += currentContent[index].line - 1;
          }
        }
        return cssResult;
      }
    } else if (tagName === 'script') {
      const jsResult = [];
      compareJS(currentContent[index].text, originalContent[index].text, jsResult);
      if (jsResult.length > 0) {
        jsResult[0].values.line += currentContent[index].line - 1;
        return { result: false, error: 'JSinHTML', body: jsResult[0] };
      }
    }
  }
  return { result: true };
}

module.exports = function (current, original) {
  current = String(current);
  original = String(original);
  const tokenizerCurrent = getTokenizer(current);
  const tokenizerOriginal = getTokenizer(original);
  while (true) {
    const tokenCurrent = tokenizerCurrent.getNextToken();
    const tokenOriginal = tokenizerOriginal.getNextToken();
    if (tokenOriginal.type === "EOF_TOKEN" && tokenCurrent.type === tokenOriginal.type) {
      break;
    }
    const cmp = cmpTokens(tokenCurrent, tokenOriginal);
    if (!cmp.result) {
      return cmp;
    }
  }
  const styleResult = checkTagContent(current, original, 'style');
  if (!styleResult.result) {
    return {
      result: false,
      error: 'CSSerror',
      ...styleResult.errors[0]
    };
  }
  const scriptResult = checkTagContent(current, original, 'script');
  if (!scriptResult.result) {
    return scriptResult;
  }
  return { result: true };
}
