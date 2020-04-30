export function debounce(callback, delay){
  let timer;
  return function(){
    const args = arguments;
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(function(){
      callback.apply(context, args);
    }, delay)
  }
}

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
