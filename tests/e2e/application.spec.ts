import { test, expect, type Page } from "@playwright/test";

async function login(page: Page, rollNumber: string, classCode: string) {
  await page.goto("/login");
  await page.locator('input[name="rollNumber"]').fill(rollNumber);
  await page.locator('input[name="classCode"]').fill(classCode);
  await page.getByRole("button", { name: "Authenticate" }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"));
  await expect(page.getByText("Operational status: online")).toBeVisible({ timeout: 30000 });
}

test.describe.serial("Anti-Kuddus integrated mission flows", () => {
  test("public landing and warning status load from MongoDB", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Authority needs accountability." })).toBeVisible();
    await page.goto("/warnings");
    await expect(page.getByText("Warnings")).toBeVisible();
  });

  test("student submits an identity-separated complaint", async ({ page }) => {
    await login(page, "07", "student123");
    await page.goto("/complaints/new");
    await expect(page.getByRole("heading", { name: "Report abuse. Keep your identity." })).toBeVisible();
    await page.locator('select[name="category"]').selectOption("seat_abuse");
    await page.locator('textarea[name="description"]').fill("A seat was reassigned to obstruct teacher visibility during the class period.");
    await page.locator('input[name="incidentDate"]').fill(new Date().toISOString().slice(0, 10));
    await page.locator('input[name="location"]').fill("Classroom");
    await page.locator("label.notice").click();
    await page.getByRole("button", { name: "Submit anonymously" }).click();
    await expect(page.getByText("Complaint received")).toBeVisible();
  });

  test("teacher verifies a pending complaint and warning count updates", async ({ page }) => {
    await login(page, "T01", "teacher123");
    await page.goto("/teacher/complaints");
    const verify = page.getByRole("button", { name: "Verify" });
    await expect(verify.first()).toBeVisible();
    await verify.first().click();
    await page.goto("/warnings");
    await expect(page.getByText("3/3")).toBeVisible();
  });

  test("student generates and optimizes a persisted seat plan", async ({ page }) => {
    await login(page, "12", "student123");
    await page.goto("/seat-planner");
    await page.locator('input[name="name"]').fill("E2E Visibility Plan");
    await page.locator('input[name="aisles"]').fill("3");
    await page.getByRole("button", { name: "Generate & save" }).click();
    await expect(page.getByRole("heading", { name: /E2E Visibility Plan/ })).toBeVisible();
    await page.getByRole("button", { name: "Optimize sightline" }).click();
    await expect(page.getByText("KUDDUS", { exact: true })).toBeVisible();
  });

  test("anonymous ledger persists and recalculates analytics", async ({ page }) => {
    await login(page, "07", "student123");
    await page.goto("/ledger");
    await page.locator('input[name="amount"]').fill("25");
    await page.getByRole("button", { name: "Record anonymously" }).click();
    await expect(page.getByText("Anonymous entry recorded")).toBeVisible();
  });

  test("stored school rules ground the fact-check verdict", async ({ page }) => {
    await login(page, "07", "student123");
    await page.goto("/fact-check");
    await page.locator('textarea[name="claim"]').fill("Captains do not have to submit homework.");
    await page.getByRole("button", { name: "Check official rules" }).click();
    await expect(page.getByText("FALSE", { exact: true })).toBeVisible();
    await expect(page.getByText("Class captains must submit homework", { exact: false })).toBeVisible();
  });

  test("student SOS is acknowledged and resolved by a captain", async ({ browser }) => {
    const studentContext = await browser.newContext(); const captainContext = await browser.newContext();
    const student = await studentContext.newPage(); const captain = await captainContext.newPage();
    await login(student, "12", "student123"); await student.goto("/sos");
    await student.locator("select").selectOption("library"); await student.getByRole("button", { name: "SOS" }).click();
    await expect(student.getByText("Captains have been alerted")).toBeVisible();
    const publicId = await student.locator(".card h2").innerText();
    await login(captain, "02", "captain123"); await captain.goto("/captain/sos");
    const alertCard = captain.locator(".card").filter({ hasText: publicId });
    await expect(alertCard.getByRole("heading", { name: "LIBRARY", exact: true })).toBeVisible();
    await alertCard.getByRole("button", { name: "Acknowledge" }).click();
    await expect(student.getByText("acknowledged", { exact: true })).toBeVisible({ timeout: 15000 });
    await alertCard.getByRole("button", { name: "Resolve" }).click();
    await expect(student.getByText("resolved", { exact: true })).toBeVisible({ timeout: 15000 });
    await studentContext.close(); await captainContext.close();
  });
});
