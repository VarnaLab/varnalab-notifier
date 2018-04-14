
var request = require('request-compose').client


var message = ({target, event, target: {options = {}}}) => ({
  summary: event.name,
  description:
    'https://www.facebook.com/events/' + event.id + '\n\n' +
    event.description,
  start: {
    dateTime: new Date(event.start_time).toISOString()
  },
  end: {
    dateTime: new Date(event.end_time || event.start_time).toISOString()
  },
  location: options.location
})


var send = ({auth, target, event}) =>
  request({
    method: 'POST',
    url: target.url,
    headers: {
      authorization: `Bearer ${auth.user.token}`,
    },
    json: message({target, event}),
  })
  .then(({body}) => ({event, body}))
  .catch((error) => ({event, error}))


module.exports = ({auth, target, events}) =>
  Promise.all(events.map((event) => send({auth, target, event})))
