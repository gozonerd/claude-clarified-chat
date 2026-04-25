import { test, expect } from '@playwright/test';
import { buildZip, buildNonZip } from './fixtures/sample-zips';

test.describe('E1 — Malformed zip degrades gracefully', () => {
  test('non-zip bytes shows error alert and Landing remains', async ({ page }) => {
    await page.goto('/');
    const input = page.locator('input[type="file"]');
    await input.setInputFiles({
      name: 'bad.zip',
      mimeType: 'application/zip',
      buffer: Buffer.from(buildNonZip()),
    });
    await expect(page.getByRole('alert')).toContainText(/Error:/);
    await expect(page.getByLabel(/Drop a Claude thread export zip/)).toBeVisible();
  });
});

test.describe('E2 — Large export streaming', () => {
  test('500-event zip ingests and renders timeline', async ({ page }) => {
    test.setTimeout(60_000);
    const events = Array.from({ length: 500 }, (_, i) => {
      const idx = String(i);
      const hour = String(Math.floor(i / 60)).padStart(2, '0');
      const minute = String(i % 60).padStart(2, '0');
      return {
        id: `e${idx}`,
        type: 'user',
        timestamp: `2026-01-01T00:${hour}:${minute}Z`,
        content: `event ${idx}`,
      };
    });
    await page.goto('/');
    const input = page.locator('input[type="file"]');
    await input.setInputFiles({
      name: 'big.zip',
      mimeType: 'application/zip',
      buffer: Buffer.from(buildZip({ events })),
    });
    await expect(page.getByText(/Loaded 500 timeline items/)).toBeVisible({ timeout: 30_000 });
  });
});

test.describe('E3 — Sensitive content detection', () => {
  test('secret pattern surfaces in export modal', async ({ page }) => {
    await page.goto('/');
    const zip = buildZip({
      events: [
        {
          id: 'e1',
          type: 'user',
          timestamp: '2026-01-01T00:00:00Z',
          content: 'AKIAIOSFODNN7EXAMPLE',
        },
      ],
    });
    const input = page.locator('input[type="file"]');
    await input.setInputFiles({
      name: 't.zip',
      mimeType: 'application/zip',
      buffer: Buffer.from(zip),
    });
    await expect(page.getByText(/Loaded 1 timeline items/)).toBeVisible();
    await page.getByRole('button', { name: 'Export Clarity Corpus' }).click();
    await expect(page.getByRole('alert')).toContainText(/potential secret/);
  });
});
