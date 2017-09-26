
var request = require('@request/client')
var purest = require('purest')({request, promise: Promise})


module.exports = (config, auth, refresh) => {

  var google = purest({
    provider: 'google',
    config: config.purest,
  })

  var message = (event) => ({
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
      location: config.calendar.location

    })

  var send = async (events) => (
    await refresh(google, 'google'),
    Promise.all(events.map((event) =>
      google
        .query('calendar')
        .post('calendars/' + config.calendar.id + '/events')
        .auth(auth.user.token)
        .json(message(event))
        .request()
    ))
  )

  return {send}
}
