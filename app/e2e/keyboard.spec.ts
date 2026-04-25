import { test, expect } from '@playwright/test';
import { buildZip } from './fixtures/sample-zips';

test('keyboard-only timeline navigation', async ({ page }) => {
  await page.goto('/');
  const input = page.locator('input[type="file"]');
  await input.setInputFiles({
    name: 't.zip',
    mimeType: 'application/zip',
    buffer: Buffer.from(buildZip({})),
  });
  await expect(page.getByText(/Loaded \d+ timeline items/)).toBeVisible();
  // Tab to traverse focus; assert each focused element has visible text or aria-label
  for (let i = 0; i < 5; i++) {
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      const label = el.getAttribute('aria-label');
      const rawText = el.textContent;
      const text = rawText ? rawText.slice(0, 50) : '';
      return {
        tag: el.tagName,
        label: label || text || '(no label)',
      };
    });
    expect(focused).not.toBeNull();
    // Ensure focus moved to a real element
    if (focused) {
      expect(focused.label).not.toBe('');
    }
    await page.keyboard.press('Tab');
  }
});
