import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import customHeadingId from 'marked-custom-heading-id'
import { mangle } from 'marked-mangle'
import katex from 'marked-katex-extension'
import emoji from './lib/emoji.js'
import Renderer from './lib/renderer.js'

/**
 * Plugin factory
 *
 * @param {string} pkgName - NPM package name
 * @returns {class}
 */
async function factory (pkgName) {
  const me = this

  /**
   * BajoMarkdown class
   *
   * @class
   */
  class BajoMarkdown extends this.app.baseClass.Base {
    static alias = 'md'
    static dependencies = ['bajo-config']

    constructor () {
      super(pkgName, me.app)
      this.config = {
        renderer: {
          tableClass: 'table my-3',
          tableHeadClass: '',
          tableBodyClass: 'table-group-divider'
        }
      }
    }

    start = async () => {
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
          emptyLangClass: 'hljs',
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

    parse = (input, options) => {
      options = options ?? this.config.markdown
      const html = this.instance.parse(input)
      // html = this.app.waibu.unescapeBlock(html, '&lt;%', '%&gt;', '<%', '%>') // lodash template
      return html
    }
  }

  return BajoMarkdown
}

export default factory
