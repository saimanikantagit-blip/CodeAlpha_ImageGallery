const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('uses the expected responsive grid and loads the complete stylesheet', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-image img')).toHaveAttribute('alt', 'Mountain peaks reflected in a still alpine lake at dawn');
  await expect(page.locator('.hero-image img')).toHaveAttribute('src', /photo-1470770841072-f978cf4d019e/);
  const columns = await page.locator('#gallery-grid').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
  const expected = page.viewportSize().width <= 600 ? 1 : page.viewportSize().width <= 900 ? 2 : 3;
  expect(columns).toBe(expected);
  const rules = await page.evaluate(() => document.styleSheets[0].cssRules.length);
  expect(rules).toBeGreaterThan(30);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('has no automated accessibility violations on the page or in the open viewer', async ({ page }) => {
  await page.goto('/');
  const pageAudit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(pageAudit.violations).toEqual([]);
  await page.locator('.gallery-card').first().press('Enter');
  await expect(page.locator('#lightbox')).toHaveCSS('opacity', '1');
  const viewerAudit = await new AxeBuilder({ page }).include('#lightbox').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(viewerAudit.violations).toEqual([]);
});

test('all remote gallery photographs decode successfully', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Image source check runs once in desktop Chromium');
  await page.goto('/');
  const cards = page.locator('.gallery-card');
  const failures = [];
  for (let index = 0; index < await cards.count(); index++) {
    const image = cards.nth(index).locator('img');
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((element) => element.decode().catch(() => {}));
    const loaded = await image.evaluate((element) => element.naturalWidth > 0);
    if (!loaded) failures.push(await image.getAttribute('alt'));
  }
  expect(failures).toEqual([]);
});

test('renders all photographs and filters each category with an accurate count', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Category filter interaction runs in the desktop project');
  await page.goto('/');
  await expect(page.locator('.gallery-card')).toHaveCount(18);
  for (const [category, expected] of [['Nature', 5], ['Architecture', 4], ['Travel', 5], ['Portraits', 4]]) {
    await page.getByRole('button', { name: category, exact: true }).click();
    await expect(page.locator('.gallery-card')).toHaveCount(expected);
    await expect(page.locator('#image-count')).toContainText(String(expected).padStart(2, '0'));
    await expect(page.getByRole('button', { name: category, exact: true })).toHaveAttribute('aria-pressed', 'true');
  }
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('.gallery-card')).toHaveCount(18);
});

test('opens the viewer, navigates with controls and wraps at both ends', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Full lightbox navigation runs in the desktop project');
  await page.goto('/');
  await page.locator('.gallery-card').first().click();
  const viewer = page.getByRole('dialog');
  await expect(viewer).toHaveAttribute('aria-hidden', 'false');
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Next image' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close image viewer' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#lightbox-counter')).toHaveText('1 / 18');
  await expect(page.locator('#lightbox-title')).toHaveText('Where the mountains breathe');
  await page.getByRole('button', { name: 'Previous image' }).click();
  await expect(page.locator('#lightbox-counter')).toHaveText('18 / 18');
  await page.getByRole('button', { name: 'Next image' }).click();
  await expect(page.locator('#lightbox-counter')).toHaveText('1 / 18');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#lightbox-counter')).toHaveText('2 / 18');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#lightbox-counter')).toHaveText('1 / 18');
});

test('opens a gallery card with the Space key', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Keyboard activation check runs in desktop Chromium');
  await page.goto('/');
  const card = page.locator('.gallery-card').first();
  await card.focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#lightbox')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('#lightbox-title')).toHaveText('Where the mountains breathe');
});

test('lightbox navigation wraps within the selected category', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Filtered lightbox navigation runs in desktop Chromium');
  await page.goto('/');
  await page.getByRole('button', { name: 'Nature', exact: true }).click();
  await page.locator('.gallery-card').first().press('Enter');
  await expect(page.locator('#lightbox-counter')).toHaveText('1 / 5');
  await page.getByRole('button', { name: 'Previous image' }).click();
  await expect(page.locator('#lightbox-counter')).toHaveText('5 / 5');
  await page.getByRole('button', { name: 'Next image' }).click();
  await expect(page.locator('#lightbox-counter')).toHaveText('1 / 5');
  await expect(page.locator('#lightbox-category')).toHaveText('NATURE');
});

test('closes with Escape and backdrop click, restores focus and page scrolling', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Keyboard and focus behavior runs in the desktop project');
  await page.goto('/');
  const card = page.locator('.gallery-card').nth(2);
  await card.click();
  await expect(page.locator('body')).toHaveClass(/no-scroll/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#lightbox')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('body')).not.toHaveClass(/no-scroll/);
  await expect(card).toBeFocused();
  await card.click();
  await page.locator('#lightbox').click({ position: { x: 5, y: 5 } });
  await expect(page.locator('#lightbox')).toHaveAttribute('aria-hidden', 'true');
});

test('shows the image fallback when a remote photograph fails', async ({ page }) => {
  await page.route('https://images.unsplash.com/**', (route) => route.abort());
  await page.goto('/');
  await expect(page.locator('.gallery-card').first().locator('.image-fallback')).toHaveText('IMAGE UNAVAILABLE');
  await page.locator('.gallery-card').first().press('Enter');
  await expect(page.locator('#lightbox .image-fallback')).toHaveText('IMAGE UNAVAILABLE');
  await page.getByRole('button', { name: 'Next image' }).click();
  await expect(page.locator('#lightbox-counter')).toHaveText('2 / 18');
  await expect(page.locator('#lightbox .image-fallback')).toHaveText('IMAGE UNAVAILABLE');
});

test('mobile layout has no horizontal page overflow and touch navigation works', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile viewport check runs in the mobile project');
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.locator('.gallery-card').first().click();
  const image = page.locator('#lightbox-image');
  const box = await image.boundingBox();
  await page.touchscreen.tap(box.x + box.width * 0.8, box.y + box.height / 2);
  await page.evaluate(() => {
    const viewer = document.querySelector('#lightbox');
    viewer.dispatchEvent(new TouchEvent('touchstart', { changedTouches: [new Touch({ identifier: 1, target: viewer, clientX: 250, clientY: 400 })], bubbles: true }));
    viewer.dispatchEvent(new TouchEvent('touchend', { changedTouches: [new Touch({ identifier: 1, target: viewer, clientX: 100, clientY: 400 })], bubbles: true }));
  });
  await expect(page.locator('#lightbox-counter')).toHaveText('2 / 18');
});
