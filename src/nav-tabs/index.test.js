require('expect-puppeteer')

const dirname = require('path').basename(__dirname)

describe('Tabs custom element', () => {
  beforeEach(async () => {
    await page.goto(`http://localhost:3000/${dirname}`)
  })

  describe('#Arrow Navigation', () => {

    it('should handle leftArrow navigation', async () => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('ArrowLeft')
      let selectedTab = await page.$('[aria-selected="true"]')
      await expect(selectedTab).toMatch('Tab 2')
    })

    it('should handle rightArrow navigation', async () => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('ArrowRight')
      let selectedTab = await page.$('[aria-selected="true"]')
      await expect(selectedTab).toMatch('Tab 1')
    })

  })

  describe('#Hash Navigation', () => {

    it('should handle hash change navigation', async () => {
      await page.goto(`http://localhost:3000/${dirname}#tab2`)
      let selectedTab = await page.$('[aria-selected="true"]')
      await expect(selectedTab).toMatch('Tab 2')
    })

  })

  describe('#Tab index', () => {

    it('should focus tab item first', async () => {
      await page.keyboard.press('Tab')
      let focusedElement = await page.$('*:focus')
      await expect(focusedElement).toMatch('Tab 3')
    })

    it('should focus tabpanel item first', async () => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      let focusedElement = await page.$('*:focus')
      await expect(focusedElement).toMatch("I'm tab 3 content")
    })

  })

  describe('#Tabs with button', () => {

    it('should select the first button', async () => {
      let selectedElement = await page.$('#buttons [aria-selected="true"]')
      await expect(selectedElement).toMatch('Tab 1')
    })

    it('should handle click correctly', async () => {
      let tabContent1 = await page.$('#button-tab1')
      let tabContent2 = await page.$('#button-tab2')
      let tab2 = await page.$('#btntab2')
      const hiddenAttribute = c => c.getAttribute('hidden')
      expect(await tabContent2.evaluate(hiddenAttribute)).toBe('hidden')
      expect(await tabContent1.evaluate(hiddenAttribute)).toBeNull()
      await tab2.click()
      expect(await tabContent1.evaluate(hiddenAttribute)).toBe('hidden')
      expect(await tabContent2.evaluate(hiddenAttribute)).toBeNull()
    })

  })

  describe('#Optimisation', () => {

    it('should clean listeners on remove', async () => {
      await page.$eval('body', body => body.innerHTML = '')
      const client = await page.target().createCDPSession()
      const window = await client.send("Runtime.evaluate", {expression: "window"});
      const listeners = (await client.send('DOMDebugger.getEventListeners', {
        objectId: window.result.objectId
      })).listeners
      expect(listeners.filter(l => l.type === 'hashchange')).toHaveLength(0)
    })
  })

})
