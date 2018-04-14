#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))

if (argv.help) {
  console.log(`
    --auth      /path/to/auth.json
    --targets   /path/to/targets.json
    --events    /path/to/events.json
    --ids       /path/to/ids.json
    --env       environment
    --notify    calendar,googlegroups,slack,twitter
  `)
  process.exit()
}

;['auth', 'targets', 'events', 'ids'].forEach((arg) => {
  if (!argv[arg]) {
    console.log(`Specify --${arg} /path/to/${arg}.json`)
    process.exit()
  }
})


var events = require(argv.events)
var ids = require(argv.ids)
var upcoming = events.filter((event) => !ids.includes(event.id))

if (!upcoming.length) {
  process.exit()
}


// modified in auth.refresh
var auth = require(argv.auth)


var env = process.env.NODE_ENV || argv.env || 'development'

var targets = require(argv.targets)[env]
if (argv.notify) {
  var input = argv.notify.split(',')
  targets = targets.filter((target) => input.includes(target.notify))
}


var users = require('../utils/auth').users

require('../')({
  auth: users({auth: auth[env]}),
  targets,
  events: upcoming,
})
.then((results) => {

  var err = require('../utils/error')
  var errors = err.filter(results)

  errors.map((error) => console.error(err.message(error)))

  var fs = require('fs')

  if (results.length > errors.length) {
    fs.writeFileSync(
      argv.ids,
      JSON.stringify(ids.concat(upcoming.map((event) => event.id)), null, 2),
      'utf8'
    )
  }

  fs.writeFileSync(argv.auth, JSON.stringify(auth, null, 2), 'utf8')
})
.catch(console.error)
