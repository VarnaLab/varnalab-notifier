
var t = require('assert')
var http = require('http')
var notifier = require('../')
var users = require('../utils/auth').users
var error = require('../utils/error')


describe('notifier', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      if (req.url === '/success') {
        res.writeHead(200)
        res.end('ok')
      }
      else if (req.url === '/fail') {
        res.writeHead(400)
        res.end('fail')
      }
    })
    server.listen(5000, done)
  })

  it('event success + event fail', () => Promise.all(
    ['calendar', 'googlegroups', 'slack', 'twitter'].map((target) => {
      var auth = {
        a: {
          app: {name: 1},
          user: {id: 'a', account: 1}
        },
      }
      t.deepStrictEqual(
        users({
          auth: [
            {
              app: {name: 1},
              users: [{id: 'a', account: 1}]
            }
          ]}
        ),
        auth,
        'auth.users'
      )
      var targets = [
        {name: target, auth: 'a', url: 'http://localhost:5000/success'},
        {name: target, auth: 'a', url: 'http://localhost:5000/fail'},
      ]
      var events = [
        {id: 1, start_time: 1523611475142},
        {id: 2, start_time: 1523611475142},
      ]
      return notifier({auth, targets, events}).then((results) => {
        var {message, raw} = results[1].results[0].error
        results[1].results[0].error = {message, raw}
        var {message, raw} = results[1].results[1].error
        results[1].results[1].error = {message, raw}

        t.deepStrictEqual(results, [
          {
            auth: auth['a'],
            target: targets[0],
            results: [
              {event: events[0], body: 'ok'},
              {event: events[1], body: 'ok'},
            ],
          },
          {
            auth: auth['a'],
            target: targets[1],
            results: [
              {event: events[0], error: {message: '400 Bad Request', raw: 'fail'}},
              {event: events[1], error: {message: '400 Bad Request', raw: 'fail'}},
            ],
          },
        ], 'notifier results')

        t.deepStrictEqual(error.filter(results), [
          {
            auth: auth['a'],
            target: targets[1],
            result: {event: events[0], error: {message: '400 Bad Request', raw: 'fail'}},
          },
          {
            auth: auth['a'],
            target: targets[1],
            result: {event: events[1], error: {message: '400 Bad Request', raw: 'fail'}},
          },
        ], 'error.filter')

        t.deepStrictEqual(
          error.filter(results).map(error.message).map((message) => message.split('\n')), [
          [
            'event.id: 1',
            'app.name: 1',
            'user.id: a',
            'user.account: 1',
            `target.name: ${target}`,
            'target.url: http://localhost:5000/fail',
            'error.message: 400 Bad Request',
            'error.raw: fail'
          ],
          [
            'event.id: 2',
            'app.name: 1',
            'user.id: a',
            'user.account: 1',
            `target.name: ${target}`,
            'target.url: http://localhost:5000/fail',
            'error.message: 400 Bad Request',
            'error.raw: fail'
          ]
        ], 'error.message')
      })
    }))
  )

  it('refresh success + refresh fail', () => {
    var auth = {
      a: {
        app: {name: 1, refresh: 'http://localhost:5000/success'},
        user: {id: 'a', account: 1, expires: 1523706108988}
      },
      b: {
        app: {name: 1, refresh: 'http://localhost:5000/fail'},
        user: {id: 'b', account: 2, expires: 1523706108988}
      },
    }
    t.deepStrictEqual(
      users({
        auth: [
          {
            app: {name: 1, refresh: 'http://localhost:5000/success'},
            users: [{id: 'a', account: 1, expires: 1523706108988}]
          },
          {
            app: {name: 1, refresh: 'http://localhost:5000/fail'},
            users: [{id: 'b', account: 2, expires: 1523706108988}]
          },
        ]}
      ),
      auth,
      'auth.users'
    )
    var targets = [
      {name: 'calendar', auth: 'a', url: 'http://localhost:5000/success'},
      {name: 'calendar', auth: 'b', url: 'http://localhost:5000/success'},
    ]
    var events = [
      {id: 1, start_time: 1523611475142},
      {id: 2, start_time: 1523611475142},
    ]
    return notifier({auth, targets, events}).then((results) => {
      var {message, raw} = results[1].results[0].error
      results[1].results[0].error = {message, raw}
      var {message, raw} = results[1].results[1].error
      results[1].results[1].error = {message, raw}

      t.deepStrictEqual(results, [
        {
          auth: auth['a'],
          target: targets[0],
          results: [
            {event: events[0], body: 'ok'},
            {event: events[1], body: 'ok'},
          ],
        },
        {
          auth: auth['b'],
          target: targets[1],
          results: [
            {event: events[0], error: {message: '400 Bad Request', raw: 'fail'}},
            {event: events[1], error: {message: '400 Bad Request', raw: 'fail'}},
          ],
        },
      ], 'notifier results')

      t.deepStrictEqual(error.filter(results), [
        {
          auth: auth['b'],
          target: targets[1],
          result: {event: events[0], error: {message: '400 Bad Request', raw: 'fail'}},
        },
        {
          auth: auth['b'],
          target: targets[1],
          result: {event: events[1], error: {message: '400 Bad Request', raw: 'fail'}},
        },
      ], 'error.filter')

      t.deepStrictEqual(
        error.filter(results).map(error.message).map((message) => message.split('\n')), [
        [
          'event.id: 1',
          'app.name: 1',
          'user.id: b',
          'user.account: 2',
          'target.name: calendar',
          'target.url: http://localhost:5000/success',
          'error.message: 400 Bad Request',
          'error.raw: fail'
        ],
        [
          'event.id: 2',
          'app.name: 1',
          'user.id: b',
          'user.account: 2',
          'target.name: calendar',
          'target.url: http://localhost:5000/success',
          'error.message: 400 Bad Request',
          'error.raw: fail'
        ]
      ], 'error.message')
    })
  })

  after((done) => {
    server.close(done)
  })

})
