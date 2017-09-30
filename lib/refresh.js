
var fs = require('fs')
var request = require('@request/client')
var purest = require('purest')({request, promise: Promise})


module.exports = (config, auth, env, fpath) => {

  var refresh = (provider, {app, user}) =>
    purest({provider, config: config.purest})
      .query('oauth')
      .post('token')
      .form({
        grant_type: 'refresh_token',
        refresh_token: user.refresh,
        client_id: app.key,
        client_secret: app.secret
      })
      .request()
      .then(([res, body]) => res.statusCode !== 200
        ? Promise.reject(new Error([
          res.statusCode,
          res.statusMessage,
          typeof body === 'object' ? JSON.stringify(body) : body
        ].join(' ')))
        : body
      )

  var check = async (provider) => {
    if (auth[env][provider].user.expires <= new Date().getTime()) {

      var {access_token} = await refresh(provider, auth[env][provider])

      auth[env][provider].user.token = access_token
      auth[env][provider].user.expires = new Date().getTime() + (3600 * 1000)

      fs.writeFileSync(
        fpath,
        JSON.stringify(auth, null, 2),
        'utf8'
      )
    }
  }

  return Object.assign(check, {refresh, check})
}
