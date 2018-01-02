/**
 * This is a [cozy-client-js](https://cozy.github.io/cozy-client-js/) instance already initialized and ready to use
 * @module  cozy-client
 */

const {Client, MemoryStorage} = require('cozy-client-js')

const getCredentials = function (environment) {
  try {
    if (environment === 'development') {
      const credentials = JSON.parse(process.env.COZY_CREDENTIALS)
      credentials.token.toAuthHeader = function () {
        return 'Bearer ' + credentials.client.registrationAccessToken
      }
      return credentials
    } else {
      return process.env.COZY_CREDENTIALS.trim()
    }
  } catch (err) {
    console.error(`Please provide proper COZY_CREDENTIALS environment variable. ${process.env.COZY_CREDENTIALS} is not OK`)
    throw err
  }
}

const getCozyUrl = function () {
  if (process.env.COZY_URL === undefined) {
    console.error(`Please provide COZY_URL environment variable.`)
    throw new Error('COZY_URL environment variable is absent/not valid')
  } else {
    return process.env.COZY_URL
  }
}

const getCozyClient = function (environment = 'production') {
  if (environment === 'standalone' || environment === 'test') {
    // this is given by cozy-konnector-cli
    return require(process.env.COZY_CLIENT_STUB)
  }

  const credentials = getCredentials(environment)
  const cozyURL = getCozyUrl()

  const options = {
    cozyURL: cozyURL
  }

  if (environment === 'development') {
    options.oauth = {storage: new MemoryStorage()}
  } else if (environment === 'production') {
    options.token = credentials
  }

  const cozyClient = new Client(options)

  if (environment === 'development') {
    cozyClient.saveCredentials(credentials.client, credentials.token)
  }

  return cozyClient
}

module.exports = getCozyClient(process.env.NODE_ENV)
