
var request = require('@request/client')
var purest = require('purest')({request, promise: Promise})
var moment = require('moment')
moment.locale('bg')


module.exports = (config) => {

  var twitter = purest({
    provider: 'twitter',
    config
  })

  var message = (event) =>
    event.name + '\n' +
    moment(event.start_time).format('llll') + '\n' +
    'https://www.facebook.com/events/' + event.id

  var send = ({events, auth, config}) =>
    Promise.all(events.map((event) =>
      twitter
        .post('statuses/update')
        .form({status: message(event)})
        .oauth({
          consumer_key: auth.app.key,
          consumer_secret: auth.app.secret,
          token: auth.user.token,
          token_secret: auth.user.secret,
        })
        .request()
    ))

  return {send}
}
