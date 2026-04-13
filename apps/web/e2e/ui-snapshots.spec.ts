import * as fs from "fs";
import * as path from "path";
import { test } from "@playwright/test";

const SNAPSHOT_DIR = path.join(process.cwd(), "ui-snapshots");

test.beforeAll(() => {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
});

test("home — full page (for mobile/desktop review)", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "load" });
  await page.locator("header").first().waitFor({ state: "visible" });
  await page.waitForTimeout(400);

  const suffix = testInfo.project.name === "mobile" ? "mobile" : "desktop";
  const file = path.join(SNAPSHOT_DIR, `home-${suffix}.png`);
  await page.screenshot({ path: file, fullPage: true });
});

test("home — header crop (faster to inspect)", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "load" });
  const header = page.locator("header").first();
  await header.waitFor({ state: "visible" });
  await page.waitForTimeout(200);

  const suffix = testInfo.project.name === "mobile" ? "mobile" : "desktop";
  const file = path.join(SNAPSHOT_DIR, `header-${suffix}.png`);
  await header.screenshot({ path: file });
});
