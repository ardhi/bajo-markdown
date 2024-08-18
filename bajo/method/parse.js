function parse (input, opts = {}) {
  const { omit, pick } = this.app.bajo.lib._
  opts.parseContent = opts.parseContent ?? true

  let { frontMatter, content } = this.split(input, pick(opts, ['readFile']))
  frontMatter = this.parseFrontMatter(frontMatter)
  const html = opts.parseContent ? this.parseContent(content, omit(opts, ['parseContent', 'readFile'])) : undefined
  return {
    frontMatter,
    html,
    content
  }
}

export default parse
