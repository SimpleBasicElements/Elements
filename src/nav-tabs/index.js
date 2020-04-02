export default class Tabs extends HTMLElement {

  constructor () {
    super()
    this.onHashChange = this.onHashChange.bind(this)
  }

  connectedCallback () {
    this.setAttribute('role', 'tablist')
    const tabs = Array.from(this.children)
    const hash = window.location.hash.replace('#', '')
    let currentTab = tabs[0]

    tabs.forEach((tab, i) => {
      const id = tab.tagName === 'A' ?
        tab.getAttribute('href').replace('#', '') :
        tab.getAttribute('aria-controls')
      const tabpanel = document.getElementById(id)

      // Should the element be the current element ?
      if (tab.getAttribute('aria-selected') === 'true' && hash === '') {
        currentTab = tab
      }
      if (id === hash) {
        currentTab = tab
      }

      // Extra attributes to improve accessibility
      tab.setAttribute('role', 'tab')
      tab.setAttribute('aria-selected', 'false')
      tab.setAttribute('tabindex', '-1')
      tab.setAttribute('aria-controls', id)
      tab.getAttribute('id') || tab.setAttribute('id', 'tab-' + id)
      tabpanel.setAttribute('role', 'tabpanel')
      tabpanel.setAttribute('aria-labelledby', tab.getAttribute('id'))
      tabpanel.setAttribute('hidden', 'hidden')
      tabpanel.setAttribute('tabindex', '0')

      // Keyboard navigation (for accessibility purpose)
      tab.addEventListener('keyup', e => {
        let index = null
        if (e.key === 'ArrowRight') {
          index = i === tabs.length - 1 ? 0 : i + 1
        } else if (e.key === 'ArrowLeft') {
          index = i === 0 ? tabs.length - 1 : i - 1
        } else if (e.key === 'Home') {
          index = 0
        } else if (e.key === 'End') {
          index = tabs.length - 1
        }
        if (index !== null) {
          this.activate(tabs[index])
          tabs[index].focus()
        }
      })
      // Mouse control
      tab.addEventListener('click', e => {
        e.preventDefault()
        this.activate(tab, tab.tagName === 'A')
      })
    })

    window.addEventListener('hashchange', this.onHashChange)

    this.activate(currentTab, false)
    if (currentTab.getAttribute('aria-controls') === hash) {
      window.requestAnimationFrame(() => {
        currentTab.scrollIntoView({
          behavior: 'smooth'
        })
      })
    }
  }

  disconnectedCallback () {
    window.removeEventListener('hashchange', this.onHashChange)
  }

  /**
   * Detects hashChange and activate the current tab if necessary
   */
  onHashChange () {
    const tab = Array
      .from(this.children)
      .find(tab => tab.getAttribute('href') === window.location.hash)
    if (tab !== undefined) {
      this.activate(tab)
      document.querySelector(window.location.hash).scrollIntoView({
        behavior: 'smooth'
      })
    }
  }

  /**
   * @param {HTMLElement} tab
   * @param {boolean} changeHash
   */
  activate (tab, changeHash = true) {
    const currentTab = this.querySelector('[aria-selected="true"]')
    if (currentTab !== null) {
      const tabpanel = document.getElementById(currentTab.getAttribute('aria-controls'))
      currentTab.setAttribute('aria-selected', 'false')
      currentTab.setAttribute('tabindex', '-1')
      tabpanel.setAttribute('hidden', 'hidden')

    }
    const id = tab.getAttribute('aria-controls')
    const tabpanel = document.getElementById(id)
    tab.setAttribute('aria-selected', 'true')
    tab.setAttribute('tabindex', '0')
    tabpanel.removeAttribute('hidden')
    if (changeHash) {
      window.history.replaceState({}, '', '#' + id)
    }
  }

}
if (window.autoDefineComponent !== undefined) {
  customElements.define('nav-tabs', Tabs)
}
