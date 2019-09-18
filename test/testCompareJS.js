const { assert, expect } = require('chai');

const compareJS = require('../lib/compareJS.js');

describe('compareJS', function () {
  it('should not change array', function () {
    const errors = [];
    compareJS('let k=0', '/*c*/let k=0', errors);
    const expected = [];
    assert.deepEqual(errors, expected);
  });
  it('should change array', function () {
    const errors = [];
    compareJS('let k=0', 'const l=9', errors);
    const expected = [{
      id: "test.errors.common.compareJS", values: {
        expected: "const", line: 1, real: "let"
      }
    }];
    assert.deepEqual(errors, expected);
  });
  it('should change array', function () {
    const errors = [];
    compareJS('\n\n\n', 'const l=9', errors);
    const expected = [{
      id: "test.errors.common.needJS", values: {
        expected: "const", line: 4, real: "eof"
      }
    }];
    assert.deepEqual(errors, expected);
  });
  it('should change array', function () {
    const errors = [];
    compareJS('\n\n\nconst l=9', '', errors);
    const expected = [{
      id: "test.errors.common.redundantJS", values: {
        expected: "eof", line: 4, real: "const"
      }
    }];
    assert.deepEqual(errors, expected);
  });
  it('should change array', function () {
    const errors = [];
    compareJS('const k=`0`', 'const k=`1`', errors);
    const expected = [{
      id: "test.errors.common.compareJS", values: {
        expected: '1', line: 1, real: '0'
      }
    }];
    assert.deepEqual(errors, expected);
  });
  it('should change array', function () {
    const errors = [];
    compareJS('const k=\'------------------------------------------0------------------------------------------\'',
      'const k="------------------------------------------\\"------------------------------------------"', errors);
    const expected = [{
      id: "test.errors.common.compareJS", values: {
        expected: '"...---\\"--..."', line: 1, real: "'...---0--...'"
      }
    }];
    assert.deepEqual(errors, expected);
  });
});
