const Tokenizer = require('../node_modules/parse5/lib/tokenizer');
const Mixin = require('../node_modules/parse5/lib/utils/mixin');
const locationMixin = require('../node_modules/parse5/lib/extensions/location-info/tokenizer-mixin.js');

module.exports = function(html) {
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
