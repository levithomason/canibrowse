const bowser = require('bowser')
// TODO support browser list queries
// const browserslist = require('browserslist')

const isBrowserSupported = (ua = '', opts = {}) => {
  const { debug = false, strict = false, query = '', browsers = {} } = opts
  const detected = bowser._detect(ua)

  // Requirements Shape
  // {
  //   [browser]: {
  //     versions: [string, ...],
  //     whitelisted: boolean,
  //     blacklisted: boolean,
  //   },
  // }
  const requirements = {}

  // Browserslisted has a default query
  // Only add browsers if there is a user query
  if (query) {
    // TODO convert Browserslist results to bowser arguments before adding to requirements
    // browserslist(query).forEach(result => {
    //   const [browser, version] = result.split(' ')
    //
    //   requirements[browser] = requirements[browser] || {}
    //   requirements[browser].minVersions = requirements[browser].minVersions || []
    //   requirements[browser].minVersions.concat(version)
    // })
  }

  //
  // Parse browsers
  // { [browser]: string|array<string>, ... }
  //
  Object.keys(browsers).forEach(browser => {
    requirements[browser] = requirements[browser] || {}
    requirements[browser].minVersions = requirements[browser].minVersions || []

    const versions = [].concat(browsers[browser])

    versions.forEach(value => {
      requirements[browser].whitelisted = value === true
      requirements[browser].blacklisted = value === false
      if (typeof value !== 'boolean') {
        requirements[browser].minVersions.push(value)
      }
    })
  })

  if (!Object.keys(requirements).length) {
    throw new Error('Request resulted in no browser requirements. See docs https://goo.gl/RJGJgf.')
  }

  //
  // Validate UA against supportedBrowsers/unsupportedBrowsers
  //
  let canBrowse

  if (strict) {
    // When strict, the detected browser:
    //  - must be specified in the requirements
    //  - must not be blacklisted
    //  - must either be whitelisted or pass the minVersions check
    canBrowse = Object.keys(requirements).some(browser => {
      const { minVersions, whitelisted, blacklisted } = requirements[browser]

      if (!detected[browser]) return false
      if (blacklisted) return false
      if (whitelisted) return true

      return minVersions.some(version => bowser.check({ [browser]: version }, strict, ua))
    })
  } else {
    // When not strict, if the current browser has specified requiredments, it:
    //  - must not be blacklisted
    //  - must be whitelisted or must pass the minVersions check
    canBrowse = Object.keys(requirements).every(browser => {
      const { minVersions, whitelisted, blacklisted } = requirements[browser]

      if (!detected[browser]) return true

      if (blacklisted) return false
      if (whitelisted) return true

      return minVersions.some(version => bowser.check({ [browser]: version }, strict, ua))
    })
  }

  const result = { canBrowse }

  if (debug) Object.assign(result, { detected, strict, requirements })

  return result
}
module.exports = {
  isBrowserSupported,
}
