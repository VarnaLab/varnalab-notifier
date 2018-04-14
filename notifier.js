
var targets = {
  calendar: require('./targets/calendar'),
  googlegroups: require('./targets/googlegroups'),
  slack: require('./targets/slack'),
  twitter: require('./targets/twitter'),
}

var update = require('./utils/auth').update


var notify = ({auth, target, events}) =>
  update(auth)
    .then(() =>
      targets[target.name]({auth, target, events})
        .then((results) => ({auth, target, results}))
    )
    .catch((error) => ({auth, target, results: events.map((event) => ({event, error}))}))


module.exports = ({auth, targets, events}) => Promise.all(
  targets.map((target) => notify({auth: auth[target.auth], target, events}))
)
