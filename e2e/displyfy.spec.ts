import { expect, test } from "@playwright/test";

test("homepage communicates the marketplace", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Turn the attention you create into income." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Join as a creator" })).toBeVisible();
});

test("creator application validates and enters demo review", async ({ page }) => {
  await page.goto("/creator/apply");
  await page.getByLabel("Full legal name").fill("Maya Rao"); await page.getByLabel("Display name").fill("Maya Desk");
  await page.getByLabel("Instagram username").fill("@mayadesk"); await page.getByLabel("Instagram profile URL").fill("https://instagram.com/mayadesk");
  await page.getByLabel("Email", { exact: true }).fill("maya@example.com"); await page.getByLabel("Phone with country code").fill("+919876543210");
  await page.getByLabel("Country", { exact: true }).selectOption("IN"); await page.getByLabel("Primary category", { exact: true }).selectOption("lifestyle");
  await page.getByLabel("Preferred language").fill("English"); await page.getByLabel("Follower range").selectOption("10k-50k");
  await page.getByLabel("Average Reel views").fill("18000"); await page.getByLabel("Password", { exact:true }).fill("correct horse battery staple"); await page.getByLabel("Confirm password").fill("correct horse battery staple");
  await page.getByLabel("Describe your content").fill("Workspace and everyday technology content for curious professionals.");
  for (const box of await page.getByRole("checkbox").all()) await box.check();
  await page.getByRole("button",{name:"Submit application"}).click(); await expect(page.getByRole("status")).toContainText("local demo mode");
});

test("role dashboards render seeded workflows", async ({ page }) => {
  await page.goto("/creator/dashboard"); await expect(page.getByRole("heading",{name:/Good morning/})).toBeVisible();
  await expect(page.getByRole("link", { name: /View Desk object placement/ })).toBeVisible();
  await page.goto("/brand/dashboard"); await expect(page.getByRole("heading",{name:"Northline Goods"})).toBeVisible();
  await expect(page.getByText("Campaigns, presented as products.")).toBeVisible();
  await page.goto("/admin"); await expect(page.getByRole("heading",{name:/Review what needs a decision/})).toBeVisible();
});

test("creator browses, opens, and applies to a mission", async ({ page }) => {
  await page.goto("/creator/missions");
  await expect(page.getByRole("heading", { name: "Find work that fits your content." })).toBeVisible();
  await page.getByPlaceholder("Search by brand, product, or brief").fill("ceramic");
  await page.getByRole("link", { name: /View Desk object placement/ }).click();
  await expect(page).toHaveURL(/\/creator\/missions\/7fa93180/);
  await expect(page.getByRole("heading", { name: "The creative ask" })).toBeVisible();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /Apply for this mission/ }).click();
  await expect(page.getByRole("status")).toContainText("local demo mode");
});

test("brand mission back navigation keeps the current workspace", async ({ page }) => {
  await page.goto("/brand/dashboard");
  await expect(page.getByRole("navigation", { name: "brand workspace" })).toHaveCount(1);
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toHaveCount(0);
  await page.locator('.mission-grid a[href^="/brand/missions/"]').first().click();
  await expect(page).toHaveURL(/\/brand\/missions\//);
  await expect(page.getByRole("heading", { name: "The creative ask" })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/brand\/dashboard/);
  await expect(page.getByRole("heading", { name: "Northline Goods" })).toBeVisible();
  await expect(page.getByText("Campaigns, presented as products.")).toBeVisible();
});

test("primary pages do not overflow the viewport", async ({ page }) => {
  for (const path of ["/", "/creator/dashboard", "/creator/missions", "/brand/dashboard", "/admin"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const sizes = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(sizes.content, `${path} overflowed by ${sizes.content - sizes.viewport}px`).toBeLessThanOrEqual(sizes.viewport);
  }
});
