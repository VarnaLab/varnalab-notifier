
module.exports = (events) => {
  var now = new Date().getTime()
  var upcoming = []

  for (var event of events) {
    var start = new Date(event.start_time).getTime()
    if (start >= now) {
      upcoming.push(event)
    }
    else {
      break
    }
  }

  return upcoming
}
