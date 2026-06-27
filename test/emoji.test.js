/* global describe, it */

import { expect } from 'chai'
import emoji from '../lib/emoji.js'

describe('emoji extension', () => {
  it('exposes expected extension metadata', () => {
    expect(emoji.name).to.equal('emoji')
    expect(emoji.level).to.equal('inline')
    expect(emoji.start('abc :smile:')).to.equal(4)
    expect(emoji.start('abc')).to.equal(-1)
  })

  it('tokenizes valid :name: emoji syntax', () => {
    const token = emoji.tokenizer(':rocket: and more')

    expect(token).to.deep.equal({
      type: 'emoji',
      raw: ':rocket:',
      emoji: 'rocket'
    })
  })

  it('returns undefined for invalid emoji tokens', () => {
    expect(emoji.tokenizer('rocket:')).to.equal(undefined)
    expect(emoji.tokenizer(':not-valid-emoji:')).to.equal(undefined)
  })

  it('renders emoji token with node-emoji emojify', () => {
    const html = emoji.renderer({ raw: ':rocket:' })
    expect(html).to.equal('🚀')
  })
})
