const TS_PER_DAY = 24 * 60 * 60 * 1000

let getDaysInterval = function(d1, d2) {
  return Math.floor((d2 - d1) / TS_PER_DAY)
}

let getToday = function() {
  let today = new Date()
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  today = new Date(today.getTime() + TS_PER_DAY - 1)
  return today
}

function formatDate(timestamp) {
  const create_time = new Date(timestamp * 1000)
  const today = getToday()
  const interval = getDaysInterval(create_time, today)

  switch(interval) {
    case 0: return '今天'
    case 1: return '昨天'
    case 2: return '前天'
    case 3: case 4: case 5: case 6: return `${interval}天前`
    case 7: case 8: case 9: case 10: case 11: case 12: case 13: return '1周前'
    default:
      let s = `${create_time.getMonth()+1}-${create_time.getDate()}`
      if (create_time.getYear() != today.getYear()) {
        s = `${create_time.getFullYear()}-${s}`
      }
      return s
  }
}

export {formatDate}