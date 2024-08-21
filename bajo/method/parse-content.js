function parseContent (input, options = {}) {
  let html = this.instance.parse(input)
  html = this.unescapeBlock(html, '&lt;&lt;c:', '&gt;&gt;')
  html = this.unescapeBlock(html, '&lt;&lt;/c:', '&gt;&gt;')
  html = this.unescapeBlock(html, '&lt;&lt;%', '%&gt;&gt;') // lodash template
  return html
}

export default parseContent
