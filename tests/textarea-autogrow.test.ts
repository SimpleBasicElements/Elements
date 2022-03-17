import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { loadStory } from "./utils";

function textareaHeight(page: Page) {
  return page.evaluate(
    () => (document.querySelector("#content") as HTMLElement).offsetHeight
  );
}

test.describe('is="textarea-autogrow"', () => {
  loadStory("textarea-autogrow");
  test("should grow on focus", async ({ page }) => {
    const textarea = await page.$("#content");
    const defaultHeight = await textareaHeight(page);
    await textarea.focus();
    expect(await textareaHeight(page)).toBeGreaterThan(defaultHeight);
  });

  test("should shrink when less text", async ({ page }) => {
    const textarea = await page.$("#content");
    await textarea.focus();
    const height = await textareaHeight(page);
    await page.keyboard.down("Control");
    await page.keyboard.press("A");
    await page.keyboard.up("Control");
    await page.keyboard.up("Backspace");
    await page.keyboard.type("Hello world");
    expect(await textareaHeight(page)).toBeLessThan(height);
  });
});
