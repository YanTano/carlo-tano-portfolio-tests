import { test, expect } from '../fixtures/test-fixtures';

test.describe('Contact form', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.scrollToSection('contact');
  });

  test('blocks submission when required fields are empty', async ({ contactSection }) => {
    await contactSection.submit();
    // Native HTML5 validation should keep the page on the form (no navigation),
    // and the first invalid field should receive focus.
    await expect(contactSection.nameInput).toBeFocused();
  });

  test('rejects an invalid email format', async ({ contactSection }) => {
    await contactSection.fill({
      name: 'Jane Recruiter',
      email: 'not-an-email',
      subject: 'Interview',
      message: 'Are you available next week?',
    });
    await contactSection.submit();

    const validity = await contactSection.emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(validity).toBe(false);
  });

  test('accepts a valid submission and shows a status message', async ({ page, contactSection }) => {
    // EmailJS makes a real network call in production; stub it so the
    // suite stays fast, deterministic, and doesn't spam a real inbox.
    await page.route('https://api.emailjs.com/**', (route) =>
      route.fulfill({ status: 200, body: 'OK' })
    );

    await contactSection.fill({
      name: 'Jane Recruiter',
      email: 'jane@example.com',
      subject: 'Interview',
      message: 'Are you available next week for a quick call?',
    });
    await contactSection.submit();

    await expect(contactSection.formNote).toContainText('Message sent successfully');
  });

  test('shows an error state when the send fails', async ({ page, contactSection }) => {
    await page.route('https://api.emailjs.com/**', (route) =>
      route.fulfill({ status: 500, body: 'Server error' })
    );

    await contactSection.fill({
      name: 'Jane Recruiter',
      email: 'jane@example.com',
      subject: 'Interview',
      message: 'Testing the failure path.',
    });
    await contactSection.submit();

    await expect(contactSection.formNote).toContainText('Failed to send message');
  });
});
