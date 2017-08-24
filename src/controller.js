const bowser = require('bowser')
// TODO support browser list queries
// const browserslist = require('browserslist')

const isBrowserSupported = (ua = '', opts = {}) => {
  const { debug, mobile, strict, tablet, browsers } = opts

  const detected = bowser._detect(ua)

  let canBrowse

  if (strict) {
    // When strict, a passing browser:
    //  - must match defined mobile/tablet opts
    //  - AND
    //  - must be specified in the browsers
    //  - must not be blacklisted
    //  - must either be whitelisted or pass the minVersions check
    const passesMobile = mobile === undefined || !!detected.mobile === mobile
    const passesTablet = tablet === undefined || !!detected.tablet === tablet

    const isValidVersion =
      !browsers ||
      Object.keys(browsers).some(browser => {
        const { minVersions, whitelisted, blacklisted } = browsers[browser]

        if (!detected[browser]) return false
        if (blacklisted) return false
        if (whitelisted) return true

        return minVersions.some(version => bowser.check({ [browser]: version }, strict, ua))
      })

    canBrowse = passesMobile && passesTablet && isValidVersion
  } else {
    // When not strict, a passing browser:
    //  - can have no requirements
    //  - OR
    //  - must not fail mobile/tablet opts
    //  - must not be blacklisted
    //  - must be whitelisted or must pass the minVersions check
    const passesMobile = !(mobile === false && detected.mobile)
    const passesTablet = !(tablet === false && detected.tablet)

    const isValidVersion =
      !browsers ||
      Object.keys(browsers).every(browser => {
        const { minVersions, whitelisted, blacklisted } = browsers[browser]

        if (!detected[browser]) return true

        if (blacklisted) return false
        if (whitelisted) return true

        return minVersions.some(version => bowser.check({ [browser]: version }, strict, ua))
      })

    canBrowse = passesMobile && passesTablet && isValidVersion
  }

  //
  // Result
  //
  const result = { canBrowse, detected }

  if (debug) {
    Object.assign(result, {
      strict: !!strict,
      mobile: !!mobile,
      tablet: !!tablet,
      browsers,
    })
  }

  // remove undefined values
  Object.keys(result).forEach(key => result[key] === undefined && delete result[key])

  return result
}

module.exports = {
  isBrowserSupported,
}
