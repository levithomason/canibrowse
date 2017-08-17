const bowser = require('bowser')
const HTTPError = require('node-http-error')

const { isBrowserSupported } = require('./controller')

const requestToArguments = req => {
  const { debug, ua: uaQuery, strict } = req.query
  delete req.query.debug
  delete req.query.ua
  delete req.query.strict
  const browsers = req.query

  // Coerce boolean values
  // ?ie=false&chrome=true&firefox
  // => { ie: false, chrome: true, firefox: true }
  Object.keys(browsers).forEach(name => {
    const value = browsers[name]

    if (value === '' || value === 'true') browsers[name] = true
    if (value === 'false') browsers[name] = false
  })

  return {
    browsers,
    debug: debug !== undefined,
    strict: strict !== undefined,
    ua: uaQuery || req.header('User-Agent'),
  }
}

const getRoot = (req, res) => {
  const { browsers, debug, strict, ua } = requestToArguments(req)

  if (!ua) {
    throw new HTTPError(400, 'Missing required `ua` query param. See docs https://goo.gl/RJGJgf.')
  }

  if (!Object.keys(browsers).length) {
    throw new HTTPError(400, 'No browsers were specified. See docs https://goo.gl/RJGJgf.')
  }

  const result = isBrowserSupported(ua, { browsers, debug, strict })

  res.json(result)
}

const getDetect = (req, res) => {
  const { ua } = requestToArguments(req)

  res.json(bowser._detect(ua))
}

module.exports = {
  getRoot,
  getDetect,
}
