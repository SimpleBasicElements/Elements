require('expect-puppeteer')

const dirname = require('path').basename(__dirname)

async function nextAnimationFrame (page) {
  return page.evaluate(
    () =>
      new Promise((resolve, reject) => {
        window.requestAnimationFrame(resolve)
      })
  )
}

beforeEach(async () => {
  await page.goto(`http://localhost:6006/iframe.html?id=scrolltop--default&viewMode=story`)
  await page.keyboard.press('Tab')
})

describe('#scroll-top', () => {
  it('should not be visible by default', async () => {
    const box = await (await page.$('scroll-top')).boundingBox()
    expect(box).toBeNull()
  })

  it('should be visible when scrolling', async () => {
    await page.evaluate(async el => window.scrollBy(0, window.innerHeight))
    await nextAnimationFrame(page)
    const box = await (await page.$('scroll-top')).boundingBox()
    expect(box).not.toBeNull()
  })

  it('should scroll top on click', async () => {
    await page.evaluate(async el => window.scrollBy(0, window.innerHeight))
    await page.waitForSelector('scroll-top', {visible: true})
    const previousScrollY = await page.evaluate(_ => window.scrollY)
    const scrollTop = await page.$('scroll-top')
    await scrollTop.click()
    await page.waitForTimeout(100)
    const scrollY = await page.evaluate(_ => window.scrollY)
    expect(scrollY).not.toBe(previousScrollY)
  })

  it('should clean listeners on remove', async () => {
    await page.$eval('body', body => (body.innerHTML = ''))
    const client = await page.target().createCDPSession()
    const window = await client.send('Runtime.evaluate', {
      expression: 'window'
    })
    const listeners = (
      await client.send('DOMDebugger.getEventListeners', {
        objectId: window.result.objectId
      })
    ).listeners
    expect(listeners.filter(l => l.type === 'scroll')).toHaveLength(0)
  })
})
