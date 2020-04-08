require('expect-puppeteer')

const dirname = require('path').basename(__dirname)

beforeEach(async () => {
  const cookies = await page.cookies()
  for (const cookie of cookies) {
    await page.deleteCookie(cookie)
  }
  await page.goto(`http://localhost:3000/${dirname}`)
})

describe('#cookie-banner', () => {
  it('should reject on escape', async () => {
    await page.keyboard.press('Tab')
    await page.keyboard.press('Escape')
    await expect('#debug').toHaveHTML('reject')
  })
  it('should reject on refusal click', async () => {
    await (await page.$('[data-reject]')).click()
    await expect('#debug').toHaveHTML('reject')
  })
  it('should reject on refusal click', async () => {
    await (await page.$('[data-accept]')).click()
    await expect('#debug').toHaveHTML('accept')
  })
  it('should transmit form data', async () => {
    await expect(page).toClick('[data-accept]')
    await expect('#detail').toHaveHTML('{}')
  })
  it('should transmit form data', async () => {
    await expect(page).toClick('[name=tracking]')
    await expect(page).toClick('[data-accept]')
    await expect('#detail').toHaveHTML('{"tracking":"1"}')
  })
  describe('::cookies', () => {
    it('should remember user refusal', async () => {
      await (await page.$('[data-reject]')).click()
      const cookies = await page.cookies()
      expect(cookies).toHaveLength(1)
      expect(cookies[0].name).toBe('cookieConsent')
      expect(cookies[0].value).toBe('false')
    })
    it('should remember user accept', async () => {
      await (await page.$('[data-accept]')).click()
      const cookies = await page.cookies()
      expect(cookies).toHaveLength(1)
      expect(cookies[0].name).toBe('cookieConsent')
      expect(cookies[0].value).toBe('{}')
    })
    it('should remember user form choices', async () => {
      await expect(page).toClick('[name=tracking]')
      await expect(page).toClick('[data-accept]')
      const cookies = await page.cookies()
      expect(cookies).toHaveLength(1)
      expect(cookies[0].name).toBe('cookieConsent')
      expect(cookies[0].value).toBe('{"tracking":"1"}')
    })
  })
})
