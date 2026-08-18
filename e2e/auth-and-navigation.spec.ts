import { test, expect, type Page } from "@playwright/test";

// Deterministic flows only (auth, navigation, content selection) - no
// Claude/Groq call is on this path anywhere, so this suite runs the same
// whether or not an API key is configured. AI-dependent flows (Voice Q&A,
// grading, Reasoning Interview, Exam Coaching) are deliberately out of
// scope here - see PLATFORM_PLAN.md.

function uniqueEmail(): string {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@studyezy.local`;
}

async function registerNewAccount(page: Page, email: string, kidName: string) {
  await page.goto("/register");
  await page.getByLabel(/your email/i).fill(email);
  await page.getByLabel(/^password$/i).fill("TestPassword123!");
  await page.getByLabel(/kid's name/i).fill(kidName);
  await page.getByRole("button", { name: /create account/i }).click();
}

test.describe("Registration → unit selection → navigation → sign out", () => {
  test("a new account can register, reach the unit selector, and sign out", async ({ page }) => {
    const email = uniqueEmail();
    await registerNewAccount(page, email, "E2E Kid");

    // Registration sets the active profile and redirects straight to /select.
    await expect(page).toHaveURL(/\/select/);
    await expect(page.getByRole("heading", { name: /what are we learning today/i })).toBeVisible();

    // The seeded catalog should have at least Cambridge Stage 5 English Unit 1 available.
    await expect(page.getByText(/fiction: stories from different cultures/i)).toBeVisible();

    // Primary nav is reachable - label text is present in the accessibility
    // tree even where it's visually compact (sr-only below the sm
    // breakpoint), so role-based lookup works regardless of viewport.
    await page.getByRole("link", { name: "Dashboard" }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: /progress/i })).toBeVisible();

    await page.getByRole("link", { name: "Prep Plan" }).click();
    await expect(page).toHaveURL(/\/plan/);
    await expect(page.getByRole("heading", { name: /prep plan/i })).toBeVisible();

    // Sign out is reachable from the account menu on every shell page, not
    // just /profiles - this was a real gap fixed earlier, worth covering.
    await page.getByRole("button", { name: new RegExp("E2E Kid", "i") }).click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("signing back in with the same credentials works", async ({ page }) => {
    const email = uniqueEmail();
    await registerNewAccount(page, email, "Return Kid");
    await expect(page).toHaveURL(/\/select/);

    await page.getByRole("button", { name: new RegExp("Return Kid", "i") }).click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/login/);

    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill("TestPassword123!");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/select/);
    await expect(page.getByRole("heading", { name: /what are we learning today/i })).toBeVisible();
  });

  test("a wrong password is rejected with a clear message", async ({ page }) => {
    const email = uniqueEmail();
    await registerNewAccount(page, email, "Wrong Pass Kid");
    await page.getByRole("button", { name: new RegExp("Wrong Pass Kid", "i") }).click();
    await page.getByRole("menuitem", { name: /sign out/i }).click();

    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill("NotTheRightPassword");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/doesn't match an account/i)).toBeVisible();
  });
});
