const esquery_jsx = require("esquery-jsx/jsx");

module.exports = function checkImport(tree, name, path, errors, scope = false) {
  const paths = [];
  let foundName = false;
  let foundPath = false;
  if (path.includes(".jsx")) {
    paths.push(path, path.replace(".jsx", ""));
  } else {
    paths.push(path, path + ".js");
  }
  paths.forEach((item) => {
    const IMPORT_DEFAULT = `ImportDeclaration:has([local.name=${name}])`;
    const IMPORT_SCOPE = `ImportDeclaration:has([imported.name=${name}])`;
    const IMPORT_PATH = `ImportDeclaration:has([source.value='${item}'])`;
    if (scope) {
      if (esquery_jsx.query(tree, IMPORT_SCOPE).length > 0) {
        foundName = true;
      }
    } else {
      if (esquery_jsx.query(tree, IMPORT_DEFAULT).length > 0) {
        foundName = true;
      }
    }
    if (esquery_jsx.query(tree, IMPORT_PATH).length > 0) {
      foundPath = true;
    }
  });
  if (!foundName) {
    errors.push({
      id: "test.errors.common.noImport",
      values: {
        name: name,
      },
    });
  }
  if (!foundPath && foundName) {
    errors.push({
      id: "test.errors.common.wrongImportPath",
      values: {
        name: name,
      },
    });
  }
};
