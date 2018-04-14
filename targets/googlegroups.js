
var request = require('request-compose').client
var base64url = require('base64-url')
var moment = require('moment')
moment.locale('bg')


var subject = ({event}) =>
  event.name + ' - ' + [
    moment(event.start_time).format('LL'),
    moment(event.start_time).format('LLLL').split(',')[0],
    moment(event.start_time).format('LT'),
  ].join(', ')


var message = ({event}) =>
  'https://www.facebook.com/events/' + event.id + '\n\n'
  + event.description + '\n\n'
  + '-------\n'
  + 'Автоматично съобщение изпратено от: https://varnalab.org'


// RFC 2822
var email = ({target, event, target: {options = {}}}) =>
  (options.from ? `From: ${options.from}\n` : '')
  + `To: <${options.to}>\n`
  // RFC 1342
  // =?charset?encoding?encoded-text?=
  // =?utf-8?Q?hello?=
  // encoding must be either B or Q, these mean base 64 and quoted-printable
  + `Subject: =?UTF-8?B?${Buffer.from(subject({event})).toString('base64')}?=\n`
  + '\n'
  + message({event})


var send = ({auth, target, event}) =>
  request({
    method: 'POST',
    url: target.url,
    headers: {
      authorization: `Bearer ${auth.user.token}`,
    },
    json: {
      raw: base64url.encode(email({target, event})),
    }
  })
  .then(({body}) => ({event, body}))
  .catch((error) => ({event, error}))


module.exports = ({auth, target, events}) =>
  Promise.all(events.map((event) => send({auth, target, event})))
