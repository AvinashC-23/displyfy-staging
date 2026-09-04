import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  webServer: {
    command: "NEXT_DIST_DIR=.next-e2e DISPLYFY_PROVIDER_MODE=demo npm run build && NEXT_DIST_DIR=.next-e2e DISPLYFY_PROVIDER_MODE=demo npm run start -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    timeout: 120_000
  },
  use: {
    baseURL: "http://127.0.0.1:3100"
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } }
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 5"], viewport: { width: 375, height: 900 } }
    }
  ]
});
