import { Page, Locator } from '@playwright/test';

export class RunPayrollPage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }

  async navigateToRunPayroll() {
    await this.page.getByRole('link', { name: 'Payroll & THR' }).click();
  }

  async setupAndRunPayroll(method: 'manual' | 'automatic-now' | 'automatic-later-publish' | 'automatic-later-dont-publish' = 'manual') {
    // 1. Setup Periode
    await this.page.getByText('Monthly').first().click();
    await this.page.getByText('Monthly').nth(2).click();
    
    // Pilih bulan Juli
    await this.page.locator('.ant-picker-input').first().click();
    await this.page.getByText('Jul', { exact: true }).click();
    await this.page.waitForTimeout(1000);

    // 2. Custom Selection
    await this.page.getByRole('combobox', { name: 'Recipient' }).click();
    await this.page.getByRole('button', { name: 'Custom Selection' }).click();
    
    // Search Branch
    await this.page.getByRole('textbox', { name: 'Search branch' }).fill('head');
    await this.page.waitForTimeout(500);
    await this.page.getByRole('checkbox', { name: 'Headquarter' }).check();
    
    // Search Department
    await this.page.getByRole('textbox', { name: 'Search department' }).fill('fina');
    await this.page.waitForTimeout(500);
    await this.page.getByRole('checkbox', { name: 'Financial' }).check();
    
    // Ceklis semua posisi & tipe
    await this.page.getByRole('checkbox', { name: 'All Position' }).check();
    await this.page.getByRole('checkbox', { name: 'All Employee Type' }).check();

    // Pilih employee spesifik
    await this.page.getByRole('button', { name: 'AD Automation Din 5 PPH21-' }).click();
    await this.page.getByRole('button', { name: 'AD Automation Din 6 PPH21-' }).click();
    await this.page.getByRole('button', { name: 'AT Automation Test 5 Auto-' }).click();
    await this.page.getByRole('button', { name: 'AT Automation Test 6 Auto-' }).click();

    // 3. Simpan dan Lanjutkan
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.waitForTimeout(1500); 
    
    // Klik Continue pertama
    await this.page.getByRole('button', { name: 'Continue' }).first().click();
    await this.page.waitForTimeout(1500); 

    // Penanganan Modal "Attendance Issues"
    const processButton = this.page.getByRole('button', { name: 'Process', exact: true });
    if (await processButton.isVisible()) {
        await processButton.click();
        await this.page.waitForTimeout(2000); 
    }

    // Klik Continue kedua
    const secondContinueButton = this.page.getByRole('button', { name: 'Continue' }).last();
    if (await secondContinueButton.isVisible()) {
        await secondContinueButton.click();
        await this.page.waitForTimeout(1500);
    }

    await this.page.waitForTimeout(2000); 
    await this.page.getByText('Payment Summary').waitFor({ state: 'visible' });

    // 4 & 5. Pilih Disbursement Method dan Opsinya
    if (method === 'manual') {
      await this.page.getByText('Manual').click(); 
      await this.page.waitForTimeout(500);
      
      const dateInput = this.page.getByPlaceholder('Choose Disbursement Date');
      await dateInput.click();
      await this.page.keyboard.type('03 Jul 2026');
      await this.page.keyboard.press('Enter');
      
    } else {
      // Jika salah satu dari varian 'automatic'
      await this.page.getByText('KantorKu Automatic Disbursement').click();
      await this.page.waitForTimeout(500);

      if (method === 'automatic-now') {
        await this.page.getByText('Now: Disburse immediately using the selected virtual account and date.').click();
        await this.page.waitForTimeout(500);

        const autoDateInput = this.page.getByPlaceholder('Choose Date');
        await autoDateInput.click();
        await this.page.keyboard.type('03 Jul 2026');
        await this.page.keyboard.press('Enter');

      } else if (method === 'automatic-later-publish') {
        await this.page.getByText('Disburse Later').click();
        await this.page.waitForTimeout(500);
        // Tambahkan exact: true agar tidak tertukar dengan teks lain
        await this.page.getByText('Publish', { exact: true }).click();

      } else if (method === 'automatic-later-dont-publish') {
        await this.page.getByText('Disburse Later').click();
        await this.page.waitForTimeout(500);
        await this.page.getByText("Don't publish automatically", { exact: true }).click();
      }
    }

    await this.page.waitForTimeout(1000); 

    // 6. Konfirmasi Akhir
    await this.page.getByRole('button', { name: 'Confirm' }).click();
    
    // 7. Penanganan Halaman Berikutnya
    if (method === 'manual' || method === 'automatic-now') {
      await this.page.waitForTimeout(3000); 
      await this.page.getByRole('button', { name: 'Go to payroll history' }).click();
      await this.page.waitForTimeout(1500);
    } else {

      await this.page.waitForTimeout(1000);
    }
  }
}