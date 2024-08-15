const to = '---\n'
const tc = '\n---\n'

function parse (content, opts = {}) {
  const { isPlainObject, isArray } = this.app.bajo.lib._
  const { fs } = this.app.bajo.lib
  if (opts.readFile) content = fs.readFileSync(content, 'utf8')
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
    const handlers = []
    if (this.app.bajoConfig) handlers.push(this.app.bajoConfig.fromYaml, this.app.bajoConfig.fromToml)
    handlers.push(JSON.parse)
    let success
    for (const h of handlers) {
      if (success) break
      try {
        const result = h(meta, true)
        if (isPlainObject(result) || isArray(result)) success = result
      } catch (err) {}
    }
    meta = success ?? {}
  }

  const html = opts.parseContent ? this.parseContent(content, opts) : undefined
  return {
    meta: meta ?? {},
    html,
    content
  }
}

export default parse
