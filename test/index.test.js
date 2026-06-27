/* global describe, it, beforeEach */

import { expect } from 'chai'
import factory from '../index.js'

describe('BajoMarkdown', () => {
  let app
  let BajoMarkdown

  beforeEach(async () => {
    app = {
      baseClass: {
        Base: class Base {
          constructor (pkgName, appRef) {
            this.pkgName = pkgName
            this.app = appRef
          }
        }
      },
      bajo: {
        importPkg: async () => {
          throw new Error('importPkg should not be called in this test path')
        }
      }
    }

    BajoMarkdown = await factory.call({ app }, 'bajo-markdown')
  })

  it('builds class with default config and null marked instance', () => {
    const md = new BajoMarkdown()

    expect(md.config.renderer.tableClass).to.equal('table my-3')
    expect(md.config.renderer.tableHeadClass).to.equal('')
    expect(md.config.renderer.tableBodyClass).to.equal('table-group-divider')
    expect(md.instance).to.equal(null)
  })

  it('starts and creates marked instance without waibuExtra', async () => {
    const md = new BajoMarkdown()

    await md.start()

    expect(md.instance).to.be.an('object')
    const html = md.parse('# Title')
    expect(html).to.include('<h1>Title</h1>')
    expect(md.parseInline('hello **world**')).to.include('<strong>world</strong>')
  })

  it('uses highlight extension when waibuExtra is available', async () => {
    app.waibuExtra = {}
    let importCount = 0
    app.bajo.importPkg = async () => {
      importCount++
      return {
        getLanguage: (lang) => lang === 'js',
        highlight: (code, { language }) => ({ value: `HIGHLIGHT:${language}:${code}` })
      }
    }

    const MarkdownWithExtra = await factory.call({ app }, 'bajo-markdown')
    const md = new MarkdownWithExtra()
    await md.start()

    const known = md.parse('```js\nconst a = 1\n```')
    const unknown = md.parse('```unknown\nplain text\n```')

    expect(importCount).to.equal(1)
    expect(known).to.include('class="language-js"')
    expect(known).to.include('const a = 1')
    expect(unknown).to.include('class="language-unknown"')
    expect(unknown).to.include('plain text')
  })

  it('passes default and explicit options through parse and parseInline', () => {
    const md = new BajoMarkdown()
    const calls = []
    md.config.markdown = { gfm: false }
    md.instance = {
      parse: (input, options) => {
        calls.push(['parse', input, options])
        return 'PARSED'
      },
      parseInline: (input, options) => {
        calls.push(['parseInline', input, options])
        return 'INLINE'
      }
    }

    const explicit = { breaks: true }
    expect(md.parse('A')).to.equal('PARSED')
    expect(md.parse('B', explicit)).to.equal('PARSED')
    expect(md.parseInline('C')).to.equal('INLINE')
    expect(md.parseInline('D', explicit)).to.equal('INLINE')
    expect(calls).to.deep.equal([
      ['parse', 'A', { gfm: false }],
      ['parse', 'B', explicit],
      ['parseInline', 'C', { gfm: false }],
      ['parseInline', 'D', explicit]
    ])
  })
})
