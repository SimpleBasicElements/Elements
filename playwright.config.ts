import { PlaywrightTestConfig, devices } from "@playwright/test";
import "./tests/expect";

const config: PlaywrightTestConfig = {
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    trace: "on-first-retry",
  },
  testDir: "tests",

  webServer: {
    command: "npm run storybook",
    timeout: 10_000,
    reuseExistingServer: !process.env.CI,
    url: "http://localhost:6006/iframe.html",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */
  ],
};
export default config;
