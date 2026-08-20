// tests/negative/contact-form-negative.spec.js
// Negative-path coverage of the contact form's native HTML5 validation.
// All four fields carry the `required` attribute and the email field
// carries type="email" — these tests verify exactly that behavior and
// nothing beyond what the markup declares.

const { test, expect } = require('@playwright/test');
const { ContactPage } = require('../../pages/ContactPage');
const testData = require('../../test-data/testData.json');

test.describe('Negative: contact form validation', () => {
  test.beforeEach(async ({ page }) => {
    // Guard against a real network call even on an unexpected submit.
    await page.route('**://api.emailjs.com/**', async (route) => {
      await route.fulfill({ status: 200, body: 'OK' });
    });
  });

  test('empty form submission is blocked by required-field validation', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.goto();

    const requestSeen = { value: false };
    page.on('request', (req) => {
      if (req.url().includes('api.emailjs.com')) requestSeen.value = true;
    });

    await contact.submit();

    expect(await contact.isFieldValid(contact.nameInput)).toBe(false);
    expect(requestSeen.value).toBe(false);
  });

  test('name field rejects an empty value', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.goto();
    await contact.fillForm({
      name: testData.invalidContact.blankName,
      email: testData.validContact.email,
      subject: testData.validContact.subject,
      message: testData.validContact.message,
    });
    await contact.submit();

    expect(await contact.isFieldValid(contact.nameInput)).toBe(false);
  });

  test('message field rejects an empty value', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.goto();
    await contact.fillForm({
      name: testData.validContact.name,
      email: testData.validContact.email,
      subject: testData.validContact.subject,
      message: testData.invalidContact.blankMessage,
    });
    await contact.submit();

    expect(await contact.isFieldValid(contact.messageInput)).toBe(false);
  });

  test('email field rejects a malformed email address', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.goto();
    await contact.fillForm({
      name: testData.validContact.name,
      email: testData.invalidContact.malformedEmail,
      subject: testData.validContact.subject,
      message: testData.validContact.message,
    });
    await contact.submit();

    expect(await contact.isFieldValid(contact.emailInput)).toBe(false);
    const validationMessage = await contact.formValidationMessage(contact.emailInput);
    expect(validationMessage.length).toBeGreaterThan(0);
  });

  test('a fully valid email format passes client-side validation', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.goto();
    await contact.emailInput.fill(testData.validContact.email);

    expect(await contact.isFieldValid(contact.emailInput)).toBe(true);
  });
});
