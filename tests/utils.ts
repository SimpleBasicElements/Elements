import { Page, test } from "@playwright/test";

export function loadStory(storyName: string) {
  test.beforeEach(({ page }) => gotoStory(page, storyName));
}

export function gotoStory(page: Page, storyName: string, suffix: string = "") {
  return page.goto(
    `http://localhost:6006/iframe.html?id=${
      storyName.includes("--") ? storyName : `${storyName}--default`
    }&viewMode=story${suffix}`
  );
}

export function wait(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

export async function getListenersFor(
  page: Page,
  expression,
  eventName = null
) {
  const client = await page.context().newCDPSession(page);
  const element = await client.send("Runtime.evaluate", { expression });
  const listeners = (
    await client.send("DOMDebugger.getEventListeners", {
      objectId: element.result.objectId,
    })
  ).listeners;
  if (eventName) {
    return listeners.filter((l) => l.type === eventName);
  }
  return listeners;
}
