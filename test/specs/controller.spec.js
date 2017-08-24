const { isBrowserSupported } = require('../../src/controller')

const userAgents = require('../fixtures/userAgents')

describe('controller', () => {
  describe('isBrowserSupported', () => {
    test('returns user agent detection results', () => {
      const result = isBrowserSupported(userAgents.chrome60Mac)

      expect(result).toHaveProperty('detected')
      expect(result).toHaveProperty('detected.name')
      expect(result).toHaveProperty('detected.version')
    })

    test('does not return browsers by default', () => {
      const result = isBrowserSupported(userAgents.chrome60Mac)

      expect(result).not.toHaveProperty('browsers')
    })

    describe('IE >= 9', () => {
      const opts = { browsers: { msie: { minVersions: ['9'] } } }

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
        expect(isBrowserSupported(userAgents.safari10iOS, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.safari10iPad, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.safari10Mac, opts)).toMatchObject({ canBrowse: true })
      })
    })

    describe('Only Chrome and Firefox', () => {
      const opts = {
        strict: true,
        browsers: { chrome: { whitelisted: true }, firefox: { whitelisted: true } },
      }

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
        expect(isBrowserSupported(userAgents.safari10iOS, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.safari10iPad, opts)).toMatchObject({
          canBrowse: false,
        })
        expect(isBrowserSupported(userAgents.safari10Mac, opts)).toMatchObject({ canBrowse: false })
      })
    })

    describe('Blacklist specific browsers', () => {
      const opts = { debug: true, browsers: { msie: { blacklisted: true } } }

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
        expect(isBrowserSupported(userAgents.safari10iOS, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.safari10iPad, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.safari10Mac, opts)).toMatchObject({ canBrowse: true })
      })
    })

    describe('Whitelist specific browsers', () => {
      const opts = { strict: true, browsers: { safari: { whitelisted: true } } }

      test('Whitelisted mobile/tablet/desktop can browse', () => {
        expect(isBrowserSupported(userAgents.safari10iOS, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.safari10iPad, opts)).toMatchObject({
          canBrowse: true,
        })
        expect(isBrowserSupported(userAgents.safari10Mac, opts)).toMatchObject({ canBrowse: true })
      })

      test('Other browsers cannot browse', () => {
        expect(isBrowserSupported(userAgents.chrome51Win, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.chrome51Mac, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.chrome58Mac, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.chrome60Mac, opts)).toMatchObject({ canBrowse: false })
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
      })
    })

    describe('Strictly mobile', () => {
      const opts = { strict: true, mobile: true }

      test('Mobile can browse', () => {
        expect(isBrowserSupported(userAgents.safari10iOS, opts)).toMatchObject({ canBrowse: true })
      })

      test('Tablet cannot browse', () => {
        expect(isBrowserSupported(userAgents.safari10iPad, opts)).toMatchObject({
          canBrowse: false,
        })
      })

      test('Desktop browsers cannot browse', () => {
        expect(isBrowserSupported(userAgents.chrome51Mac, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.chrome58Mac, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.chrome60Mac, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.chrome51Win, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.firefox46Mac, opts)).toMatchObject({
          canBrowse: false,
        })
        expect(isBrowserSupported(userAgents.msedge13, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.safari10Mac, opts)).toMatchObject({ canBrowse: false })
      })
    })

    describe('Strictly tablet', () => {
      const opts = { strict: true, tablet: true, debug: true }

      test('Mobile cannot browse', () => {
        expect(isBrowserSupported(userAgents.safari10iOS, opts)).toMatchObject({ canBrowse: false })
      })

      test('Tablet can browse', () => {
        expect(isBrowserSupported(userAgents.safari10iPad, opts)).toMatchObject({ canBrowse: true })
      })

      test('Desktop cannot browse', () => {
        expect(isBrowserSupported(userAgents.chrome51Mac, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.chrome58Mac, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.chrome60Mac, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.chrome51Win, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.firefox46Mac, opts)).toMatchObject({
          canBrowse: false,
        })
        expect(isBrowserSupported(userAgents.msedge13, opts)).toMatchObject({ canBrowse: false })
        expect(isBrowserSupported(userAgents.safari10Mac, opts)).toMatchObject({ canBrowse: false })
      })
    })

    describe('Strictly desktop', () => {
      const opts = { strict: true, mobile: false, tablet: false }

      test('Mobile cannot browse', () => {
        expect(isBrowserSupported(userAgents.safari10iOS, opts)).toMatchObject({ canBrowse: false })
      })

      test('Tablet cannot browse', () => {
        expect(isBrowserSupported(userAgents.safari10iPad, opts)).toMatchObject({
          canBrowse: false,
        })
      })

      test('Desktop browsers can browse', () => {
        expect(isBrowserSupported(userAgents.chrome51Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome58Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome60Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome51Win, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.firefox46Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.msedge13, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.safari10Mac, opts)).toMatchObject({ canBrowse: true })
      })
    })

    describe('Exclude mobile', () => {
      const opts = { mobile: false }

      test('Mobile cannot browse', () => {
        expect(isBrowserSupported(userAgents.safari10iOS, opts)).toMatchObject({ canBrowse: false })
      })

      test('Tablet can browse', () => {
        expect(isBrowserSupported(userAgents.safari10iPad, opts)).toMatchObject({ canBrowse: true })
      })

      test('Desktop browsers can browse', () => {
        expect(isBrowserSupported(userAgents.chrome51Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome58Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome60Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome51Win, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.firefox46Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.msedge13, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.safari10Mac, opts)).toMatchObject({ canBrowse: true })
      })
    })

    describe('Exclude tablet', () => {
      const opts = { tablet: false }

      test('Mobile can browse', () => {
        expect(isBrowserSupported(userAgents.safari10iOS, opts)).toMatchObject({ canBrowse: true })
      })

      test('Tablet cannot browse', () => {
        expect(isBrowserSupported(userAgents.safari10iPad, opts)).toMatchObject({
          canBrowse: false,
        })
      })

      test('Desktop browsers can browse', () => {
        expect(isBrowserSupported(userAgents.chrome51Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome58Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome60Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.chrome51Win, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.firefox46Mac, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.msedge13, opts)).toMatchObject({ canBrowse: true })
        expect(isBrowserSupported(userAgents.safari10Mac, opts)).toMatchObject({ canBrowse: true })
      })
    })
  })
})
