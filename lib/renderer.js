/**
 * Lib module
 *
 * @module Lib
 */

/**
 * Renderer for marked. It overrides the default renderer to use custom tags for
 * many elements.
 *
 * @memberof module:Lib
 * @returns {object} Renderer methods
 */
async function renderer () {
  const config = this.config
  const me = this
  return {
    /**
     * Render a paragraph
     *
     * @param {Object} options - Options object
     * @param {string} options.text - Paragraph text
     * @param {Array} options.tokens - Inline tokens
     * @returns {string} HTML output
     */
    paragraph (options) {
      const { text, tokens } = options
      if (text.startsWith('<c:')) return text + '\n' // for waibu component
      return '<p>' + this.parser.parseInline(tokens) + '</p>'
    },
    /**
     * Render a table
     *
     * @param {Object} options - Options object
     * @param {Array} options.header - Table header
     * @param {Array} options.rows - Table rows
     * @returns {string} HTML output
     */
    table (options) {
      const { header, rows } = options
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
