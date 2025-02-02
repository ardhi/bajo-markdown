async function renderer () {
  const config = this.config
  return {
    paragraph ({ text, tokens }) {
      if (text.startsWith('<c:')) return text + '\n' // for weibu component
      return '<p>' + this.parser.parseInline(tokens) + '</p>'
    },
    table (header, body) {
      return `
        <table class="${config.renderer.tableClass}">
          <thead class="${config.renderer.tableHeadClass}">${header}</thead>
          <tbody class="${config.renderer.tableBodyClass}">${body}</tbody>
        </table>
        `
    }
  }
}

export default renderer
