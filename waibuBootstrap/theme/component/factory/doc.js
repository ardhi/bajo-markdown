async function doc () {
  return class WmapsScript extends this.baseFactory {
    build = async () => {
      const { parse } = this.plugin.app.bajoMarkdown
      const input = this.params.html
      this.params.html = parse(input)
      console.log(input, this.params.html)
    }
  }
}

export default doc
