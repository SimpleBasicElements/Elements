import { expect, test } from "@playwright/test";
import { getListenersFor, loadStory, wait } from "./utils";

test.describe("<modal-dialog/>", () => {
  loadStory("modal-dialog");

  test("should not be visible by default", async ({ page }) => {
    await expect(page.locator("modal-dialog")).toBeHidden();
  });

  test.describe("from dialog opened", () => {
    test.beforeEach(async ({ page }) => {
      const button = await page.$("#button");
      await button.click();
      await expect(page.locator("modal-dialog")).toBeVisible();
    });

    test("should focus the first input when opining dialog", async ({
      page,
    }) => {
      await expect(page.locator("#firstname")).toBeFocused();
    });

    test("should close the dialog on Escape", async ({ page }) => {
      await page.keyboard.press("Escape");
      await expect(page.locator("modal-dialog")).toBeHidden();
    });

    test("should focus the previously focused element", async ({ page }) => {
      await page.keyboard.press("Escape");
      await expect(page.locator("#button")).toBeFocused();
    });

    test("should hide modal on overlay click", async ({ page }) => {
      await wait(200);
      await page.mouse.click(5, 5);
      await wait(200);
      await expect(page.locator("modal-dialog")).toBeHidden();
    });

    test("shouldn't hide modal on content click", async ({ page }) => {
      await page.locator("#modal-box").click();
      await expect(page.locator("modal-dialog")).toBeVisible();
    });

    test("should remove event when hidden", async ({ page }) => {
      const baseLength = (await getListenersFor(page, "document")).length;
      await wait(200);
      await page.mouse.click(5, 5);
      expect(await getListenersFor(page, "document")).toHaveLength(
        baseLength - 1
      );
    });

    test("should remove event when unmounted", async ({ page }) => {
      const baseLength = (await getListenersFor(page, "document")).length;
      await page.evaluate((_) => (document.body.innerHTML = ""));
      expect(await getListenersFor(page, "document")).toHaveLength(
        baseLength - 1
      );
    });

    test("should focus the last element on previous focus", async ({
      page,
    }) => {
      await page.keyboard.down("Shift");
      await page.keyboard.press("Tab");
      await page.keyboard.up("Shift");
      const focusedElement = await page.evaluate(
        (_) => document.activeElement.id
      );
      expect(focusedElement).toBe("closebutton");
    });

    test("should focus the first element on next focus", async ({ page }) => {
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      const focusedElement = await page.evaluate(
        (_) => document.activeElement.id
      );
      expect(focusedElement).toBe("firstname");
    });

    test("should close the modal when clicking on the close button", async ({
      page,
    }) => {
      const closeButton = await page.$("[data-dismiss]");
      await closeButton.click();
      await expect(page.locator("modal-dialog")).toBeHidden();
    });

    test("should not hide the modal if event prevented", async ({ page }) => {
      const closeButton = await page.$("[data-dismiss]");
      const modalDialog = await page.$("modal-dialog");
      await modalDialog.evaluate((modal) => {
        modal.addEventListener("close", (e) => e.preventDefault());
      });
      await closeButton.click();
      await expect(page.locator("modal-dialog")).not.toBeHidden();
    });
  });
});
