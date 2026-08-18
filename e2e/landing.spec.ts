import { test, expect } from "@playwright/test";

// Signed-out visitors should see the marketing landing page, not get
// bounced straight to /login - and the two entry points into auth should
// both work.
test.describe("Landing page (signed out)", () => {
  test("shows the hero and primary CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /homework help/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /get started free/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /sign in/i }).first()).toBeVisible();
  });

  test("Get started free goes to registration", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /get started free/i }).first().click();
    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByLabel(/your email/i)).toBeVisible();
  });

  test("Sign in goes to the login form", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /sign in/i }).first().click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });
});
