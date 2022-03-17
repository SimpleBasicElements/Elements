import { test, expect } from "@playwright/test";
import { loadStory } from "./utils";

test.describe("<dropdown-menu/>", async () => {
  loadStory("dropdown-menu");

  test.beforeEach(async ({ page }) => {
    await page.keyboard.press("Tab");
  });

  test.describe("Keyboard Navigation", () => {
    ["Enter", "Space", "ArrowDown"].forEach((key) => {
      test(`should focus on ${key} on arrow navigation`, async ({ page }) => {
        await page.keyboard.press(key);
        await expect(page.locator('[role="menu"]')).toBeVisible();
        await expect(page.locator("#first-link")).toBeFocused();
      });
    });

    test(`should focus on last Element on arrow down`, async ({ page }) => {
      await page.keyboard.press("ArrowUp");
      await expect(page.locator('[role="menu"]')).toBeVisible();
      await expect(page.locator("#last-link")).toBeFocused();
    });

    test(`should focus back the button when menu is closed`, async ({
      page,
    }) => {
      await page.keyboard.press("ArrowUp");
      await expect(page.locator('[role="menu"]')).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.locator('[role="menu"]')).toBeHidden();
      await expect(page.locator('[role="button"]')).toBeFocused();
    });

    test("should navigate between links on arrow down", async ({ page }) => {
      await page.keyboard.press("Enter");
      await expect(page.locator('[role="menu"]')).toBeVisible();
      await page.keyboard.press("ArrowDown");
      await expect(page.locator("#second-link")).toBeFocused();
      await page.keyboard.press("ArrowDown");
      await expect(page.locator("#last-link")).toBeFocused();
      await page.keyboard.press("ArrowDown");
      await expect(page.locator("#first-link")).toBeFocused();
    });

    test("should navigate between links on arrow up", async ({ page }) => {
      await page.keyboard.press("Enter");
      await expect(page.locator('[role="menu"]')).toBeVisible();
      await page.keyboard.press("ArrowUp");
      await expect(page.locator("#last-link")).toBeFocused();
      await page.keyboard.press("ArrowUp");
      await expect(page.locator("#second-link")).toBeFocused();
      await page.keyboard.press("ArrowUp");
      await expect(page.locator("#first-link")).toBeFocused();
    });

    test(`should focus the first links on "Home" press`, async ({ page }) => {
      await page.keyboard.press("ArrowUp");
      await expect(page.locator('[role="menu"]')).toBeVisible();
      await page.keyboard.press("Home");
      await expect(page.locator("#first-link")).toBeFocused();
    });

    test(`should focus the first links on "End" press`, async ({ page }) => {
      await page.keyboard.press("Enter");
      await expect(page.locator('[role="menu"]')).toBeVisible();
      await page.keyboard.press("End");
      await expect(page.locator("#last-link")).toBeFocused();
    });

    test(`should focus the right element on letter press`, async ({ page }) => {
      await page.keyboard.press("Enter");
      await expect(page.locator('[role="menu"]')).toBeVisible();
      await page.keyboard.press("s");
      await expect(page.locator("#second-link")).toBeFocused();
      await page.keyboard.press("f");
      await expect(page.locator("#first-link")).toBeFocused();
    });
  });

  test.describe("Mouse Navigation", () => {
    test("should open on click", async ({ page }) => {
      await page.click('[role="button"]');
      await expect(page.locator('[role="menu"]')).toBeVisible();
    });
    test("should open on click outside", async ({ page }) => {
      await page.click('[role="button"]');
      await expect(page.locator('[role="menu"]')).toBeVisible();
      await page.click("body");
      await expect(page.locator('[role="menu"]')).toBeHidden();
    });
  });

  test.describe("Aria attributes", () => {
    test("should put the right attributes on the button", async ({ page }) => {
      await expect(page.locator("[role=button]")).toHaveAttribute(
        "aria-haspopup",
        "true"
      );
      await expect(page.locator("[role=button]")).toHaveAttribute(
        "aria-controls",
        "menu-content"
      );
      await expect(page.locator("[role=button]")).toHaveAttribute(
        "aria-expanded",
        "false"
      );
      await page.keyboard.press("Enter");
      await expect(page.locator("[role=button]")).toHaveAttribute(
        "aria-expanded",
        "true"
      );
    });

    test("should put the right attributes on the menu", async ({ page }) => {
      await page.keyboard.press("Enter");
      await expect(page.locator("[role=menu]")).toHaveAttribute(
        "aria-labelledby",
        "menu"
      );
      await expect(page.locator("[role=menu] li").first()).toHaveAttribute(
        "role",
        "none"
      );
      await expect(page.locator("[role=menu] ul").first()).toHaveAttribute(
        "role",
        "none"
      );
      await expect(page.locator("[role=menu] a").first()).toHaveAttribute(
        "role",
        "menuitem"
      );
    });
  });
});
