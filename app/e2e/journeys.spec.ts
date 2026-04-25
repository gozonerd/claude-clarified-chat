import { test, expect } from '@playwright/test';
import { buildZip } from './fixtures/sample-zips';

async function dropZip(
  page: import('@playwright/test').Page,
  bytes: Uint8Array,
  filename = 'thread.zip',
): Promise<void> {
  // Use the hidden file input for reliability across browsers
  const input = page.locator('input[type="file"]');
  await input.setInputFiles({ name: filename, mimeType: 'application/zip', buffer: Buffer.from(bytes) });
}

test.describe('J1 — What did Claude actually do?', () => {
  test('drops zip and timeline renders chronologically', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Claude Clarified Chat' })).toBeVisible();
    const zip = buildZip({});
    await dropZip(page, zip);
    await expect(page.getByText(/Loaded \d+ timeline items/)).toBeVisible();
    await expect(page.getByRole('region', { name: 'Timeline' })).toBeVisible();
    const buttons = page.getByRole('button', { name: /Open detail for/ });
    await expect(buttons.first()).toBeVisible();
  });
});

test.describe('J2 — Audit a claim', () => {
  test('filter by type narrows timeline; search narrows further', async ({ page }) => {
    await page.goto('/');
    const zip = buildZip({
      events: [
        { id: 'u1', type: 'user', timestamp: '2026-01-01T00:00:00Z', content: 'banana question' },
        { id: 'a1', type: 'assistant', timestamp: '2026-01-01T00:00:01Z', content: 'apple answer' },
        { id: 't1', type: 'tool_use', timestamp: '2026-01-01T00:00:02Z', content: 'tool call' },
      ],
    });
    await dropZip(page, zip);
    await expect(page.getByText(/Loaded 3 timeline items/)).toBeVisible();
    await page.getByLabel('Filter by event type').selectOption('user');
    await expect(page.getByText('1 of 3 events')).toBeVisible();
    // Reset
    await page.getByLabel('Filter by event type').selectOption('');
    await page.getByLabel('Search timeline by keyword').fill('banana');
    await expect(page.getByText('1 of 3 events')).toBeVisible();
  });

  test('clicking timeline item opens detail view', async ({ page }) => {
    await page.goto('/');
    await dropZip(page, buildZip({}));
    await expect(page.getByText(/Loaded \d+ timeline items/)).toBeVisible();
    await page.getByRole('button', { name: /Open detail for \[user\] e1/ }).click();
    await expect(page.getByRole('region', { name: 'Event detail' })).toBeVisible();
    await expect(page.getByText('Timestamp:')).toBeVisible();
  });
});

test.describe('J3 — Generate Clarity Corpus', () => {
  test('export button opens modal with no-secret message', async ({ page }) => {
    await page.goto('/');
    await dropZip(page, buildZip({}));
    await expect(page.getByText(/Loaded \d+ timeline items/)).toBeVisible();
    await page.getByRole('button', { name: 'Export Clarity Corpus' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/No secrets detected/)).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('Export cancelled.')).toBeVisible();
  });

  test('export with detected secret renders alert', async ({ page }) => {
    await page.goto('/');
    const zip = buildZip({
      events: [
        {
          id: 'e1',
          type: 'assistant',
          timestamp: '2026-01-01T00:00:00Z',
          content: 'sk-ant-api03-AbCdEfGhIjKlMnOpQrStUv1234567890',
        },
      ],
    });
    await dropZip(page, zip);
    await expect(page.getByText(/Loaded 1 timeline items/)).toBeVisible();
    await page.getByRole('button', { name: 'Export Clarity Corpus' }).click();
    await expect(page.getByRole('alert')).toContainText(/potential secret/);
  });
});
