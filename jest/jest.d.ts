import { ElementHandle } from 'puppeteer'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeVisible(): Promise<R>;
      toHaveHTML(expectedHTML: string): Promise<R>;
      toClick(selector: string): Promise<R>;
    }
  }
}
