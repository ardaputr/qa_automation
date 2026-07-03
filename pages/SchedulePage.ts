import { Page, expect } from '@playwright/test';

export class SchedulePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goToScheduleMenu() {
    await this.page.getByRole('link', { name: 'Schedule', exact: true }).click();
    await this.page.getByRole('link', { name: 'Add Schedule' }).click();
  }

  async fillShiftDetails(data: any) {
    // 1. Cabang & Nama Shift
    await this.page.locator('#shift-info_branch_id').click();
    await this.page.getByText(data.branch, { exact: true }).click();
    await this.page.getByTestId('input-nationality').fill(data.shiftName);

    // 2. Tanggal
    await this.page.getByRole('textbox', { name: 'Start Check In Date' }).click();
    await this.page.getByRole('table').getByText(data.startDate, { exact: true }).first().click();
    
    await this.page.getByRole('textbox', { name: 'End date' }).click();
    await this.page.getByRole('table').getByText(data.endDate, { exact: true }).last().click();

    // 3. Logika "Require Employee To..." (Validasi Absen)
    if (data.requireValidation) {
      await this.page.getByText('Yes, require employee to').click();
      for (const validation of data.validationTypes) {
        await this.page.locator('label').filter({ hasText: validation }).click();
      }
    } else {
      await this.page.getByText('No, count employee attendance').click();
    }

    // 4. Logika Tipe Lokasi Kerja
    await this.page.getByText(data.workLocationType, { exact: true }).click();

    if (data.workLocationType === 'WFO' || data.workLocationType === 'Multiple Locations') {
      await this.page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
      const locationInput = this.page.locator('#addLocation_locationAutoComplete');
      await locationInput.click();
      await locationInput.fill(data.locationSearch);
      await this.page.getByText(data.locationResult, { exact: true }).click();
      await this.page.getByRole('button', { name: 'Save' }).click();
    }

    // 5. Logika Tipe Jadwal & Libur
    const scheduleRadio = this.page.getByRole('radio', { name: data.scheduleType });
    const holidayRadio = this.page.getByRole('radio', { name: data.holidayRule });

    if (await scheduleRadio.isEnabled()) {
      await scheduleRadio.check();
    } else {
      console.log(`[INFO] Opsi '${data.scheduleType}' dikunci oleh sistem.`);
    }

    if (await holidayRadio.isEnabled()) {
      await holidayRadio.check();
    } else {
      console.log(`[INFO] Opsi '${data.holidayRule}' dikunci oleh sistem.`);
    }

    // 6. Default Shift
    if (data.isDefault) {
      await this.page.locator('label').filter({ hasText: 'Set this shift as default' }).click();
    }

    await this.page.getByRole('button', { name: 'Next' }).click();
  }

  // [BARU DIPERBAIKI]: Fungsi untuk WFO ("Yes") yang mendukung banyak hari
  async assignEmployeesToShift(employeeNames: string[], locationName: string, days: string[]) {
    for (const name of employeeNames) {
      const notAddedTab = this.page.getByRole('button', { name: 'Employee Not Added' });
      await notAddedTab.waitFor({ state: 'visible', timeout: 10000 });
      await notAddedTab.click(); 
      
      await this.page.waitForTimeout(1000); 

      const searchBox = this.page.getByRole('textbox', { name: 'Search employee here' });
      await searchBox.click();
      await searchBox.clear(); 
      await searchBox.fill(name);
      await this.page.keyboard.press('Enter');
      
      await this.page.waitForTimeout(2000); 

      const employeeRow = this.page.getByRole('row').filter({ hasText: name });
      await employeeRow.waitFor({ state: 'visible', timeout: 15000 });
      await employeeRow.locator('label.ant-checkbox-wrapper, .ant-checkbox').first().click();

      await this.page.getByRole('button', { name: 'Add To Shift' }).nth(1).click();

      // Pilih lokasi
      await this.page.getByRole('radio', { name: locationName }).click(); 
      
      // Looping untuk klik banyak hari
      for (const day of days) {
        await this.page.getByRole('checkbox', { name: day }).locator('..').click();
      }

      await this.page.getByRole('button', { name: 'Apply' }).click();

      // Move dan Save per orang
      await this.page.getByRole('row', { name: 'Select all' }).locator('.ant-checkbox-wrapper').first().click();
      await this.page.getByRole('button', { name: 'Move' }).first().click();
      await this.page.getByRole('button', { name: 'Save' }).click();

      await this.page.waitForTimeout(2000); 
    }

    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('button', { name: 'Save Changes' }).click();
  }

  // Fungsi khusus untuk WFH/Flexible ("No")
  async assignEmployeesWithoutValidation(employeeNames: string[], locationName: string, days: string[]) {
    for (const name of employeeNames) {
      const notAddedTab = this.page.getByRole('button', { name: 'Employee Not Added' });
      await notAddedTab.waitFor({ state: 'visible', timeout: 10000 });
      await notAddedTab.click();
      
      await this.page.waitForTimeout(1000); 

      const searchBox = this.page.getByRole('textbox', { name: 'Search employee here' });
      await searchBox.click();
      await searchBox.clear(); 
      await searchBox.fill(name);
      await this.page.keyboard.press('Enter');
      
      await this.page.waitForTimeout(2000); 

      const employeeRow = this.page.getByRole('row').filter({ hasText: name });
      await employeeRow.waitFor({ state: 'visible', timeout: 15000 });
      await employeeRow.locator('label.ant-checkbox-wrapper, .ant-checkbox').first().click();

      await employeeRow.locator('.ant-table-cell-fix-right .group, button').first().click();

      await this.page.getByRole('radio', { name: locationName }).click();

      for (const day of days) {
        await this.page.getByRole('checkbox', { name: day }).locator('..').click();
      }

      await this.page.getByRole('button', { name: 'Apply' }).click();
      await this.page.waitForTimeout(1500); 
    }

    await this.page.getByRole('button', { name: 'Save Changes' }).click();
  }
}