async function renderer () {
  return {
    table (header, body) {
      return `
        <table class="${this.config.renderer.tableClass}">
          <thead class="${this.config.renderer.tableHeadClass}">${header}</thead>
          <tbody class="${this.config.renderer.tableBodyClass}">${body}</tbody>
        </table>
        `
    }
  }
}

export default renderer
