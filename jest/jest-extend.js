// Check if an element is visible
expect.extend({
  /**
   * @param {ElementHandle} received
   * @return {{pass: boolean, message: (function(): string)}|{pass: boolean, message: (function(): string)}}
   */
  async toBeVisible (received) {
    if (typeof received === 'string') {
      received = await page.$(received)
    }
    const name = await received.evaluate(
      el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '')
    )
    const visible = await received.evaluate(el => {
      return (
        el.getAttribute('hidden') === null &&
        (el.getAttribute('aria-hidden') === null ||
          el.getAttribute('aria-hidden') === 'false')
      )
    })
    return {
      message: () => `expected <${name}> not to be hidden`,
      pass: visible
    }
  },

  /**
   * @param {ElementHandle} received
   * @return {{pass: boolean, message: (function(): string)}|{pass: boolean, message: (function(): string)}}
   */
  async toBeHidden (received) {
    if (typeof received === 'string') {
      received = await page.$(received)
    }
    const name = await received.evaluate(
      el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '')
    )
    const hidden = await received.evaluate(el => {
      return (
        el.getAttribute('hidden') === 'hidden' &&
        el.getAttribute('aria-hidden') === 'true'
      )
    })
    return {
      message: () => `expected <${name}> to be hidden`,
      pass: hidden
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
        return (
          this.utils.matcherHint('toHaveHTML', received, expectedHTML) +
          '\n\n' +
          `Expected: ${this.utils.printExpected(expectedHTML)}\n` +
          `Received: ${this.utils.printReceived(html)}`
        )
      }
    }
  }
})
