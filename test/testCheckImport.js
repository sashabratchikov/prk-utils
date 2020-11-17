const { assert, expect } = require("chai");
const checkImport = require("../lib/checkImport");
const esprima = require("esprima");

const errors = [];
const script = `import { Reviews } from './script';`;
const tree = esprima.parseModule(script, {
  jsx: true,
});

describe("checkImport", function () {
  it("should return 1 error", function () {
    checkImport(tree, "Review", "./script", errors, true);
    const result = errors;
    const expected = [
      {
        id: "test.errors.common.noImport",
        values: { name: "Review" },
      },
    ];
    assert.deepEqual(result, expected);
  });
});
