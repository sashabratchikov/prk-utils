const { assert, expect } = require('chai');

const compareHTML = require('../lib/compareHTML.js');
const convertHTMLError = require('../lib/convertHTMLError.js');

describe('compareHTML + convertHTMLError', function () {
  it('template message for trainer', function () {
    const html = `<style>
    div{{}}
    </style>`;
    const htmlMaster = `<style>div{}</style>`;
    const expected = { id: "test.errors.common.SyntaxErrorStyleTag", values: { line: '2' } };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<h1
    style="{{{"></h1>`;
    const htmlMaster = `<h1 style=""></h1>`;
    const expected = {
      id: "test.errors.common.SyntaxErrorStyleAttribute",
      values: { line: '2', tagName: "h1" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<style>
    div{}
    </style>`;
    const htmlMaster = `<style></style>`;
    const expected = {
      id: "test.errors.common.compareErrorRedundantSelectorStyleTag",
      values: { selector: "div" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<style>div{color:black}</style>`;
    const htmlMaster = `<style>div{}</style>`;
    const expected = {
      id: "test.errors.common.compareErrorRedundantPropertyStyleTag",
      values: { property: "color", selector: "div" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<style>div{color:black}</style>`;
    const htmlMaster = `<style>div{color:red}</style>`;
    const expected = {
      id: "test.errors.common.compareErrorWrongPropertyStyleTag",
      values: {
        property: "color",
        selector: "div",
        expected: "red",
        real: "black"
      }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<style>div{}</style>`;
    const htmlMaster = `<style>div{color:red}</style>`;
    const expected = {
      id: "test.errors.common.compareErrorNoPropertyStyleTag",
      values: {
        property: "color",
        selector: "div"
      }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<style></style>`;
    const htmlMaster = `<style>div{color:red}</style>`;
    const expected = {
      id: "test.errors.common.compareErrorNoSelectorStyleTag",
      values: {
        selector: "div"
      }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<h1 style="color:red"></h1>`;
    const htmlMaster = `<h1 style=""></h1>`;
    const expected = {
      id: "test.errors.common.compareErrorRedundantPropertyStyleAttribute",
      values: { line: '1', tagName: "h1", property: "color" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<h1 style="color:red"></h1>`;
    const htmlMaster = `<h1 style="color:black"></h1>`;
    const expected = {
      id: "test.errors.common.compareErrorWrongPropertyStyleAttribute",
      values: { line: '1', tagName: "h1", property: "color", expected: "black", real: "red" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<h1 style="color:red"></h1>`;
    const htmlMaster = `<h1 style="color:red;height:100px"></h1>`;
    const expected = {
      id: "test.errors.common.compareErrorNoPropertyStyleAttribute",
      values: { line: '1', tagName: "h1", property: "height" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<a href="otherSite.net">a</a>`;
    const htmlMaster = `<a href="site.net">a</a>`;
    const expected = {
      id: "test.errors.common.wrongAttribute",
      values: { attr: 'href', line: '1', tagName: "a", valueExpected: "site.net", valueReal: "otherSite.net" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<a class="c1 c2 c3">a</a>`;
    const htmlMaster = `<a class="c1 c2">a</a>`;
    const expected = {
      id: "test.errors.common.redundantClass",
      values: { line: '1', tagName: "a", className: "c3" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<a class="c1">a</a>`;
    const htmlMaster = `<a class="c1 c2">a</a>`;
    const expected = {
      id: "test.errors.common.needClass",
      values: { line: '1', tagName: "a", className: "c2" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<a class="c1">a</a>`;
    const htmlMaster = `<a>a</a>`;
    const expected = {
      id: "test.errors.common.redundantAttribute",
      values: { line: '1', attr: "class", tagName: "a" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<a width=150>a</a>`;
    const htmlMaster = `<a width=300>a</a>`;
    const expected = {
      id: "test.errors.common.wrongAttribute",
      values: { line: '1', attr: "width", tagName: "a", valueExpected: "300", valueReal: "150" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<a>a</a>`;
    const htmlMaster = `<a width=150>a</a>`;
    const expected = {
      id: "test.errors.common.needAttribute",
      values: { line: '1', attr: "width", tagName: "a" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `text1`;
    const htmlMaster = `text2`;
    const expected = {
      id: "test.errors.common.expectedTextRealText",
      values: { line: '1', textExpected: "text2", textReal: "text1" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<div>`;
    const htmlMaster = `<p>`;
    const expected = {
      id: "test.errors.common.expectedTagRealTag",
      values: { line: '1', tagNameExpected: "p", tagNameReal: "div" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `</div>`;
    const htmlMaster = `</p>`;
    const expected = {
      id: "test.errors.common.expectedTagRealTag",
      values: { line: '1', tagNameExpected: "/p", tagNameReal: "/div" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `</div>`;
    const htmlMaster = ``;
    const expected = {
      id: "test.errors.common.redundantTag",
      values: { line: '1', tagName: "/div" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<div>`;
    const htmlMaster = ``;
    const expected = {
      id: "test.errors.common.redundantTag",
      values: { line: '1', tagName: "div" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `longTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLongTextLong`;
    const htmlMaster = ``;
    const expected = {
      id: "test.errors.common.redundantText",
      values: { line: '1', text: "longTextLongTextLongTextLongTe..." }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = ``;
    const htmlMaster = `</p>`;
    const expected = {
      id: "test.errors.common.expectedTag",
      values: { line: '2', tagName: "/p" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<p>`;
    const htmlMaster = `</p>`;
    const expected = {
      id: "test.errors.common.expectedTagRealTag",
      values: { line: '1', tagNameExpected: "/p", tagNameReal: "p" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `par`;
    const htmlMaster = `</p>`;
    const expected = {
      id: "test.errors.common.expectedTagRealText",
      values: { line: '1', tagName: "/p", text: "par" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = ``;
    const htmlMaster = `<span>`;
    const expected = {
      id: "test.errors.common.expectedTag",
      values: { line: '2', tagName: "span" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `</span>`;
    const htmlMaster = `<span>`;
    const expected = {
      id: "test.errors.common.expectedTagRealTag",
      values: { line: '1', tagNameExpected: "span", tagNameReal: "/span" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `text`;
    const htmlMaster = `<span>`;
    const expected = {
      id: "test.errors.common.expectedTagRealText",
      values: { line: '1', tagName: "span", text: "text" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = ``;
    const htmlMaster = `text`;
    const expected = {
      id: "test.errors.common.expectedText",
      values: { line: '1', text: "text" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `</div>`;
    const htmlMaster = `text`;
    const expected = {
      id: "test.errors.common.expectedTextRealTag",
      values: { line: '1', text: "text", tagName: "/div" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<h1>`;
    const htmlMaster = `text`;
    const expected = {
      id: "test.errors.common.expectedTextRealTag",
      values: { line: '1', text: "text", tagName: "h1" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<!DOCTYPE html>`;
    const htmlMaster = `text`;
    const expected = {
      id: "test.errors.common.expectedTextRealTag",
      values: { line: '1', text: "text", tagName: "!DOCTYPE html" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `text`;
    const htmlMaster = `<!DOCTYPE html>`;
    const expected = {
      id: "test.errors.common.expectedTagRealText",
      values: { line: '1', text: "text", tagName: "!DOCTYPE html" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = ``;
    const htmlMaster = `<!DOCTYPE html>`;
    const expected = {
      id: "test.errors.common.expectedTag",
      values: { line: '1', tagName: "!DOCTYPE html" }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
  it('template message for trainer', function () {
    const html = `<script>
    let k = 0;</script>`;
    const htmlMaster = `<script>let j = 0;</script>`;
    const expected = {
      id: "test.errors.common.compareJS", values: {
        expected: "j", line: "2", real: "k"
      }
    };
    const result = convertHTMLError(compareHTML(html, htmlMaster));
    assert.deepEqual(result, expected);
  });
});
