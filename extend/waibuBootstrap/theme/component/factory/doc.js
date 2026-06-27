async function doc () {
  return class MdDoc extends this.baseFactory {
    build = async () => {
      const { parse } = this.app.bajoMarkdown
      const input = this.params.html
      this.params.html = parse(input)
    }
  }
}

export default doc
