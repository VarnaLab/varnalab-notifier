
var request = require('request-compose').client
var base64url = require('base64-url')
var moment = require('moment')
moment.locale('bg')


var subject = (event) =>
  event.name + ' - ' + [
    moment(event.start_time).format('LL'),
    moment(event.start_time).format('LLLL').split(',')[0],
    moment(event.start_time).format('LT'),
  ].join(', ')


var message = (event) =>
  'https://www.facebook.com/events/' + event.id + '\n\n' +
  event.description + '\n\n' +
  '-------\n' +
  'Автоматично съобщение изпратено от: https://varnalab.org'


// RFC 2822
var email = (event, config) =>
  (config.from ? `From: ${config.from}\n` : '') +
  `To: <${config.target}>\n`
  // RFC 1342
  // =?charset?encoding?encoded-text?=
  // =?utf-8?Q?hello?=
  // encoding must be either B or Q, these mean base 64 and quoted-printable
  + `Subject: =?UTF-8?B?${Buffer.from(subject(event)).toString('base64')}?=\n`
  + '\n'
  + message(event)


module.exports = ({events, auth, config}) =>
  Promise.all(events.map((event) =>
    request({
      method: 'POST',
      url: `https://www.googleapis.com/gmail/v1/users/me/messages/send`,
      headers: {
        authorization: `Bearer ${auth.user.token}`,
      },
      json: {
        raw: base64url.encode(email(event, config)),
      }
    })
  ))
