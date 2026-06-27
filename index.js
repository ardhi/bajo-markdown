import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import customHeadingId from 'marked-custom-heading-id'
import { mangle } from 'marked-mangle'
import { markedSmartypantsLite } from 'marked-smartypants-lite'
import katex from 'marked-katex-extension'
import emoji from './lib/emoji.js'
import Renderer from './lib/renderer.js'

/**
 * Plugin factory. A thin wrapper for the {@link https://marked.js.org/|marked} library.
 *
 * **Never** call this function directly!!! It's only-meant to be called by the {@link https://ardhi.github.io/bajo|Bajo framework} during plugin initialization.
 *
 * @param {string} pkgName - NPM package name
 * @returns {class} BajoMarkdown
 */
async function factory (pkgName) {
  const me = this

  /**
   * BajoMarkdown class
   *
   * @class
   */
  class BajoMarkdown extends this.app.baseClass.Base {
    /**
     * Constructor
     */
    constructor () {
      super(pkgName, me.app)

      /**
       * @property {object} config - Configuration object
       * @property {object} [config.renderer={}] - Default renderer
       */
      this.config = {
        renderer: {
          tableClass: 'table my-3',
          tableHeadClass: '',
          tableBodyClass: 'table-group-divider'
        }
      }

      /**
       * @property {Marked} instance - Marked instance
       */
      this.instance = null
    }

    /**
     * Start the plugin
     *
     * @async
     * @method
     */
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
      marked.use(markedSmartypantsLite())

      this.instance = marked
    }

    /**
     * Parse markdown text
     *
     * @async
     * @method
     * @param {string} input - Markdown text to be parsed
     * @param {object} [options] - Options object
     * @returns {string} HTML output
     */
    parse = (input, options) => {
      options = options ?? this.config.markdown
      const html = this.instance.parse(input, options)
      // html = this.app.waibu.unescapeBlock(html, '&lt;%', '%&gt;', '<%', '%>') // lodash template
      return html
    }

    /**
     * Parse inline markdown text
     *
     * @async
     * @method
     * @param {string} input - Markdown text to be parsed
     * @param {object} [options] - Options object
     * @returns {string} HTML output
     */
    parseInline = (input, options) => {
      options = options ?? this.config.markdown
      const html = this.instance.parseInline(input, options)
      return html
    }
  }

  return BajoMarkdown
}

export default factory
