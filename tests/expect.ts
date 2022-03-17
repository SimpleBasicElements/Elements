// Check if an element is visible
import { ElementHandle, expect, Page } from "@playwright/test";
import type { Locator } from "playwright";

expect.extend({
  async toBeVisible(received: Locator) {
    const name = await received.evaluate(
      (el: HTMLElement) => el.tagName.toLowerCase() + (el.id ? "#" + el.id : "")
    );
    const visible = await received.evaluate((el: HTMLElement) => {
      return (
        el.getAttribute("hidden") === null &&
        (el.getAttribute("aria-hidden") === null ||
          el.getAttribute("aria-hidden") === "false")
      );
    });
    return {
      message: () => `expected <${name}> not to be hidden`,
      pass: visible,
    };
  },

  async toBeHidden(received: Locator) {
    const name = await received.evaluate(
      (el: HTMLElement) => el.tagName.toLowerCase() + (el.id ? "#" + el.id : "")
    );
    const hidden = await received.evaluate((el: HTMLElement) => {
      return (
        ["hidden", ""].includes(el.getAttribute("hidden")) ||
        el.getAttribute("aria-hidden") === "true"
      );
    });
    return {
      message: () => `expected <${name}> to be hidden`,
      pass: hidden,
    };
  },

  async toHaveHTML(received: Locator, expectedHTML: string) {
    const html = await received.evaluate((e) => e.innerHTML);
    const pass = html === expectedHTML;

    return {
      pass,
      message: () => {
        return (
          this.utils.matcherHint("toHaveHTML", expectedHTML) +
          "\n\n" +
          `Expected: ${this.utils.printExpected(expectedHTML)}\n` +
          `Received: ${this.utils.printReceived(html)}`
        );
      },
    };
  },

  async toBeFocused(received: Locator, selector: string) {
    const pass = await received.evaluate(
      (element) => element === document.activeElement
    );

    return {
      pass,
      message: () => {
        return this.utils.matcherHint("toBeFocused", selector);
      },
    };
  },
});
