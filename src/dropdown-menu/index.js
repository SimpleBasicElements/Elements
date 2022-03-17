/**
 * Create a dropdown menu
 * @property {HTMLElement} content
 * @property {HTMLButtonElement} button
 */
import { focusableElements } from "../utils/dom";

/**
 * @property {HTMLButtonElement} button
 * @property {DropdownMenuContent} content
 */
export class DropdownMenu extends HTMLElement {
  connectedCallback() {
    this.content = this.querySelector("dropdown-menu-content");
    this.button = this.firstElementChild;
    if (!this.content || !this.button || this.button.tagName !== "BUTTON") {
      throw new Error("Dropdown structure not expected");
    }
    this.button.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    });
    this.button.addEventListener("keydown", (e) => {
      if (
        ["ArrowDown", "Enter", " ", "ArrowDown"].includes(e.key) &&
        !this.isOpen
      ) {
        e.preventDefault();
        e.stopPropagation();
        this.open({ focusFirst: true });
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        e.stopPropagation();
        this.open({ focusLast: true });
      }
    });

    // Add a11y attributes
    const contentId =
      this.content.getAttribute("id") ??
      this.button.getAttribute("id") + "-content";
    this.button.setAttribute("role", "button");
    this.button.setAttribute("aria-expanded", "false");
    this.button.setAttribute("aria-controls", contentId);
    this.button.setAttribute("aria-haspopup", "true");
    this.content.setAttribute("id", contentId);
    this.content.setAttribute("role", "menu");
    this.content.setAttribute(
      "aria-labelledby",
      this.button.getAttribute("id")
    );
  }

  /**
   * @param {{focusFirst?: boolean, focusLast?: boolean}} options
   */
  open(options = {}) {
    this.content.removeAttribute("hidden");
    this.button.setAttribute("aria-expanded", "true");
    if (options.focusFirst) {
      this.content.focusFirstElement();
    } else if (options.focusLast) {
      this.content.focusLastElement();
    }
  }

  close() {
    this.content.setAttribute("hidden", "hidden");
    this.button.setAttribute("aria-expanded", "false");
  }

  /**
   * @return {boolean}
   */
  get isOpen() {
    return !this.content.hasAttribute("hidden");
  }
}

/**
 * Custom element for the content of the dropdown menu
 *
 * @property {HTMLElement[]} focusableElements
 * @property {DropdownMenu} parentElement
 */
export class DropdownMenuContent extends HTMLElement {
  static get observedAttributes() {
    return ["hidden"];
  }

  connectedCallback() {
    this.querySelectorAll("ul, li").forEach((element) =>
      element.setAttribute("role", "none")
    );
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "hidden") {
      this.visibilityChangeCallback(newValue === null);
    }
  }

  /**
   * @param {boolean} isVisible
   */
  visibilityChangeCallback(isVisible) {
    if (isVisible) {
      document.addEventListener("keydown", this.onKeyDown);
      document.addEventListener("keyup", this.onKeyUp);
      document.body.addEventListener("click", this.clickOutsideListener);
      this.focusableElements = focusableElements(this);
      this.focusableElements.forEach((e) => e.setAttribute("role", "menuitem"));
    } else {
      document.removeEventListener("keydown", this.onKeyDown);
      document.removeEventListener("keyup", this.onKeyUp);
      document.body.removeEventListener("click", this.clickOutsideListener);
    }
  }

  /**
   * @param {KeyboardEvent} e
   * @return {void}
   */
  onKeyDown = (e) => {
    if (e.key === "Escape") {
      this.parentElement.close();
      this.parentElement.button.focus();
      return;
    }
    // If no focusable elements do not handle keyboard navigation
    if (this.focusableElements.length === 0) {
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.moveFocus(1);
        return;
      case "ArrowUp":
        e.preventDefault();
        this.moveFocus(-1);
        return;
      case "Home":
        e.preventDefault();
        this.focusableElements[0].focus();
        return;
      case "End":
        e.preventDefault();
        this.focusableElements[this.focusableElements.length - 1].focus();
        return;
      default:
        // Do not trigger on keyboard shortcuts
        if (e.metaKey || e.ctrlKey || e.altKey) {
          return;
        }
        // Focus the element starting with the input letter
        const matchingElement = this.focusableElements.find(
          (element) => element.innerText[0].toLowerCase() === e.key
        );
        if (matchingElement) {
          e.preventDefault();
          e.stopPropagation();
          matchingElement.focus();
        }
    }
  };

  /**
   * Focus a specific element
   */
  focusFirstElement = (n) => {
    this.focusableElements[0].focus();
  };

  /**
   * Focus the last element
   */
  focusLastElement = () => {
    this.focusableElements[this.focusableElements.length - 1].focus();
  };

  /**
   * Move the focus up or down
   * @param {number} n
   */
  moveFocus = (n) => {
    const currentIndex = this.focusableElements.findIndex(
      (v) => v === document.activeElement
    );
    const focusIndex =
      (currentIndex + n + this.focusableElements.length) %
      this.focusableElements.length;
    this.focusableElements[focusIndex].focus();
  };

  onKeyUp = (e) => {
    if (e.key === "Tab" && !this.contains(document.activeElement)) {
      this.parentElement.close();
    }
  };

  clickOutsideListener = (e) => {
    if (!this.contains(e.target)) {
      e.stopPropagation();
      this.parentElement.close();
    }
  };
}

if (window.autoDefineComponent !== undefined) {
  customElements.define("dropdown-menu", DropdownMenu);
  customElements.define("dropdown-menu-content", DropdownMenuContent);
}
