function unescapeBlock (content, start, end) {
  const { unescape, sliceString } = this.app.bajo
  const sliced = sliceString(content, start, end)
  if (!sliced) return content
  const unescaped = unescape(sliced)
  const replacer = unescaped.slice(1, unescaped.length - 1)
  const result = content.replaceAll(sliced, replacer)
  return unescapeBlock.call(this, result, start, end)
}

export default unescapeBlock
