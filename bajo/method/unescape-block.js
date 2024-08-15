function unescapeBlock (content, start, end) {
  const { unescape } = this.app.bajo
  const idx1 = content.indexOf(start)
  if (idx1 === -1) return content
  let idx2 = content.indexOf(end)
  if (idx2 === -1) return content
  if (idx2 < idx1) {
    const tmp = content.slice(idx1)
    idx2 = tmp.indexOf(end) + idx1
  }
  const text = content.slice(idx1, idx2 + end.length)
  const result = content.replaceAll(text, unescape(text))
  return unescapeBlock.call(this, result, start, end)
}

export default unescapeBlock
