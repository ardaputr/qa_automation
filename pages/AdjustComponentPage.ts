import { Page, Locator } from '@playwright/test';

export class AdjustComponentPage {
  readonly page: Page;
  readonly payrollMenu: Locator;
  readonly adjustComponentMenu: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Locators
    this.payrollMenu = page.getByRole('link', { name: 'Payroll & THR' });
    this.adjustComponentMenu = page.getByRole('link', { name: 'Adjust Component' });
    this.searchInput = page.getByRole('textbox', { name: 'Search payroll component' });
  }

  async navigateToAdjustComponent() {
    await this.payrollMenu.click();
    await this.adjustComponentMenu.click();
  }

  async viewAndCancelAdjustment(employeeName: string) {
    // 1. Cari employee
    await this.searchInput.clear();
    await this.searchInput.fill(employeeName);
    await this.page.waitForTimeout(1500); 

    // 2. Klik Action pada baris spesifik employee
    const row = this.page.locator('tr').filter({ hasText: employeeName }).first();
    await row.getByRole('button', { name: 'Action' }).click();

    await this.page.waitForTimeout(500); 

    // 3. Masuk ke Adjustment Detail
    await this.page.getByRole('link', { name: 'See Adjustment Detail' }).click();
    await this.page.waitForTimeout(1000);

    // 4. Lihat Detail & Selesai
    await this.page.getByRole('button', { name: 'See Detail' }).click();
    await this.page.waitForTimeout(1000); 
    await this.page.getByRole('button', { name: 'Done' }).click();
    await this.page.waitForTimeout(1000); 

    // 5. Proses Cancel Adjustment
    await this.page.getByRole('button', { name: 'Action' }).click(); 
    await this.page.waitForTimeout(500);
    await this.page.getByRole('button', { name: 'Cancel Adjustment' }).click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('button', { name: 'Yes' }).click();

    // 6. Handle kondisi error (misal UNPROCESSABLE_ENTITY)
    await this.page.waitForTimeout(500);
    const noButton = this.page.getByRole('button', { name: 'No', exact: true });
    if (await noButton.isVisible()) {
      await noButton.click();
    }

    // 7. Kembali ke halaman list awal untuk loop berikutnya
    await this.page.getByRole('link', { name: 'Adjust Payroll Component' }).click();
    await this.page.waitForTimeout(1500);
  }
}