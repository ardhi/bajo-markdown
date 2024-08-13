const to = '---\n'
const tc = '\n---\n'

function parse (content, opts = {}) {
  const { unescape } = this.app.bajo
  const { isPlainObject, isArray } = this.app.bajo.lib._
  let meta
  let text = content.replaceAll('\r\n', '\n')
  const open = text.indexOf(to)
  if (open > -1) {
    text = text.slice(open + to.length)
    const close = text.indexOf(tc)
    if (close > -1) {
      meta = text.slice(0, close)
      content = text.slice(close + tc.length)
    }
  }
  if (meta) {
    meta = meta.replaceAll('&quot;', '"')
    const handlers = []
    if (this.app.bajoConfig) handlers.push(this.app.bajoConfig.fromYaml, this.app.bajoConfig.fromToml)
    handlers.push(JSON.parse)
    let success = false
    for (const h of handlers) {
      if (success) break
      try {
        meta = h(meta, true)
        if (isPlainObject(meta) || isArray(meta)) success = true
        else meta = undefined
      } catch (err) {}
    }
  }
  content = unescape(this.instance.parse(content, opts))
  return {
    meta,
    content
  }
}

export default parse
