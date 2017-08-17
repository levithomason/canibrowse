const HTTPError = require('node-http-error')

const { getRoot } = require('../../src/handlers')
const userAgents = require('../fixtures/userAgents')

const makeRequest = (obj = {}) =>
  Object.assign({}, obj, { header: () => {}, query: Object.assign({}, obj.query) })

describe('handlers', () => {
  describe('getRoot', () => {
    test('throws if missing req.query.ua', () => {
      expect(() => getRoot(makeRequest())).toThrow(
        new HTTPError('Missing required `ua` query param. See docs https://goo.gl/RJGJgf.'),
      )
    })

    test('throws if no browsers were specified ', () => {
      expect(() => getRoot(makeRequest({ query: { ua: userAgents.chrome51Mac } }))).toThrow(
        new HTTPError('No browsers were specified. See docs https://goo.gl/RJGJgf.'),
      )
    })
  })
})
