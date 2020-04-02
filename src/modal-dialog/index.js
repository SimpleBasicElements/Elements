/**
 * @property {Element|null} previouslyFocusedElement Element focused before the opening of the modal
 */
export default class ModalDialog extends HTMLElement {

  static get observedAttributes() {return ['hidden']; }

  constructor () {
    super()
    this.setAttribute('aria-modal', 'true')
    this.close = this.close.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.previouslyFocusedElement = null
  }

  connectedCallback () {
    document.addEventListener('keydown', this.onKeyDown)
    if (this.getAttribute('overlay-close') !== null) {
      this.addEventListener('click', e => {
        if (e.target === this) {
          this.close()
        }
      })
    }
  }

  disconnectedCallback () {

  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'hidden' && newValue === null) {
      this.previouslyFocusedElement = document.activeElement
      const firstInput = this.querySelector('input, textarea, select')
      if (firstInput) {
        firstInput.focus()
      }
    }
    if (name === 'hidden' && newValue === 'hidden') {
      if (this.previouslyFocusedElement !== null) {
        this.previouslyFocusedElement.focus()
      }
      this.previouslyFocusedElement = null
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
    this.setAttribute('hidden', 'hidden')
  }

}

if (window.autoDefineComponent !== undefined) {
  customElements.define('modal-dialog', ModalDialog)
}

