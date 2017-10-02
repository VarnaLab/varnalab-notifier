
var fs = require('fs')
var request = require('@request/client')
var purest = require('purest')({request, promise: Promise})


module.exports = (config, auth, env, fpath) => {

  var refresh = (provider, app, user) =>
    purest({provider, config})
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
      .then(({access_token}) => {
        user.token = access_token
        user.expires = new Date().getTime() + (3600 * 1000)
      })

  var check = (provider) =>
    Promise.all(
      auth[env]
        .filter((app) => app.provider === provider)
        .map((app) => app.users
          .filter((user) => user.expires <= new Date().getTime())
          .map((user) => refresh(provider, app, user))
        )
        .reduce((all, app) => all.concat(app), [])
    )
    .then(() => {
      fs.writeFileSync(
        fpath,
        JSON.stringify(auth, null, 2),
        'utf8'
      )
    })

  return Object.assign(check, {refresh, check})
}
