import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { buildZip } from './fixtures/sample-zips';

test.describe('axe-core accessibility', () => {
  test('idle landing page has zero critical/serious violations', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const blocking = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });

  test('ready state (timeline + detail) has zero critical/serious violations', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[type="file"]');
    await input.setInputFiles({
      name: 't.zip',
      mimeType: 'application/zip',
      buffer: Buffer.from(buildZip({})),
    });
    await expect(page.getByText(/Loaded \d+ timeline items/)).toBeVisible();
    await page.getByRole('button', { name: /Open detail for/ }).first().click();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const blocking = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });

  test('export modal has zero critical/serious violations', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[type="file"]');
    await input.setInputFiles({
      name: 't.zip',
      mimeType: 'application/zip',
      buffer: Buffer.from(buildZip({})),
    });
    await expect(page.getByText(/Loaded \d+ timeline items/)).toBeVisible();
    await page.getByRole('button', { name: 'Export Clarity Corpus' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const blocking = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });
});
