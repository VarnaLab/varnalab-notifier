
var fs = require('fs')
var request = require('request-compose').client

var urls = {
  google: 'https://accounts.google.com/o/oauth2/token',
}


var refresh = (provider, app, user) =>
  request({
    method: 'POST',
    url: urls[provider],
    form: {
      grant_type: 'refresh_token',
      refresh_token: user.refresh,
      client_id: app.key,
      client_secret: app.secret,
    }
  })
  .then(({body: {access_token}}) => {
    user.token = access_token
    user.expires = new Date().getTime() + (3600 * 1000)
  })


module.exports = (auth, env, fpath) => (provider) =>
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
