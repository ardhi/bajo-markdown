// based on: https://github.com/rinzool/marked-twemoji/blob/main/index.js
import * as nodeEmoji from 'node-emoji'

/**
 * Emoji extension for marked
 *
 * @memberof module:Lib
 * @typedef {object} TEmojiExtension
 * @type {object}
 * @property {string} name - Extension name
 * @property {string} level - Extension level
 * @property {function} start - Function to find the first index of the emoji in the source string
 * @property {function} tokenizer - Function to tokenize the emoji
 * @property {function} renderer - Function to render the emoji
 */
const emoji = {
  name: 'emoji',
  level: 'inline',
  start (src) {
    return src.indexOf(':')
  },
  tokenizer (src, _) {
    const rule = /^:(\w+):/
    const match = rule.exec(src)
    if (match) {
      return {
        type: 'emoji',
        raw: match[0],
        emoji: match[1]
      }
    }
  },
  renderer (token) {
    return nodeEmoji.emojify(token.raw)
  }
}

export default emoji
