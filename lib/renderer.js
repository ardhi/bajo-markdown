async function renderer () {
  const config = this.config
  return {
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
