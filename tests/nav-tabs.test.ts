import { expect, test } from "@playwright/test";
import { getListenersFor, gotoStory, loadStory } from "./utils";

test.describe.only("<nav-tabs />", () => {
  test.describe("Tabs with links", () => {
    loadStory("nav-tabs");

    test.describe("Arrow Navigation", () => {
      test("should handle leftArrow navigation", async ({ page }) => {
        await page.keyboard.press("Tab");
        await page.keyboard.press("ArrowLeft");
        await expect(page.locator('[aria-selected="true"]')).toHaveText(
          "Tab 2"
        );
      });

      test("should handle rightArrow navigation", async ({ page }) => {
        await page.keyboard.press("Tab");
        await page.keyboard.press("ArrowRight");
        const selectedTab = page.locator('[aria-selected="true"]');
        await expect(selectedTab).toHaveText("Tab 1");
      });
    });

    test.describe("Hash Navigation", () => {
      test("should handle hash change navigation", async ({ page }) => {
        await gotoStory(page, "nav-tabs", "#tab2link");
        await expect(page.locator('[aria-selected="true"]')).toHaveText(
          "Tab 2"
        );
      });
    });

    test.describe("Tab index", () => {
      test("should focus tab item first", async ({ page }) => {
        await page.keyboard.press("Tab");
        const focusedElement = page.locator("*:focus");
        await expect(focusedElement).toHaveText("Tab 3");
      });

      test("should focus tab panel item first", async ({ page }) => {
        await page.keyboard.press("Tab");
        await page.keyboard.press("Tab");
        await expect(page.locator("#tab3link")).toBeFocused();
      });
    });
  });

  test.describe("#Tabs with button", () => {
    loadStory("nav-tabs--buttons");
    test("should select the first button", async ({ page }) => {
      await expect(page.locator('[aria-selected="true"]')).toHaveText("Tab 1");
    });

    test("should handle click correctly", async ({ page }) => {
      const tabContent1 = await page.$("#tab1button");
      const tabContent2 = await page.$("#tab2button");
      const tab2 = await page.$("#btntab2");
      const hiddenAttribute = (c) => c.getAttribute("hidden");
      expect(await tabContent2.evaluate(hiddenAttribute)).toBe("hidden");
      expect(await tabContent1.evaluate(hiddenAttribute)).toBeNull();
      await tab2.click();
      expect(await tabContent1.evaluate(hiddenAttribute)).toBe("hidden");
      expect(await tabContent2.evaluate(hiddenAttribute)).toBeNull();
    });

    test.describe("Optimisation", () => {
      test("should clean listeners on remove", async ({ page }) => {
        await page.$eval("body", (body) => (body.innerHTML = ""));
        const listeners = await getListenersFor(page, "window", "hashchange");
        expect(listeners).toHaveLength(0);
      });
    });
  });
});
