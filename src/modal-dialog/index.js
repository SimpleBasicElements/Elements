/**
 * @property {Element|null} previouslyFocusedElement Element focused before the opening of the modal
 * @property {array<HTMLDivElement>} trapElements
 */
export default class ModalDialog extends HTMLElement {
  static get observedAttributes () {
    return ['hidden']
  }

  constructor () {
    super()
    this.close = this.close.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.previouslyFocusedElement = null
    this.trapElements = []
  }

  connectedCallback () {
    this.setAttribute('aria-modal', 'true')
    this.setAttribute('role', 'dialog')
    this.addEventListener('click', e => {
      if (
        (e.target === this && this.getAttribute('overlay-close') !== null) ||
        e.target.dataset.dismiss !== undefined ||
        e.target.closest('[data-dismiss]') !== null
      ) {
        this.close()
      }
    })
    this.createTrapFocusElement('afterbegin')
    this.createTrapFocusElement('beforeend')
    document.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback () {
    document.removeEventListener('keydown', this.onKeyDown)
    this.trapElements.forEach(element =>
      element.parentElement.removeChild(element)
    )
    this.trapElements = []
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'hidden' && newValue === null) {
      this.previouslyFocusedElement = document.activeElement
      const firstInput = this.getFocusableElements()[0]
      if (firstInput) {
        firstInput.focus()
      }
      document.addEventListener('keydown', this.onKeyDown)
      this.removeAttribute('aria-hidden')
    }
    if (name === 'hidden' && newValue === 'hidden') {
      if (this.previouslyFocusedElement !== null) {
        this.previouslyFocusedElement.focus()
      }
      this.previouslyFocusedElement = null
      this.setAttribute('aria-hidden', 'true')
      document.removeEventListener('keydown', this.onKeyDown)
    }
  }

  /**
   * @param {KeyboardEvent} e
   */
  onKeyDown (e) {
    if (e.key === 'Escape') {
      this.close()
    }
  }

  close () {
    const event = new CustomEvent('close', {
      detail: { close: true },
      cancelable: true
    })
    this.dispatchEvent(event)
    if (!event.defaultPrevented) {
      this.setAttribute('hidden', 'hidden')
    }
  }

  /**
   * Create an element used to trap focus inside the dialog
   *
   * @param position
   */
  createTrapFocusElement (position) {
    const element = document.createElement('div')
    element.setAttribute('tabindex', '0')
    element.addEventListener('focus', () => {
      const focusableElements = this.getFocusableElements()
      if (focusableElements.length > 0) {
        focusableElements[
          position === 'afterbegin' ? focusableElements.length - 1 : 0
        ].focus()
      }
    })
    this.trapElements.push(element)
    this.insertAdjacentElement(position, element)
  }

  /**
   * @return array<Element>
   */
  getFocusableElements () {
    const selector = `[href],
      button:not([disabled]),
      input:not([disabled]),
      select:not([disabled]),
      textarea:not([disabled]),
      [tabindex]:not([tabindex="-1"]`
    return Array.from(this.querySelectorAll(selector)).filter(element => {
      const rect = element.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    })
  }
}

if (window.autoDefineComponent !== undefined) {
  customElements.define('modal-dialog', ModalDialog)
}
