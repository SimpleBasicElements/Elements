require('expect-puppeteer')
const { wait, getListenersFor } = require('../utils/jest')

const dirname = require('path').basename(__dirname)

beforeEach(async () => {
  await page.goto(`http://localhost:3000/${dirname}`)
})

describe('#modal-dialog', () => {
  it('should not be visible by default', async () => {
    const modalDialog = await page.$('modal-dialog')
    await expect(modalDialog).not.toBeVisible()
  })

  describe('from dialog opened', () => {
    beforeEach(async () => {
      const modalDialog = await page.$('modal-dialog')
      const button = await page.$('#button')
      await button.click()
      await expect(modalDialog).toBeVisible()
    })

    it('should focus the first input when opining dialog', async () => {
      const focusedElement = await page.evaluate(_ => document.activeElement.id)
      expect(focusedElement).toBe('firstname')
    })

    it('should close the dialog on Escape', async () => {
      await page.keyboard.press('Escape')
      const modalDialog = await page.$('modal-dialog')
      await expect(modalDialog).not.toBeVisible()
    })

    it('should focus the previously focused element', async () => {
      await page.keyboard.press('Escape')
      const focusedElement = await page.evaluate(_ => document.activeElement.id)
      expect(focusedElement).toBe('button')
    })

    it('should hide modal on overlay click', async () => {
      const modalDialog = await page.$('modal-dialog')
      await wait(200)
      await page.mouse.click(5, 5)
      await wait(200)
      await expect(modalDialog).not.toBeVisible()
    })

    it("shouldn't hide modal on content click", async () => {
      const modalDialog = await page.$('modal-dialog')
      const modalBox = await page.$('#modal-box')
      await modalBox.click()
      await expect(modalDialog).toBeVisible()
    })

    it('should remove event when hidden', async () => {
      await wait(200)
      await page.mouse.click(5, 5)
      expect(await getListenersFor(page, 'document')).toHaveLength(0)
    })

    it('should remove event when hidden', async () => {
      await page.evaluate(_ => (document.body.innerHTML = ''))
      expect(await getListenersFor(page, 'document')).toHaveLength(0)
    })

    it('should focus the last element on previous focus', async () => {
      await page.keyboard.down('Shift')
      await page.keyboard.press('Tab')
      await page.keyboard.up('Shift')
      const focusedElement = await page.evaluate(_ => document.activeElement.id)
      expect(focusedElement).toBe('closebutton')
    })

    it('should focus the first element on next focus', async () => {
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      const focusedElement = await page.evaluate(_ => document.activeElement.id)
      expect(focusedElement).toBe('firstname')
    })

    it('should close the modal when clicking on the close button', async () => {
      const closeButton = await page.$('[data-dismiss]')
      const modalDialog = await page.$('modal-dialog')
      await closeButton.click()
      await expect(modalDialog).not.toBeVisible()
    })
  })
})
