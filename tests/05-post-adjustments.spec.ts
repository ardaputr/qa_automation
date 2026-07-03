import { test, expect } from '@playwright/test';
import { AdjustComponentPage } from '../pages/AdjustComponentPage';

const employees = [
  'Budi Santoso',
  'Cahya Kamila',
  'Deni Pratama',
  'Eka Wardani',
  'Faisal Rahman'
];

test.describe('Manage Payroll - Post Adjustments', () => {

  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('https://hris.kantorku.id/');
    await page.getByRole('textbox', { name: 'Company Email' }).fill('bosavi1271@datoinf.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('n8t3A785EYfmjL@');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Verifikasi berhasil login
    await expect(page).toHaveURL(/.*home/); 
  });

  test('Should view and cancel adjustment for 5 employees', async ({ page }) => {
    // Gunakan Page Object yang sudah dipisah
    test.setTimeout(120000);
    const adjustComponentPage = new AdjustComponentPage(page);

    // Navigasi
    await adjustComponentPage.navigateToAdjustComponent();

    // Looping kelima data
    for (const employee of employees) {
      console.log(`Processing adjustment for: ${employee}`);
      await adjustComponentPage.viewAndCancelAdjustment(employee);
    }
  });
});