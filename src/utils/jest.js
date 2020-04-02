/**
 * @param page
 * @param {string} expression 
 * @param {string} eventName 
 */
async function getListenersFor(page, expression, eventName = null) {
  const client = await page.target().createCDPSession()
  const element = await client.send("Runtime.evaluate", {expression});
  const listeners = (await client.send('DOMDebugger.getEventListeners', {
    objectId: element.result.objectId
  })).listeners
  if (eventName) {
    return listeners.filter(l => l.type === eventName)
  } 
  return listeners
}

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
  wait,
  getListenersFor
}
