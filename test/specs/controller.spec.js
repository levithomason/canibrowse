const { isBrowserSupported } = require('../../src/controller')

const userAgents = require('../fixtures/userAgents')

describe('controller', () => {
  describe('isBrowserSupported', () => {
    describe('IE >= 9', () => {
      const opts = { browsers: { msie: '9' } }

      test('IE 8 cannot browse', () => {
        expect(isBrowserSupported(userAgents.msie8, opts)).toMatchObject({ canBrowse: false })
      })
      test('IE 9 can browse', () => {
        expect(isBrowserSupported(userAgents.msie9, opts)).toMatchObject({ canBrowse: true })
      })
      test('IE 11 can browse', () => {
        expect(isBrowserSupported(userAgents.msie11, opts)).toMatchObject({ canBrowse: true })
      })
      test('Non IE can browse', () => {
        expect(isBrowserSupported(userAgents.chrome51Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome51Win, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.firefox46Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.firefox46Win, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.safari10, opts)).toMatchObject({ canBrowse: true })
      })
    })

    describe('Only Chrome and Firefox', () => {
      const opts = { strict: true, browsers: { chrome: true, firefox: true } }

      test('Chrome can browse', () => {
        expect(isBrowserSupported(userAgents.chrome51Win, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome51Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome58Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome60Mac, opts)).toMatchObject({ canBrowse: true })
      })
      test('Firefox can browse', () => {
        expect(isBrowserSupported(userAgents.firefox46Win, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.firefox46Mac, opts)).toMatchObject({ canBrowse: true })
      })
      test('Other browsers cannot browse', () => {
        expect(isBrowserSupported(userAgents.msie8, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.msie9, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.msie11, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.msedge13, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.safari10, opts)).toMatchObject({ canBrowse: false })
      })
    })

    describe('Blacklist specific browsers', () => {
      const opts = { browsers: { msie: false } }

      test('IE cannot browse', () => {
        expect(isBrowserSupported(userAgents.msie8, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.msie9, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.msie11, opts)).toMatchObject({ canBrowse: false })
      })

      test('Other browsers can browse', () => {
        expect(isBrowserSupported(userAgents.chrome51Win, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome51Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome58Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome60Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.firefox46Win, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.firefox46Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.msedge13, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.safari10, opts)).toMatchObject({ canBrowse: true })
      })
    })

    describe('Whitelist specific browsers', () => {
      const opts = { strict: true, browsers: { chrome: true } }

      test('Chrome can browse', () => {
        expect(isBrowserSupported(userAgents.chrome51Win, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome51Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome58Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome60Mac, opts)).toMatchObject({ canBrowse: true })
      })

      test('Other browsers cannot browse', () => {
        expect(isBrowserSupported(userAgents.firefox46Win, opts)).toMatchObject({
          canBrowse: false,
        })
        expect(isBrowserSupported(userAgents.firefox46Mac, opts)).toMatchObject({
          canBrowse: false,
        })
        expect(isBrowserSupported(userAgents.msedge13, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.msie8, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.msie9, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.msie11, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.safari10, opts)).toMatchObject({ canBrowse: false })
      })
    })
  })
})
