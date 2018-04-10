#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))

if (argv.help) {
  console.log('--config /path/to/config.json')
  console.log('--auth /path/to/auth.json')
  console.log('--events /path/to/events.json')
  console.log('--ids /path/to/ids.json')
  console.log('--env environment')
  console.log('--notify calendar,googlegroups,twitter')
  process.exit()
}

;['config', 'auth', 'events', 'ids'].forEach((flag) => {
  if (!argv[flag]) {
    console.log(`Specify --${flag} /path/to/${flag}.json`)
    process.exit()
  }
})

if (typeof argv.notify !== 'string') {
  console.log('Specify --notify calendar,googlegroups,twitter')
}

var env = process.env.NODE_ENV || argv.env || 'development'


var fs = require('fs')
var path = require('path')
var Refresh = require('../lib/refresh')

var config = require(path.resolve(process.cwd(), argv.config))[env]
var notify = {
  calendar: require('../lib/calendar'),
  googlegroups: require('../lib/googlegroups'),
  twitter: require('../lib/twitter'),
}

var fpath = path.resolve(process.cwd(), argv.auth)
var auth = require(fpath)
var refresh = Refresh(auth, env, fpath)


var events = require(path.resolve(process.cwd(), argv.events))
var ids = require(path.resolve(process.cwd(), argv.ids))
var upcoming = events.filter((event) => ids.indexOf(event.id) === -1)


var log = ({res, body}) =>
  res.statusCode !== 200
    ? console.error(new Error([
        res.statusCode,
        res.statusMessage,
        typeof body === 'object' ? JSON.stringify(body) : body
      ].join(' '))
    )
    : console.log([
        new Date().toString(),
        res.statusCode,
        res.statusMessage,
      ].join(' ')
    )

if (upcoming.length) {
  refresh('google').then(() => {

    var accounts = auth[env]
      .map((app) => app.users.map((user) => ({app, user})))
      .reduce((all, auth) => all.concat(auth), [])
      .reduce((all, auth) => (all[auth.user.id] = auth, all), {})

    Promise.all(
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
        path.resolve(process.cwd(), argv.ids),
        JSON.stringify(ids.concat(upcoming.map((event) => event.id)), null, 2),
        'utf8'
      )
      networks.forEach((events) => events.forEach(log))
    })
  })
  .catch(console.error)
}
