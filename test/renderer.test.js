/* global describe, it, beforeEach */

import { expect } from 'chai'
import createRenderer from '../lib/renderer.js'

describe('renderer', () => {
  let ctx
  let renderer

  beforeEach(async () => {
    ctx = {
      config: {
        renderer: {
          tableClass: 'table my-3',
          tableHeadClass: 'head-class',
          tableBodyClass: 'body-class'
        }
      },
      parseInline: (input) => `[inline:${input}]`
    }
    renderer = await createRenderer.call(ctx)
  })

  it('renders normal paragraph via parser.parseInline', () => {
    const html = renderer.paragraph.call(
      { parser: { parseInline: () => 'INLINE' } },
      { text: 'hello', tokens: [{ type: 'text', raw: 'hello' }] }
    )

    expect(html).to.equal('<p>INLINE</p>')
  })

  it('returns waibu component paragraph unchanged', () => {
    const html = renderer.paragraph.call(
      { parser: { parseInline: () => 'SHOULD_NOT_RUN' } },
      { text: '<c:box />', tokens: [] }
    )

    expect(html).to.equal('<c:box />\n')
  })

  it('renders table with configured classes and alignment', () => {
    const html = renderer.table({
      header: [
        { text: 'Left', align: null },
        { text: 'Center', align: 'center' },
        { text: 'Right', align: 'right' }
      ],
      rows: [
        [
          { text: 'A1', align: null },
          { text: 'A2', align: 'center' },
          { text: 'A3', align: 'right' }
        ],
        Object.assign([
          { text: 'B1', align: null },
          { text: 'B2', align: null },
          { text: 'B3', align: null }
        ], { header: true })
      ]
    })

    expect(html).to.include('<c:table class="table my-3">')
    expect(html).to.include('<c:thead class="head-class">')
    expect(html).to.include('<c:tbody class="body-class">')
    expect(html).to.include('<c:th text="align:center">[inline:Center]</c:th>')
    expect(html).to.include('<c:th text="align:end">[inline:Right]</c:th>')
    expect(html).to.include('<c:td text="align:center">[inline:A2]</c:td>')
    expect(html).to.include('<c:td text="align:end">[inline:A3]</c:td>')
    expect(html).to.include('<c:th >[inline:B1]</c:th>')
  })
})
