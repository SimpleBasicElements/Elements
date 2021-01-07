require('expect-puppeteer')

const dirname = require('path').basename(__dirname)

describe('Tabs custom element', () => {

  describe('#Tabs with links', () => {
    beforeEach(async () => {
      await page.goto(`http://localhost:6006/iframe.html?id=navtabs--default&viewMode=story`)
    })

    describe('#Arrow Navigation', () => {
      it('should handle leftArrow navigation', async () => {
        await page.keyboard.press('Tab')
        await page.keyboard.press('ArrowLeft')
        const selectedTab = await page.$('[aria-selected="true"]')
        await expect(selectedTab).toMatch('Tab 2')
      })

      it('should handle rightArrow navigation', async () => {
        await page.keyboard.press('Tab')
        await page.keyboard.press('ArrowRight')
        const selectedTab = await page.$('[aria-selected="true"]')
        await expect(selectedTab).toMatch('Tab 1')
      })
    })

    describe('#Hash Navigation', () => {
      it('should handle hash change navigation', async () => {
        await page.goto(`http://localhost:6006/iframe.html?id=navtabs--default&viewMode=story#tab2link`)
        const selectedTab = await page.$('[aria-selected="true"]')
        await expect(selectedTab).toMatch('Tab 2')
      })
    })

    describe('#Tab index', () => {
      it('should focus tab item first', async () => {
        await page.keyboard.press('Tab')
        const focusedElement = await page.$('*:focus')
        await expect(focusedElement).toMatch('Tab 3')
      })

      it('should focus tabpanel item first', async () => {
        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')
        const focusedElement = await page.$('*:focus')
        await expect(focusedElement).toMatch("I'm tab 3 content")
      })
    })
  })

  describe('#Tabs with button', () => {
    beforeEach(async () => {
      await page.goto(`http://localhost:6006/iframe.html?id=navtabs--with-buttons&viewMode=story`)
    })
    it('should select the first button', async () => {
      const selectedElement = await page.$('[aria-selected="true"]')
      await expect(selectedElement).toMatch('Tab 1')
    })

    it('should handle click correctly', async () => {
      const tabContent1 = await page.$('#tab1button')
      const tabContent2 = await page.$('#tab2button')
      const tab2 = await page.$('#btntab2')
      const hiddenAttribute = c => c.getAttribute('hidden')
      expect(await tabContent2.evaluate(hiddenAttribute)).toBe('hidden')
      expect(await tabContent1.evaluate(hiddenAttribute)).toBeNull()
      await tab2.click()
      expect(await tabContent1.evaluate(hiddenAttribute)).toBe('hidden')
      expect(await tabContent2.evaluate(hiddenAttribute)).toBeNull()
    })

    describe('#Optimisation', () => {
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
        expect(listeners.filter(l => l.type === 'hashchange')).toHaveLength(0)
      })
    })
  })
})
