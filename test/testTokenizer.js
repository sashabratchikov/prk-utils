const { assert, expect } = require('chai');

const getParse5tokenizer = require('../lib/getParse5tokenizer.js');

describe('HTMLtokenizer', function () {
  it('should give text text', function () {
    const tokenizer = getParse5tokenizer("text(1) text(2)");
    const text1 = tokenizer.getNextToken();
    const text1expected = {
      type: "CHARACTER_TOKEN",
      chars: "text(1)",
      location: {
        startLine: 1,
        startCol: 1,
        startOffset: 0,
        endLine: 1,
        endCol: 8,
        endOffset: 7
      }
    };
    const text2 = tokenizer.getNextToken();
    const text2expected = {
      type: "CHARACTER_TOKEN",
      chars: "text(2)",
      location: {
        startLine: 1,
        startCol: 9,
        startOffset: 8,
        endLine: 1,
        endCol: 16,
        endOffset: 15
      }
    };
    assert.deepEqual(text1, text1expected);
    assert.deepEqual(text2, text2expected);
  });
  it('should give style /style', function () {
    const tokenizer = getParse5tokenizer("<style>div{}</style>");
    const style1 = tokenizer.getNextToken();
    const style1expected = {
      type: "START_TAG_TOKEN",
      tagName: "style",
      location: {
        startLine: 1,
        startCol: 1,
        startOffset: 0,
        endLine: 1,
        endCol: 8,
        endOffset: 7
      },
      ackSelfClosing: false,
      selfClosing: false,
      attrs: []
    };
    const style2 = tokenizer.getNextToken();
    const style2expected = {
      type: "END_TAG_TOKEN",
      tagName: "style",
      location: {
        startLine: 1,
        startCol: 13,
        startOffset: 12,
        endLine: 1,
        endCol: 21,
        endOffset: 20
      },
      selfClosing: false,
      attrs: []
    };
    assert.deepEqual(style1, style1expected);
    assert.deepEqual(style2, style2expected);
  });
  it('should give script /script', function () {
    const tokenizer = getParse5tokenizer("<script>let k=0;</script>");
    const script1 = tokenizer.getNextToken();
    const script1expected = {
      type: "START_TAG_TOKEN",
      tagName: "script",
      location: {
        startLine: 1,
        startCol: 1,
        startOffset: 0,
        endLine: 1,
        endCol: 9,
        endOffset: 8
      },
      ackSelfClosing: false,
      selfClosing: false,
      attrs: []
    };
    const script2 = tokenizer.getNextToken();
    const script2expected = {
      type: "END_TAG_TOKEN",
      tagName: "script",
      location: {
        startLine: 1,
        startCol: 17,
        startOffset: 16,
        endLine: 1,
        endCol: 26,
        endOffset: 25
      },
      selfClosing: false,
      attrs: []
    };
    assert.deepEqual(script1, script1expected);
    assert.deepEqual(script2, script2expected);
  });
});
