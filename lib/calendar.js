
var request = require('@request/client')
var purest = require('purest')({request, promise: Promise})


module.exports = (config) => {

  var google = purest({
    provider: 'google',
    config
  })

  var message = (event, config) => ({
    summary: event.name,
    description:
      'https://www.facebook.com/events/' + event.id + '\n\n' +
      event.description,
    start: {
      dateTime: event.start_time && new Date(event.start_time).toISOString()
    },
    end: {
      dateTime: event.end_time && new Date(event.end_time).toISOString()
    },
    location: config.location
  })

  var send = ({events, auth, config}) =>
    Promise.all(events.map((event) =>
      google
        .query('calendar')
        .post('calendars/' + config.target + '/events')
        .auth(auth.user.token)
        .json(message(event, config))
        .request()
    ))

  return {send}
}
