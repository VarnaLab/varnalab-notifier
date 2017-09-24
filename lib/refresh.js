
var fs = require('fs')


module.exports = (auth, env, fpath) => {

  var refresh = (request, {app, user}) =>
    request
      .query('oauth')
      .post('token')
      .form({
        grant_type: 'refresh_token',
        refresh_token: user.refresh,
        client_id: app.key,
        client_secret: app.secret
      })
      .request()
      .then(([res, body]) => body)


  var check = async (request, provider) => {
    if (auth[env][provider].expires <= new Date().getTime()) {

      var {access_token} = await refresh(request, auth[env][provider])

      auth[env][provider].user.token = access_token
      auth[env][provider].expires = new Date().getTime() + (3600 * 1000)

      fs.writeFileSync(
        fpath,
        JSON.stringify(auth, null, 2),
        'utf8'
      )
    }
  }


  return Object.assign(check, {refresh, check})
}
