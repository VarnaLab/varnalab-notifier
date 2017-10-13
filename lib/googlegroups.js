
var request = require('@request/client')
var purest = require('purest')({request, promise: Promise})
var base64url = require('base64-url')
var moment = require('moment')
moment.locale('bg')


module.exports = (config) => {

  var google = purest({
    provider: 'google',
    config
  })

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

  var send = ({events, auth, config}) =>
    Promise.all(events.map((event) =>
      google
        .query('gmail')
        .post('users/me/messages/send')
        .auth(auth.user.token)
        .json({raw: base64url.encode(email(event, config))})
        .request()
    ))

  return {send}
}
