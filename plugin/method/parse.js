function parse (input, options) {
  options = options ?? this.config.markdown
  const html = this.instance.parse(input)
  // html = this.app.waibu.unescapeBlock(html, '&lt;%', '%&gt;', '<%', '%>') // lodash template
  return html
}

export default parse
