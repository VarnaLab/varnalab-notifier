
var request = require('request-compose').client

var moment = require('moment')
moment.locale('bg')


var attachment = (event) => ({
  fallback: 'VarnaLab Notifier',
  color: '#3b5998',

  author_name: [
    moment(event.start_time).format('LL'),
    moment(event.start_time).format('LLLL').split(',')[0],
    moment(event.start_time).format('LT'),
  ].join(', ') + 'ч.',

  title: event.name,
  title_link: `https://www.facebook.com/events/${event.id}`,

  text: event.description,
  thumb_url: event.cover_mobile,

  footer_icon: 'https://cdn1.iconfinder.com' +
    '/data/icons/logotypes/32/facebook-128.png',
  footer: 'Event',

  ts: new Date(event.updated_time).getTime() / 1000,
})


module.exports = ({target, events, target: {options = {}}}) =>
  request({
    method: 'POST',
    url: target.url,
    json: {
      username: options.username,
      icon_url: options.icon_url,
      channel: options.channel,
      attachments: events.map(attachment),
    },
  })
  .then(({body}) => events.map((event) => ({event, body})))
  .catch((error) => events.map((event) => ({event, error})))
