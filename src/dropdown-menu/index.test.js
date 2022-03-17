require("expect-puppeteer");

/**
 * Test the behaviour of the dropdown menu component following the W3 specs
 * https://www.w3.org/TR/wai-aria-practices/examples/menu-button/menu-button-links.html
 *
 * We do not respect the `tabindex="-1"` since we want links to be browsable using tabs
 */
describe("DropdownMenu", () => {
  beforeEach(async () => {
    await page.goto(
      `http://localhost:6006/iframe.html?id=dropdownmenu--default&viewMode=story`
    );
    // Focus the button for the start
    await page.keyboard.press("Tab");
  });

  describe("#Keyboard Navigation", () => {
    ["Enter", "Space", "ArrowDown"].forEach((key) => {
      it(`should focus on ${key} on arrow navigation`, async () => {
        await page.keyboard.press(key);
        await expect('[role="menu"]').toBeVisible();
        await expect("#first-link").toBeFocused();
      });
    });

    it(`should focus on last Element on arrow down`, async () => {
      await page.keyboard.press("ArrowUp");
      await expect('[role="menu"]').toBeVisible();
      await expect("#last-link").toBeFocused();
    });

    it(`should focus back the button when menu is closed`, async () => {
      await page.keyboard.press("ArrowUp");
      await expect('[role="menu"]').toBeVisible();
      await page.keyboard.press("Escape");
      await expect('[role="menu"]').toBeHidden();
      await expect('[role="button"]').toBeFocused();
    });

    it("should navigate between links on arrow down", async () => {
      await page.keyboard.press("Enter");
      await expect('[role="menu"]').toBeVisible();
      await page.keyboard.press("ArrowDown");
      await expect("#second-link").toBeFocused();
      await page.keyboard.press("ArrowDown");
      await expect("#last-link").toBeFocused();
      await page.keyboard.press("ArrowDown");
      await expect("#first-link").toBeFocused();
    });

    it("should navigate between links on arrow up", async () => {
      await page.keyboard.press("Enter");
      await expect('[role="menu"]').toBeVisible();
      await page.keyboard.press("ArrowUp");
      await expect("#last-link").toBeFocused();
      await page.keyboard.press("ArrowUp");
      await expect("#second-link").toBeFocused();
      await page.keyboard.press("ArrowUp");
      await expect("#first-link").toBeFocused();
    });

    it(`should focus the first links on "Home" press`, async () => {
      await page.keyboard.press("ArrowUp");
      await expect('[role="menu"]').toBeVisible();
      await page.keyboard.press("Home");
      await expect("#first-link").toBeFocused();
    });

    it(`should focus the first links on "End" press`, async () => {
      await page.keyboard.press("Enter");
      await expect('[role="menu"]').toBeVisible();
      await page.keyboard.press("End");
      await expect("#last-link").toBeFocused();
    });

    it(`should focus the right element on letter press`, async () => {
      await page.keyboard.press("Enter");
      await expect('[role="menu"]').toBeVisible();
      await page.keyboard.press("s");
      await expect("#second-link").toBeFocused();
      await page.keyboard.press("f");
      await expect("#first-link").toBeFocused();
    });
  });

  describe("#Mouse Navigation", () => {
    it("should open on click", async () => {
      await page.click('[role="button"]');
      await expect('[role="menu"]').toBeVisible();
    });
    it("should open on click outside", async () => {
      await page.click('[role="button"]');
      await expect('[role="menu"]').toBeVisible();
      await page.click("body");
      await expect('[role="menu"]').toBeHidden();
    });
  });

  describe("#Aria attributes", () => {
    it("should put the right attributes on the button", async () => {
      await expect("[role=button]").toHaveAttribute("aria-haspopup", "true");
      await expect("[role=button]").toHaveAttribute(
        "aria-controls",
        "menu-content"
      );
      await expect("[role=button]").toHaveAttribute("aria-expanded", "false");
      await page.keyboard.press("Enter");
      await expect("[role=button]").toHaveAttribute("aria-expanded", "true");
    });

    it("should put the right attributes on the menu", async () => {
      await page.keyboard.press("Enter");
      await expect("[role=menu]").toHaveAttribute("aria-labelledby", "menu");
      await expect("[role=menu] li").toHaveAttribute("role", "none");
      await expect("[role=menu] ul").toHaveAttribute("role", "none");
      await expect("[role=menu] a").toHaveAttribute("role", "menuitem");
    });
  });
});
