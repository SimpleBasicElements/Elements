require('expect-puppeteer')
const { wait, getListenersFor } = require('../utils/jest')

describe('#modal-dialog', () => {
  beforeEach(async () => {
    await page.goto(
      `http://localhost:6006/iframe.html?id=modaldialog--default&viewMode=story`
    )
  })

  it('should not be visible by default', async () => {
    const modalDialog = await page.$('modal-dialog')
    await expect(modalDialog).toBeHidden()
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
      await expect(modalDialog).toBeHidden()
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
      await expect(modalDialog).toBeHidden()
    })

    it("shouldn't hide modal on content click", async () => {
      const modalDialog = await page.$('modal-dialog')
      const modalBox = await page.$('#modal-box')
      await modalBox.click()
      await expect(modalDialog).toBeVisible()
    })

    it('should remove event when hidden', async () => {
      const baseLength = (await getListenersFor(page, 'document')).length
      await wait(200)
      await page.mouse.click(5, 5)
      expect(await getListenersFor(page, 'document')).toHaveLength(
        baseLength - 1
      )
    })

    it('should remove event when hidden', async () => {
      const baseLength = (await getListenersFor(page, 'document')).length
      await page.evaluate(_ => (document.body.innerHTML = ''))
      expect(await getListenersFor(page, 'document')).toHaveLength(
        baseLength - 1
      )
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
      await expect(modalDialog).toBeHidden()
    })

    it('should not hide the modal if event prevented', async () => {
      const closeButton = await page.$('[data-dismiss]')
      const modalDialog = await page.$('modal-dialog')
      await modalDialog.evaluate(modal => {
        modal.addEventListener('close', e => e.preventDefault())
      })
      await closeButton.click()
      await expect(modalDialog).not.toBeHidden()
    })
  })
})
