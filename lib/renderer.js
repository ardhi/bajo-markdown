async function renderer () {
  const config = this.config
  return {
    paragraph ({ text }) {
      if (text.startsWith('&lt;c:')) return text + '\n' // for weibu component
      return '<p>' + text + '</p>'
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
