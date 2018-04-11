
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


module.exports = ({events, config}) =>
  request({
    method: 'POST',
    url: config.target,
    json: {
      username: config.username,
      icon_url: config.icon_url,
      channel: config.channel,
      attachments: events.map(attachment),
    },
  })
