
var compose = require('request-compose')
compose.Request.oauth = require('request-oauth')
var request = compose.client

var moment = require('moment')
moment.locale('bg')


var message = (event) =>
  event.name + '\n' +
  moment(event.start_time).format('llll') + '\n' +
  'https://www.facebook.com/events/' + event.id


module.exports = ({events, auth, config}) =>
  Promise.all(events.map((event) =>
    request({
      method: 'POST',
      url: `https://api.twitter.com/1.1/statuses/update.json`,
      form: {
        status: message(event),
      },
      oauth: {
        consumer_key: auth.app.key,
        consumer_secret: auth.app.secret,
        token: auth.user.token,
        token_secret: auth.user.secret,
      }
    })
  ))
