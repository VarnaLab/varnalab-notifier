
var request = require('@request/client')
var purest = require('purest')({request, promise: Promise})
var moment = require('moment')
moment.locale('bg')


module.exports = (config, auth) => {

  var twitter = purest({
    provider: 'twitter',
    config: config.purest,
    key: auth.app.key,
    secret: auth.app.secret,
  })

  var message = (event) =>
    event.name + '\n' +
    moment(event.start_time).format('llll') + '\n' +
    'https://www.facebook.com/events/' + event.id

  var send = (events) =>
    Promise.all(events.map((event) =>
      twitter
        .post('statuses/update')
        .form({status: message(event)})
        .auth(auth.user.token, auth.user.secret)
        .request()
    ))

  return {send}
}
