// Check if an element is visible
expect.extend({
  /**
   * @param {ElementHandle} received
   * @return {{pass: boolean, message: (function(): string)}|{pass: boolean, message: (function(): string)}}
   */
  async toBeVisible (received) {
    const box = await received.boundingBox()
    const name = await received.evaluate(
      el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '')
    )
    const hidden = await received.evaluate(el => {
      const style = window.getComputedStyle(el)
      return (
        (style.getPropertyValue('opacity') === '0' &&
          style.getPropertyValue('pointer-events') === 'none') ||
        el.getAttribute('hidden') === 'hidden'
      )
    })
    const pass = box !== null && hidden === false

    if (pass) {
      return {
        message: () => `expected <${name}> not to be visible`,
        pass: true
      }
    } else {
      return {
        message: () => `expected <${name}> to be visible`,
        pass: false
      }
    }
  },

  /**
   * @param {string} received
   * @param {string} html
   * @return {{pass: boolean, message: (function(): string)}|{pass: boolean, message: (function(): string)}}
   */
  async toHaveHTML (received, expectedHTML) {
    const html = await (await page.$(received)).evaluate(e => e.innerHTML)
    const pass = html === expectedHTML

    return {
      pass,
      message: () => {
        return this.utils.matcherHint('toHaveHTML', received, expectedHTML) +
          '\n\n' +
          `Expected: ${this.utils.printExpected(expectedHTML)}\n` +
          `Received: ${this.utils.printReceived(html)}`;
      }
    }
  }
})
