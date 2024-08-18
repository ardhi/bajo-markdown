function parseContent (input, opts) {
  let html = this.instance.parse(input, opts)
  html = this.unescapeBlock(html, '&lt;c:', '&gt;') // component
  html = this.unescapeBlock(html, '&lt;%', '%&gt;') // lodash template
  return html
}

export default parseContent
