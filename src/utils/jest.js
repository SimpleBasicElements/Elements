/**
 * Wait for nextAnimationFrame
 *
 * @param page
 * @return {Promise<any>}
 */
function nextAnimationFrame (page) {
  return page.evaluate(() => new Promise((resolve, reject) => {
    window.requestAnimationFrame(resolve)
  }))
}

/**
 * Promise based timeout
 *
 * @param {number} time
 * @return {Promise<any>}
 */
function wait (time) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve()
    }, time)
  })
}

module.exports = {
  nextAnimationFrame,
  wait
}
