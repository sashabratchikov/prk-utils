module.exports = function (string) {
  string = String(string);
  if (string.length > 30) {
    string = string.substring(0, 30) + '...';
  }
  if (string.length === 0) {
    string = ' ';
  }
  /*
  string = string.replace(/[\\`*_{}[\]()#+-.!~]/g, function (match) {
    return '\\' + match;
  });*/
  string = string.replace(/`/g, 'ˋ');
  return string;
}
