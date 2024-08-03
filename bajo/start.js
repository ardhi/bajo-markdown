import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import customHeadingId from 'marked-custom-heading-id'
import { mangle } from 'marked-mangle'
import katex from 'marked-katex-extension'
import { emoji } from '../lib/emoji.js'
import Renderer from '../lib/renderer.js'

async function start () {
  const { importPkg } = this.app.bajo
  const renderer = await Renderer.call(this)
  const options = [
    customHeadingId(),
    mangle(),
    katex({ throwOnError: false })
  ]
  if (this.app.waibuExtra) {
    const hljs = await importPkg('waibuExtra:highlight.js')
    const highlight = markedHighlight({
      langPrefix: 'hljs language-',
      highlight (code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, { language }).value
      }
    })
    options.push(highlight)
  }
  const marked = new Marked(options)
  marked.use({ renderer, extensions: [emoji] })
  this.instance = marked
}

export default start
