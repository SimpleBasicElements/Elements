import { ElementHandle } from 'puppeteer'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeVisible(): Promise<R>;
    }
  }
}
