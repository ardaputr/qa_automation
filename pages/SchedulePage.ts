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
      console.log(`[INFO] Opsi '${data.scheduleType}' dikunci oleh sistem, langkah di-skip.`);
    }

    if (await holidayRadio.isEnabled()) {
      await holidayRadio.check();
    } else {
      console.log(`[INFO] Opsi '${data.holidayRule}' dikunci oleh sistem, langkah di-skip.`);
    }

    // 6. Default Shift
    if (data.isDefault) {
      await this.page.locator('label').filter({ hasText: 'Set this shift as default' }).click();
    }

    await this.page.getByRole('button', { name: 'Next' }).click();
    
  }
  // [FUNGSI 1]: Untuk WFO ("Yes")
  async assignEmployeesToShift(employeeNames: string[], locationName: string, days: string[]) {
    for (const name of employeeNames) {
      try {
        const notAddedTab = this.page.getByText('Employee Not Added', { exact: true }).first();
        await notAddedTab.waitFor({ state: 'visible', timeout: 5000 });
        await notAddedTab.click(); 
      } catch (e) {
        console.log(`[INFO] Tab sudah aktif, lanjut ke pencarian untuk: ${name}`);
      }
      
      await this.page.waitForTimeout(1000); 

      // Cari karyawan
    //   const searchBox = this.page.getByRole('textbox', { name: 'Search employee here' });
    //   await searchBox.click();
    //   await searchBox.clear(); 
    //   await searchBox.fill(name);
    //   await this.page.keyboard.press('Enter');

      const searchBox = this.page.getByRole('textbox', { name: 'Search employee here' });
      await searchBox.click();
      await searchBox.fill('');
      await this.page.waitForTimeout(500);
      await searchBox.fill(name); 
    //   await this.page.keyboard.press('Enter');
      
      await this.page.waitForTimeout(2000); 

      const employeeRow = this.page.getByRole('row').filter({ hasText: name });
      await employeeRow.waitFor({ state: 'visible', timeout: 15000 });

      // Klik Action Button di tabel
      await employeeRow.locator('.ant-table-cell-fix-right .group, .ant-table-cell-fix-right button, .ant-table-cell-fix-right').first().click();


      try {
        const dialog = this.page.getByRole('dialog');
        await expect(dialog.getByText('conflicting schedule')).toBeVisible({ timeout: 3000 });
        
        await dialog.locator('.ant-table-selection-column').first().click();
        const moveBtn = dialog.getByRole('button', { name: 'Move' }).first();
        if (await moveBtn.isVisible()) await moveBtn.click();
        const nextBtn = dialog.getByRole('button', { name: 'Next' });
        if (await nextBtn.isVisible()) await nextBtn.click();
        const saveBtn = dialog.getByRole('button', { name: 'Save' });
        if (await saveBtn.isVisible()) await saveBtn.click();
        
        await this.page.waitForTimeout(1000);
      } catch (e) {}

      // Pilih lokasi lalu langsung APPLY
      await this.page.getByRole('radio', { name: locationName }).click(); 
      await this.page.getByRole('button', { name: 'Apply' }).click();
      await this.page.waitForTimeout(2000); 
    }

    // Setelah semua karyawan di-looping, baru klik Next (ke step 3) lalu Save Changes
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('button', { name: 'Save Changes' }).click();
  }

  // [FUNGSI 2]: Untuk WFH/Flexible ("No")
  async assignEmployeesWithoutValidation(employeeNames: string[], locationName: string, days: string[]) {
    for (const name of employeeNames) {
      try {
        const notAddedTab = this.page.getByText('Employee Not Added', { exact: true }).first();
        await notAddedTab.waitFor({ state: 'visible', timeout: 5000 });
        await notAddedTab.click();
      } catch (e) {
        console.log(`[INFO] Tab sudah aktif, lanjut ke pencarian untuk: ${name}`);
      }
      
      await this.page.waitForTimeout(1000); 

      // Cari karyawan
      const searchBox = this.page.getByRole('textbox', { name: 'Search employee here' });
      await searchBox.click();
      await searchBox.clear(); 
      await searchBox.fill(name);
      await this.page.keyboard.press('Enter');
      
      await this.page.waitForTimeout(2000); 

      const employeeRow = this.page.getByRole('row').filter({ hasText: name });
      await employeeRow.waitFor({ state: 'visible', timeout: 15000 });

      // Klik Action Button di tabel
      await employeeRow.locator('.ant-table-cell-fix-right .group, .ant-table-cell-fix-right button, .ant-table-cell-fix-right').first().click();

      // Penanganan Cerdas Modal Bentrok Jadwal
      try {
        const dialog = this.page.getByRole('dialog');
        await expect(dialog.getByText('conflicting schedule')).toBeVisible({ timeout: 3000 });
        
        await dialog.locator('.ant-table-selection-column').first().click();
        const moveBtn = dialog.getByRole('button', { name: 'Move' }).first();
        if (await moveBtn.isVisible()) await moveBtn.click();
        const nextBtn = dialog.getByRole('button', { name: 'Next' });
        if (await nextBtn.isVisible()) await nextBtn.click();
        const saveBtn = dialog.getByRole('button', { name: 'Save' });
        if (await saveBtn.isVisible()) await saveBtn.click();
        
        await this.page.waitForTimeout(1000);
      } catch (e) {}
      
      await this.page.getByRole('radio', { name: locationName }).click();
      await this.page.getByRole('button', { name: 'Apply' }).click();
      
      await this.page.waitForTimeout(1500); 
    }

    await this.page.getByRole('button', { name: 'Save Changes' }).click();
  }
}