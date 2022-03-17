import { test } from "@playwright/test";

export function loadStory(storyName: string) {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      `http://localhost:6006/iframe.html?id=${storyName}--default&viewMode=story`
    );
  });
}
