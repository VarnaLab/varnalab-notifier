#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))

if (argv.help) {
  console.log('--config /path/to/config.json')
  console.log('--auth /path/to/auth.json')
  console.log('--events /path/to/events.json')
  console.log('--env environment')
  console.log('--notify googlegroups,twitter')
  process.exit()
}

if (!argv.config) {
  console.log('Specify --config /path/to/config.json')
  process.exit()
}

if (!argv.auth) {
  console.log('Specify --auth /path/to/auth.json')
  process.exit()
}

if (!argv.events) {
  console.log('Specify --events /path/to/events.json')
  process.exit()
}

if (typeof argv.notify !== 'string' || !argv.notify) {
  console.log('Specify --notify googlegroups,twitter')
}

var env = process.env.NODE_ENV || argv.env || 'development'


var path = require('path')
var Refresh = require('../lib/refresh')
var GoogleGroups = require('../lib/googlegroups')
var Twitter = require('../lib/twitter')

var config = require(path.resolve(process.cwd(), argv.config))[env]
config.purest = require('../config/purest')

var fpath = path.resolve(process.cwd(), argv.auth)
var auth = require(fpath)
var refresh = Refresh(auth, env, fpath)

var notify = {
  googlegroups: GoogleGroups(config, auth[env].google, refresh),
  twitter: Twitter(config, auth[env].twitter),
}

var events = require(path.resolve(process.cwd(), argv.events))
var upcoming = require('../lib/upcoming')(events)


if (upcoming.length) {
  Promise.all(
    argv.notify.split(',')
      .map((provider) => notify[provider].send(upcoming))
  )
  .catch((err) => console.error(err))
}
