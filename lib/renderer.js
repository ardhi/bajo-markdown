async function renderer () {
  const config = this.config
  const me = this
  return {
    paragraph ({ text, tokens }) {
      if (text.startsWith('<c:')) return text + '\n' // for waibu component
      return '<p>' + this.parser.parseInline(tokens) + '</p>'
    },
    table ({ header, rows }) {
      const head = ['<c:tr>']
      const body = []
      for (const item of header) {
        const align = item.align === 'center' ? 'text="align:center"' : (item.align === 'right' ? 'text="align:end"' : '')
        head.push(`<c:th ${align}>` + me.parseInline(item.text) + '</c:th>')
      }
      head.push('</c:tr>')
      for (const row of rows) {
        const tag = row.header ? 'th' : 'td'
        body.push('<c:tr>')
        for (const item of row) {
          const align = item.align === 'center' ? 'text="align:center"' : (item.align === 'right' ? 'text="align:end"' : '')
          body.push(`<c:${tag} ${align}>` + me.parseInline(item.text) + `</c:${tag}>`)
        }
        body.push('</c:tr>')
      }
      return `
        <c:table class="${config.renderer.tableClass}">
          <c:thead class="${config.renderer.tableHeadClass}">${head.join('')}</c:thead>
          <c:tbody class="${config.renderer.tableBodyClass}">${body.join('')}</c:tbody>
        </c:table>
        `
    }
  }
}

export default renderer
