const bowser = require('bowser')
const HTTPError = require('node-http-error')

const { isBrowserSupported } = require('./controller')

const requestToArguments = req => {
  const reqQuery = Object.assign({}, req.query)

  // coerce boolean query params
  Object.keys(reqQuery).forEach(key => {
    if (reqQuery[key] === '' || reqQuery[key] === 'true') reqQuery[key] = true
    if (reqQuery[key] === 'false') reqQuery[key] = false
  })

  const { debug, mobile, strict, tablet, ua = req.header('User-Agent'), query } = reqQuery
  delete reqQuery.debug
  delete reqQuery.mobile
  delete reqQuery.strict
  delete reqQuery.tablet
  delete reqQuery.ua
  delete reqQuery.query
  // all other query params are browser specifications
  const browserParams = reqQuery
  const browsers = {}

  // Browserslist has a default query
  // Only add browsers if there is a user query
  if (query) {
    // browserslist(query).forEach(result => {
    //   const [browser, version] = result.split(' ')
    //
    //   TODO convert Browserslist results to bowser arguments before adding to requirements
    //
    //   requirements[browser] = requirements[browser] || {}
    //   requirements[browser].minVersions = requirements[browser].minVersions || []
    //   requirements[browser].minVersions.concat(version)
    // })
  }

  Object.keys(browserParams).forEach(browser => {
    const specs = [].concat(browserParams[browser])

    browsers[browser] = browsers[browser] || {}
    browsers[browser].minVersions = browsers[browser].minVersions || []

    specs.forEach(value => {
      // Coerce boolean values
      const blacklisted = value === false
      const whitelisted = value === true

      browsers[browser].blacklisted = blacklisted
      browsers[browser].whitelisted = whitelisted

      // if it is not a boolean, it is a browser version (i.e. '59')
      if (typeof value !== 'boolean') {
        browsers[browser].minVersions.push(value)
      }
    })
  })

  const args = { browsers, debug, mobile, strict, tablet, ua }

  // remove undefined values
  Object.keys(args).forEach(key => args[key] === undefined && delete args[key])

  return args
}

const getRoot = (req, res) => {
  const { browsers, debug, mobile, strict, tablet, ua } = requestToArguments(req)

  if (mobile === undefined && tablet === undefined && !Object.keys(browsers).length) {
    throw new HTTPError(400, 'Request has no requirements. Docs https://goo.gl/RJGJgf.')
  }

  const result = isBrowserSupported(ua, { browsers, debug, mobile, strict, tablet })

  res.json(result)
}

const getDetect = (req, res) => {
  const { ua } = requestToArguments(req)

  res.json(bowser._detect(ua))
}

module.exports = {
  requestToArguments,
  getRoot,
  getDetect,
}
