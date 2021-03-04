const parse5path = require.resolve('parse5').slice(0, -9);
const Tokenizer = require(`${parse5path}/tokenizer`);
const Mixin = require(`${parse5path}/utils/mixin`);
const locationMixin = require(`${parse5path}/extensions/location-info/tokenizer-mixin.js`);

module.exports = function (html) {
  const tokenizer = new Tokenizer();
  Mixin.install(tokenizer, locationMixin);
  tokenizer.write(html, true);
  let insideScript = false, insideStyle = false;
  return {
    getNextToken: () => {
      let token;
      do {
        token = tokenizer.getNextToken();
        if (token.type === "END_TAG_TOKEN") {
          if (token.tagName === 'script') insideScript = false;
          if (token.tagName === 'style') insideStyle = false;
        }
        if (token.type === "START_TAG_TOKEN") {
          if (token.tagName === 'script') insideScript = true;
          if (token.tagName === 'style') insideStyle = true;
        }
      } while (
        ((insideScript || insideStyle) && token.type === "CHARACTER_TOKEN")
        || token.type === "WHITESPACE_CHARACTER_TOKEN"
        || token.type === "NULL_CHARACTER_TOKEN"
        || token.type === "COMMENT_TOKEN");
      return token;
    }
  };
}
