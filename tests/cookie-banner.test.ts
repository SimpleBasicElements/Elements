import { expect, test } from "@playwright/test";
import { loadStory } from "./utils";

test.describe("<cookie-banner/>", () => {
  loadStory("cookie-banner");

  test.beforeEach(({ context }) => {
    context.clearCookies();
  });

  test("should hide on action", async ({ page }) => {
    await page.keyboard.press("Tab");
    await page.keyboard.press("Escape");
    await expect(page.locator("#banner")).toBeHidden();
  });
  test.describe("Cookies", () => {
    test("should remember user refusal", async ({ page, context }) => {
      await (await page.$("[data-reject]")).click();
      const cookies = await context.cookies();
      expect(cookies).toHaveLength(1);
      expect(cookies[0].name).toBe("cookieConsent");
      expect(cookies[0].value).toBe("false");
    });
    test("should remember user accept", async ({ page, context }) => {
      await (await page.$("[data-accept]")).click();
      const cookies = await context.cookies();
      expect(cookies).toHaveLength(1);
      expect(cookies[0].name).toBe("cookieConsent");
      expect(cookies[0].value).toBe("{}");
    });
    test("should remember user form choices", async ({ page, context }) => {
      await page.locator("[name=tracking]").click();
      await page.locator("[data-accept]").click();
      const cookies = await context.cookies();
      expect(cookies).toHaveLength(1);
      expect(cookies[0].name).toBe("cookieConsent");
      expect(cookies[0].value).toBe('{"tracking":"1"}');
    });
  });
});
