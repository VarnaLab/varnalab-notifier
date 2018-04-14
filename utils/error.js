
exports.filter = (results) => results
  .map(({auth, target, results}) => results
    .filter(({error}) => error)
    .map((result) => ({auth, target, result}))
  )
  .reduce((all, target) => all.concat(target), [])


exports.message = ({auth, target, result}) => [

  `event.id: ${result.event.id}`,

  auth && auth.app ? `app.name: ${auth.app.name}` : '',
  auth && auth.user ? `user.id: ${auth.user.id}` : '',
  auth && auth.user ? `user.account: ${auth.user.account}` : '',

  `target.name: ${target.name}`,
  `target.url: ${target.url}`,

  `error.message: ${result.error.message}`,
  `error.raw: ${result.error.raw}`,

].filter(Boolean).join('\n')
