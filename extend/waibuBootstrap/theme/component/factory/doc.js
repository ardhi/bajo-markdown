async function doc () {
  return class WmapsScript extends this.baseFactory {
    build = async () => {
      const { parse } = this.app.bajoMarkdown
      const input = this.params.html
      this.params.html = parse(input)
    }
  }
}

export default doc
