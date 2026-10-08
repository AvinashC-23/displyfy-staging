import { expect, test } from "@playwright/test";

test("homepage communicates the marketplace", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Creator partnerships that perform for both sides." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Join as a creator" })).toBeVisible();
  await expect(page.getByText("8 seconds")).toBeVisible();
  await expect(page.getByText("5,000")).toBeVisible();
  await expect(page.getByText("$275.00")).toBeVisible();
  await expect(page.getByText("public summary")).toBeVisible();
  await page.locator("summary").filter({ hasText: "Does joining guarantee earnings?" }).click();
  await expect(page.getByText("No. Earnings depend on creator approval, mission eligibility")).toBeVisible();
});

test("homepage content remains available without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto(`${baseURL}/`);
  await expect(page.getByRole("heading", { name: "Creator partnerships that perform for both sides." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Creators see the ask. Brands see the controls." })).toBeVisible();
  await expect(page.getByText("public summary")).toBeVisible();

  await context.close();
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

test("shared login shell preserves role-specific authentication", async ({ page }) => {
  await page.goto("/creator/login");
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("link", { name: "Start your creator application." })).toBeVisible();

  await page.goto("/brand/login");
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Send secure sign-in link" })).toBeVisible();

  await page.goto("/admin/login");
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("link", { name: "Start your creator application." })).toHaveCount(0);
});

test("brand access request validates and enters demo review", async ({ page }) => {
  await page.goto("/brand/access");
  await page.getByLabel("Contact name").fill("Asha Mehta");
  await page.getByLabel("Job title").fill("Marketing lead");
  await page.getByLabel("Company name").fill("Northline Goods");
  await page.getByLabel("Company website").fill("https://northline.example");
  await page.getByLabel("Work email").fill("asha@northline.example");
  await page.getByLabel("Phone").fill("+919876543210");
  await page.getByLabel("Country").selectOption("IN");
  await page.getByLabel("Estimated campaign budget").selectOption("5k-25k");
  await page.getByLabel("Campaign objective").fill("Launch a creator-led desk collection with measurable product discovery.");
  await page.getByRole("button", { name: "Request brand access" }).click();
  await expect(page.getByRole("status")).toContainText("local demo mode");
});

test("role dashboards render seeded workflows", async ({ page }) => {
  await page.goto("/creator/dashboard"); await expect(page.getByRole("heading",{name:/Good morning/})).toBeVisible();
  await expect(page.getByRole("link", { name: /View Desk object placement/ })).toBeVisible();
  await page.goto("/brand/dashboard"); await expect(page.getByRole("heading",{name:"Northline Goods"})).toBeVisible();
  await expect(page.getByText("Campaigns, presented as products.")).toBeVisible();
  await page.goto("/admin"); await expect(page.getByRole("heading",{name:/Review what needs a decision/})).toBeVisible();
});

test("navigation derives its active section from the current route", async ({ page }) => {
  await page.goto("/for-creators");
  if (page.viewportSize()!.width < 900) await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByRole("link", { name: "Creators", exact: true })).toHaveAttribute("aria-current", "page");
  await page.goto("/creator/account");
  await expect(page.getByRole("link", { name: "Account", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("heading", { name: "Your profile, history, and payout trail." })).toBeVisible();
});

test("creator can update account details in demo mode", async ({ page }) => {
  await page.goto("/creator/account");
  await page.getByLabel("Display name").fill("Maya Studio");
  await page.getByRole("button", { name: "Save account details" }).click();
  await expect(page.getByRole("status")).toContainText("local demo mode");
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
  await expect(page.getByRole("link", { name: "My missions" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("heading", { name: "The creative ask" })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/brand\/dashboard/);
  await expect(page.getByRole("heading", { name: "Northline Goods" })).toBeVisible();
  await expect(page.getByText("Campaigns, presented as products.")).toBeVisible();
});

test("primary pages do not overflow the viewport", async ({ page }) => {
  for (const path of ["/", "/for-creators", "/for-brands", "/creator/dashboard", "/creator/missions", "/creator/account", "/brand/dashboard", "/admin"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const sizes = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    expect(sizes.content, `${path} overflowed by ${sizes.content - sizes.viewport}px`).toBeLessThanOrEqual(sizes.viewport);
  }
});
