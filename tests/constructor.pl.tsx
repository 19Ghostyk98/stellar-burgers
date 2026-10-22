import { test, expect } from '@playwright/test';

const MOCK_ACCESS_TOKEN = 'Bearer mock-access-token';
const MOCK_REFRESH_TOKEN = 'mock-refresh-token';

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: MOCK_ACCESS_TOKEN,
        domain: 'localhost',
        path: '/',
      },
    ]);
    await page.addInitScript((token) => {
      window.localStorage.setItem('refreshToken', token);
    }, MOCK_REFRESH_TOKEN);

    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
    });
    await page.routeFromHAR('tests/hars/order.har', {
      url: '**/api/orders',
      update: false,
    });
    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false,
    });

    await page.goto('/');
    await expect(page.getByText('Моковая булка').first()).toBeVisible();
  });

  test('добавление ингредиента из списка в конструктор', async ({ page }) => {
    const bunCard = page.locator('li', { hasText: 'Моковая булка' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-bun-1')).toContainText('Моковая булка');
    await expect(page.getByTestId('constructor-bun-2')).toContainText('Моковая булка');
  });

  test('открытие модального окна с описанием ингредиента', async ({ page }) => {
    await page.getByText('Моковая булка').first().click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Моковая булка');
    await expect(modal).toContainText('Калории, ккал');
  });

  test('закрытие модального окна по крестику', async ({ page }) => {
    await page.getByText('Моковая булка').first().click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(modal).not.toBeVisible();
  });

  test('закрытие модального окна по оверлею', async ({ page }) => {
    await page.getByText('Моковая булка').first().click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });
    await expect(modal).not.toBeVisible();
  });

  test('создание заказа с моковыми данными и очистка конструктора', async ({
    page,
  }) => {
    const bunCard = page.locator('li', { hasText: 'Моковая булка' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCard = page.locator('li', { hasText: 'Моковая котлета' });
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(page.getByTestId('order-number')).toContainText('12345');

    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(modal).not.toBeVisible();

    await expect(page.getByTestId('constructor-bun-1')).not.toBeVisible();
    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      'Выберите начинку'
    );
  });
});