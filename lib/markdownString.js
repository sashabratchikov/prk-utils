module.exports = function (string) {
  string = String(string);
  if (string.length > 20) {
    string = string.substring(0, 20) + '...';
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
