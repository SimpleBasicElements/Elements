import {debounce} from '../utils/time.js'

export default class Autogrow extends HTMLTextAreaElement {

  autogrow () {
    const previousHeight = this.style.height
    this.style.height = 'auto'
    if (this.style.height !== previousHeight) {
      this.dispatchEvent(new CustomEvent('grow', {
        detail: {
          height: this.scrollHeight
        }
      }))
    }
    this.style.height = this.scrollHeight + 'px'
  }

  onFocus () {
    this.autogrow()
    window.addEventListener('resize', this.onResize)
    this.removeEventListener('focus', this.onFocus)
  }

  onResize () {
    this.autogrow()
  }

  connectedCallback () {
    this.style.overflow = 'hidden'
    this.style.resize = 'none'
    this.addEventListener('input', this.autogrow)
    this.addEventListener('focus', this.onFocus)
  }

  disconnectedCallback () {
    window.removeEventListener('resize', this.onResize)
  }

  constructor () {
    super()
    this.autogrow = this.autogrow.bind(this)
    this.onResize = debounce(this.onResize.bind(this), 300)
    this.onFocus = this.onFocus.bind(this)
  }

}


if (window.autoDefineComponent !== undefined) {
  customElements.define('textarea-autogrow', Autogrow, { extends: 'textarea' })
}
