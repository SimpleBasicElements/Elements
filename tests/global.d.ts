declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toBeWithinRange(a: number, b: number): R;
      toBeVisible(): Promise<R>;
      toBeHidden(): Promise<R>;
      toHaveHTML(expectedHTML: string): Promise<R>;
      toClick(selector: string): Promise<R>;
      toHaveAttribute(attribute: string, value: any): Promise<R>;
      toBeFocused(): Promise<R>;
    }
  }
}
