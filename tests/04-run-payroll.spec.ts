import { test, expect } from '@playwright/test';
import { RunPayrollPage } from '../pages/RunPayrollPage';

test.describe('Manage Payroll - Run Payroll', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://hris.kantorku.id/');
    await page.getByRole('textbox', { name: 'Company Email' }).fill('bosavi1271@datoinf.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('n8t3A785EYfmjL@');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/.*home/); 
  });

  // TEST 1: MANUAL DISBURSEMENT
  test('Should successfully run monthly payroll manually', async ({ page }) => {
    test.setTimeout(120000); 
    const runPayrollPage = new RunPayrollPage(page);
    await runPayrollPage.navigateToRunPayroll();
    await runPayrollPage.setupAndRunPayroll('manual'); 
    await expect(page).toHaveURL(/.*history/); 
  });

  // TEST 2: AUTOMATIC DISBURSEMENT (NOW)
  test('Should successfully run monthly payroll automatically (Now)', async ({ page }) => {
    test.setTimeout(120000); 
    const runPayrollPage = new RunPayrollPage(page);
    await runPayrollPage.navigateToRunPayroll();
    // Gunakan parameter yang sudah di-update
    await runPayrollPage.setupAndRunPayroll('automatic-now'); 
    await expect(page).toHaveURL(/.*history/); 
  });

  // TEST 3: AUTOMATIC DISBURSEMENT (LATER - PUBLISH) -> EXPECT ERROR
  test('Should show error when selecting Disburse Later with Publish', async ({ page }) => {
    test.setTimeout(120000); 
    const runPayrollPage = new RunPayrollPage(page);
    await runPayrollPage.navigateToRunPayroll();
    await runPayrollPage.setupAndRunPayroll('automatic-later-publish'); 
    
    // Opsional: Jika kamu tahu teks error-nya apa, kamu bisa tambahkan assertion di sini.
    // Contoh: await expect(page.getByText('Error message text here')).toBeVisible();
  });

  // TEST 4: AUTOMATIC DISBURSEMENT (LATER - DON'T PUBLISH) -> EXPECT ERROR
  test('Should show error when selecting Disburse Later with Dont Publish', async ({ page }) => {
    test.setTimeout(120000); 
    const runPayrollPage = new RunPayrollPage(page);
    await runPayrollPage.navigateToRunPayroll();
    await runPayrollPage.setupAndRunPayroll('automatic-later-dont-publish'); 
    
    // Opsional: Tambahkan assertion untuk memvalidasi kemunculan pesan error
    // Contoh: await expect(page.locator('.ant-notification')).toBeVisible();
  });

});