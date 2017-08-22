const _ = require('lodash')
const HTTPError = require('node-http-error')

const { getRoot, requestToArguments } = require('../../src/handlers')

const DEFAULT_REQ = { header: () => {}, query: {} }
const DEFAULT_RES = { json: () => {} }

const req = (req = {}) => _.merge({}, DEFAULT_REQ, req)
const res = (res = {}) => _.merge({}, DEFAULT_RES, res)

describe('handlers', () => {
  describe('requestToArguments', () => {
    test('coerces boolean query params', () => {
      const input = req({ query: { debug: 'true', mobile: 'false', strict: '', tablet: 'false' } })
      const expected = { debug: true, mobile: false, strict: true, tablet: false }

      expect(requestToArguments(input)).toMatchObject(expected)
    })

    test('defaults ua to the User-Agent header', () => {
      const mockRequest = req({ header: name => name })
      const { ua } = requestToArguments(mockRequest)

      expect(ua).toEqual('User-Agent')
    })

    test('returns top level keys: debug, mobile, strict, tablet', () => {
      const args = requestToArguments(
        req({ query: { debug: '', mobile: '', strict: '', tablet: '', ua: 'foo' } }),
      )

      expect(args).toMatchObject({ debug: true, mobile: true, strict: true, tablet: true })
    })

    test('does not return undefined keys', () => {
      const args = requestToArguments(req())

      Object.keys(args).forEach(key => {
        // assert the object doesn't have the property for better failure messages
        if (args[key] === undefined) expect(args).not.toHaveProperty(key)
      })
    })

    describe('browser specifications', () => {
      test('considers extra query params to be browser specifications', () => {
        const args = requestToArguments(req({ query: { aBrowser: '0.1' } }))

        expect(args).toHaveProperty('browsers.aBrowser')
      })

      test('handles whitelisting with "true"', () => {
        const args = requestToArguments(req({ query: { chrome: 'true' } }))

        expect(args).toHaveProperty('browsers.chrome', {
          blacklisted: false,
          minVersions: [],
          whitelisted: true,
        })
      })

      test("handles whitelisting with ''", () => {
        const args = requestToArguments(req({ query: { firefox: '' } }))

        expect(args).toHaveProperty('browsers.firefox', {
          blacklisted: false,
          minVersions: [],
          whitelisted: true,
        })
      })

      test('handles blacklisting', () => {
        const args = requestToArguments(req({ query: { msie: 'false' } }))

        expect(args).toHaveProperty('browsers', {
          msie: {
            blacklisted: true,
            minVersions: [],
            whitelisted: false,
          },
        })
      })

      test('handles single versions', () => {
        const args = requestToArguments(req({ query: { chrome: '60' } }))

        expect(args).toHaveProperty('browsers.chrome', {
          blacklisted: false,
          minVersions: ['60'],
          whitelisted: false,
        })
      })

      test('handles multiple versions', () => {
        const args = requestToArguments(req({ query: { msie: ['10', '11'] } }))

        expect(args).toHaveProperty('browsers.msie', {
          blacklisted: false,
          minVersions: ['10', '11'],
          whitelisted: false,
        })
      })
    })
  })

  describe('getRoot', () => {
    test('throws if browsers and mobile and tablet were not specified', () => {
      expect(() => getRoot(req(), res())).toThrow(
        new HTTPError(400, 'Request has no requirements. Docs https://goo.gl/RJGJgf.'),
      )
    })

    test('does not throw when excluding mobile and tablet', () => {
      expect(() => getRoot(req({ query: { mobile: false, tablet: false } }), res())).not.toThrow()
    })
  })
})
