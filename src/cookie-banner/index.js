/**
 * Bind an eventlistener on multiple elements
 *
 * @param {NodeListOf<HTMLElement>} elements
 * @param {string} elements
 * @param {function} callback
 */
function addEventListeners (elements, eventName, callback) {
  Array.from(elements).forEach(function (el) {
    el.addEventListener(eventName, function (e) {
      e.preventDefault()
      callback()
    })
  })
}

/**
 * @param {object} value
 */
function writeCookie (value) {
  document.cookie = `${CookieBanner.cookieName}=${JSON.stringify(
    value
  )};max-age=${CookieBanner.expires};path=${CookieBanner.path}`
}

/**
 * @param {object} value
 */
function readCookie () {
  const prefix = CookieBanner.cookieName + '='
  for (const cookie of document.cookie.split(/; */)) {
    if (cookie.startsWith(prefix)) {
      return JSON.parse(cookie.replace(prefix, ''))
    }
  }
  return null
}

export default class CookieBanner extends HTMLElement {
  connectedCallback () {
    if (readCookie() !== null) {
      if (this.parentElement) {
        this.parentElement.removeChild(this)
      } else {
        this.hide()
      }
      return
    }
    this.removeAttribute('hidden')
    this.removeAttribute('aria-hidden')
    this.setAttribute('tabindex', '0')
    this.setAttribute('role', 'dialog')
    this.setAttribute('aria-live', 'polite')
    this.addEventListener('keydown', this.onKeyDown.bind(this))
    addEventListeners(
      this.querySelectorAll('[data-accept]'),
      'click',
      this.accept.bind(this)
    )
    addEventListeners(
      this.querySelectorAll('[data-reject]'),
      'click',
      this.reject.bind(this)
    )
    addEventListeners(
      this.querySelectorAll('form'),
      'submit',
      this.accept.bind(this)
    )
  }

  disconnectedCallback () {
    document.removeEventListener('keydown', this.onKeyDown)
  }

  /**
   * @param {KeyboardEvent} e
   */
  onKeyDown (e) {
    if (e.key === 'Escape') {
      this.reject()
    }
  }

  reject () {
    this.dispatchEvent(new CustomEvent('reject'))
    this.hide()
    writeCookie(false)
  }

  accept () {
    /** @var {HTMLFormElement|null} form */
    const form = this.querySelector('form')
    let detail = {}
    if (form !== null) {
      detail = Object.fromEntries(new FormData(form).entries())
    }
    this.dispatchEvent(
      new CustomEvent('accept', {
        detail
      })
    )
    writeCookie(detail)
    this.hide()
  }

  hide () {
    this.removeAttribute('tabindex')
    this.setAttribute('hidden', 'hidden')
    this.setAttribute('aria-hidden', 'true')
    document.removeEventListener('keydown', this.onKeyDown)
  }

  /**
   * Check if we have the user consent
   *
   * @return {false|object} The object contains the data accepted by the user
   */
  static hasConsent () {
    const cookie = readCookie()
    if (cookie === null || cookie === false) {
      return false
    }
    return cookie
  }
}

CookieBanner.cookieName = 'cookieConsent'
CookieBanner.expires = 31104000000
CookieBanner.path = '/'

if (window.autoDefineComponent !== undefined) {
  customElements.define('cookie-banner', CookieBanner)
}
