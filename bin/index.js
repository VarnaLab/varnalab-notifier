#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))

if (argv.help) {
  console.log(`
    --config  /path/to/config.json
    --auth    /path/to/auth.json
    --events  /path/to/events.json
    --ids     /path/to/ids.json
    --env     environment
    --notify  calendar,googlegroups,slack,twitter
  `)
  process.exit()
}

;['config', 'auth', 'events', 'ids'].forEach((flag) => {
  if (!argv[flag]) {
    console.log(`Specify --${flag} /path/to/${flag}.json`)
    process.exit()
  }
})

if (typeof argv.notify !== 'string') {
  console.log('Specify --notify calendar,googlegroups,slack,twitter')
}

var env = process.env.NODE_ENV || argv.env || 'development'


var fs = require('fs')

var config = require(argv.config)[env]
var notify = {
  calendar: require('../lib/calendar'),
  googlegroups: require('../lib/googlegroups'),
  slack: require('../lib/slack'),
  twitter: require('../lib/twitter'),
}

var auth = require(argv.auth)
var refresh = require('../lib/refresh')(auth, env, argv.auth)

var events = require(argv.events)
var ids = require(argv.ids)
var upcoming = events.filter((event) => ids.indexOf(event.id) === -1)


;(async () => {
  if (!upcoming.length) {
    return
  }

  await refresh('google')

  var accounts = auth[env]
    .map((app) => app.users.map((user) => ({app, user})))
    .reduce((all, auth) => all.concat(auth), [])
    .reduce((all, auth) => (all[auth.user.id] = auth, all), {})

  return Promise.all(
    argv.notify.split(',')
      .map((network) => config
        .filter((target) => target.notify === network)
        .map((target) =>
          notify[network]({
            events: upcoming,
            auth: accounts[target.auth],
            config: target,
          })
        )
      )
      .reduce((all, target) => all.concat(target), [])
  )
  .then((networks) => {
    fs.writeFileSync(
      argv.ids,
      JSON.stringify(ids.concat(upcoming.map((event) => event.id)), null, 2),
      'utf8'
    )
  })
})()
.catch(console.error)
