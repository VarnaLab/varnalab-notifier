
var compose = require('request-compose')
compose.Request.oauth = require('request-oauth')
var request = compose.client

var moment = require('moment')
moment.locale('bg')


var message = ({event}) =>
  event.name + '\n' +
  moment(event.start_time).format('llll') + '\n' +
  'https://www.facebook.com/events/' + event.id


var send = ({auth, target, event}) =>
  request({
    method: 'POST',
    url: target.url,
    form: {
      status: message({event}),
    },
    oauth: {
      consumer_key: auth.app.key,
      consumer_secret: auth.app.secret,
      token: auth.user.token,
      token_secret: auth.user.secret,
    }
  })
  .then(({body}) => ({event, body}))
  .catch((error) => ({event, error}))


module.exports = ({auth, target, events}) =>
  Promise.all(events.map((event) => send({auth, target, event})))
