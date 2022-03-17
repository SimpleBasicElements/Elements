import { expect, test } from "@playwright/test";
import { getListenersFor, loadStory } from "./utils";

async function nextAnimationFrame(page) {
  return page.evaluate(
    () =>
      new Promise((resolve) => {
        window.requestAnimationFrame(resolve);
      })
  );
}

test.describe("<scroll-top/>", () => {
  loadStory("scroll-top");

  test.beforeEach(({ page }) => {
    page.keyboard.press("Tab");
  });

  test("should not be visible by default", async ({ page }) => {
    const box = await (await page.$("scroll-top")).boundingBox();
    expect(box).toBeNull();
  });

  test("should be visible when scrolling", async ({ page }) => {
    await page.evaluate(async (el) => window.scrollBy(0, window.innerHeight));
    await nextAnimationFrame(page);
    const box = await (await page.$("scroll-top")).boundingBox();
    expect(box).not.toBeNull();
  });

  test("should scroll top on click", async ({ page }) => {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForSelector("scroll-top", { state: "visible" });
    const previousScrollY = await page.evaluate((_) => window.scrollY);
    const scrollTop = await page.$("scroll-top");
    await scrollTop.click();
    await page.waitForTimeout(100);
    const scrollY = await page.evaluate((_) => window.scrollY);
    expect(scrollY).not.toBe(previousScrollY);
  });

  test("should clean listeners on remove", async ({ page }) => {
    await page.$eval("body", (body) => (body.innerHTML = ""));
    const listeners = await getListenersFor(page, "window", "scoll");
    expect(listeners.filter((l) => l.type === "scroll")).toHaveLength(0);
  });
});
