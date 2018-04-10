
var request = require('request-compose').client


var message = (event, config) => ({
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
  location: config.location
})


module.exports = ({events, auth, config}) =>
  Promise.all(events.map((event) =>
    request({
      method: 'POST',
      url: `https://www.googleapis.com/calendar/v3/calendars/${config.target}/events`,
      headers: {
        authorization: `Bearer ${auth.user.token}`,
      },
      json: message(event, config),
    })
  ))
