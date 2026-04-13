import { defineConfig, devices } from "@playwright/test";

/**
 * Visual snapshots for local / agent review — no manual screenshots needed.
 * Run: npm run test:visual -w web  (first time: npm run playwright:install -w web)
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "off",
    screenshot: "off",
    video: "off",
  },
  projects: [
    {
      name: "mobile",
      use: {
        ...devices["iPhone 12"],
        // Same viewport as iPhone 12 but Chromium only (no WebKit install needed).
        browserName: "chromium",
      },
    },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    cwd: __dirname,
    stdout: "pipe",
    stderr: "pipe",
  },
});
