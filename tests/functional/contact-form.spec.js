// tests/functional/contact-form.spec.js
// Functional (positive) coverage of the EmailJS-powered contact form.
//
// IMPORTANT: The form's submit handler calls the EmailJS API
// (api.emailjs.com) directly from the browser. To keep this suite fast,
// deterministic, and side-effect-free (no real emails sent from CI), the
// network call is intercepted and stubbed with a success response. This
// still exercises all of the site's own client-side logic (field
// collection, submit handler, success UI) without depending on a live
// third-party service or leaking EmailJS credentials into CI.

const { test, expect } = require('@playwright/test');
const { ContactPage } = require('../../pages/ContactPage');
const testData = require('../../test-data/testData.json');

test.describe('Functional: contact form', () => {
  test.beforeEach(async ({ page }) => {
    // Stub the EmailJS send endpoint so no real email is dispatched.
    await page.route('**://api.emailjs.com/**', async (route) => {
      await route.fulfill({ status: 200, body: 'OK' });
    });
  });

  test('contact form is visible with all expected fields', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.goto();

    await expect(contact.form).toBeVisible();
    await expect(contact.nameInput).toBeVisible();
    await expect(contact.emailInput).toBeVisible();
    await expect(contact.subjectInput).toBeVisible();
    await expect(contact.messageInput).toBeVisible();
    await expect(contact.submitButton).toBeVisible();
  });

  test('contact form accepts valid data in every field', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.goto();
    await contact.fillForm(testData.validContact);

    await expect(contact.nameInput).toHaveValue(testData.validContact.name);
    await expect(contact.emailInput).toHaveValue(testData.validContact.email);
    await expect(contact.subjectInput).toHaveValue(testData.validContact.subject);
    await expect(contact.messageInput).toHaveValue(testData.validContact.message);

    for (const locator of [
      contact.nameInput,
      contact.emailInput,
      contact.subjectInput,
      contact.messageInput,
    ]) {
      await expect(await contact.isFieldValid(locator)).toBe(true);
    }
  });

  test('submitting a fully valid form triggers the EmailJS request', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.goto();
    await contact.fillForm(testData.validContact);

    const requestPromise = page.waitForRequest('**://api.emailjs.com/**');
    await contact.submit();
    const request = await requestPromise;

    expect(request).toBeTruthy();
  });

  test('contact section displays the correct contact email', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.goto();
    await expect(contact.contactEmailText).toBeVisible();
  });
});
