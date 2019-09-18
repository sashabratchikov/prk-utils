module.exports = function (real, expected, range) {
  const length = Math.min(expected.length, real.length);
  let firstDif = 0;
  for (; firstDif < length && expected.charAt(firstDif) === real.charAt(firstDif); firstDif++);
  let left = Math.max(firstDif - range, 0);
  let rightReal = Math.min(firstDif + range, real.length);
  let rightExpected = Math.min(firstDif + range, expected.length);
  let realResult = real.substring(left, rightReal);
  let expectedResult = expected.substring(left, rightExpected);
  if (left > 0) {
    realResult = '...' + realResult;
    expectedResult = '...' + expectedResult;
  }
  if (rightReal < real.length) {
    realResult += '...';
  }
  if (rightExpected < expected.length) {
    expectedResult += '...';
  }
  return [realResult, expectedResult];
}
