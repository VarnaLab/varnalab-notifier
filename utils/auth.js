
var request = require('request-compose').client


var users = ({auth}) => auth
  .map(({app, users}) => users.map((user) => ({app, user})))
  .reduce((all, auth) => all.concat(auth), [])
  .reduce((all, auth) => (all[auth.user.id] = auth, all), {})


var expired = ({app, user}) =>
  app.refresh &&
  user.expires &&
  user.expires < Date.now()


var refresh = ({app, user}) =>
  request({
    method: 'POST',
    url: app.refresh,
    form: {
      grant_type: 'refresh_token',
      refresh_token: user.refresh,
      client_id: app.key,
      client_secret: app.secret,
    }
  })
  .then(({body: {access_token, expires_in}}) => {
    user.token = access_token
    user.expires = Date.now() + (parseInt(expires_in) * 1000)
  })


var update = ({app, user} = {app: {}, user: {}}) =>
  expired({app, user})
    ? refresh({app, user})
    : Promise.resolve()


module.exports = {users, expired, refresh, update}
