export function throttle (callback, delay) {
  let last
  let timer
  return function () {
    const context = this
    const now = +new Date()
    const args = arguments
    if (last && now < last + delay) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        callback.apply(context, args)
      }, delay)
    } else {
      last = now
      callback.apply(context, args)
    }
  }
}
