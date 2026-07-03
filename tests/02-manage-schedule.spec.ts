import { test, expect } from '@playwright/test';
import { SchedulePage } from '../pages/SchedulePage';
import { LoginPage } from '../pages/LoginPage';

test.setTimeout(120000);

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.doLogin('bosavi1271@datoinf.com', 'n8t3A785EYfmjL@');
  await expect(page).not.toHaveURL(/login/);
});

// TEST CASE 1: Jadwal WFO Super Ketat (Harus GPS & Foto)
test('Create WFO Schedule with strict validations', async ({ page }) => {
  const schedulePage = new SchedulePage(page);
  await schedulePage.goToScheduleMenu();

  const shiftWFO = {
    branch: 'Mie Ayam Maknyus',
    shiftName: 'Shift Reguler WFO',
    startDate: '1',
    endDate: '31',
    requireValidation: true,
    validationTypes: ['Employee must take a picture', 'GPS'], 
    workLocationType: 'WFO',
    locationSearch: 'Jakarta',
    locationResult: 'Jakarta International Expo',
    scheduleType: 'Fixed Schedule',
    holidayRule: 'Day Off',
    isDefault: true
  };

  await schedulePage.fillShiftDetails(shiftWFO);
  
  const wfoEmployees = ['Joko Widodo', 'Siti Aminah', 'Budi Santoso'];
  
  // [PERBAIKAN]: Buat array hari untuk WFO
  const workingDaysWFO = ['Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Masukkan array harinya ke parameter ketiga
  await schedulePage.assignEmployeesToShift(
    wfoEmployees, 
    'Jakarta International Expo', 
    workingDaysWFO
  );
  
  await expect(page.getByText('Saved successfully')).toBeVisible({ timeout: 15000 }); 
});

// TEST CASE 2: Jadwal WFH Santai (Tanpa Validasi)
test('Create WFH Schedule without validations', async ({ page }) => {
  const schedulePage = new SchedulePage(page);
  await schedulePage.goToScheduleMenu();

  const shiftWFH = {
    branch: 'Mie Ayam Maknyus',
    shiftName: 'Shift Flexible WFH',
    startDate: '1',
    endDate: '31',
    requireValidation: false, 
    validationTypes: [],
    workLocationType: 'WFH', 
    scheduleType: 'Flexible (count total working duration)',
    holidayRule: 'Day Off',
    isDefault: false
  };

  await schedulePage.fillShiftDetails(shiftWFH);
  
  const wfhEmployees = ['Andi Wijaya', 'Rina Melati'];
  const workingDaysWFH = ['Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  await schedulePage.assignEmployeesWithoutValidation(
    wfhEmployees, 
    'wfh', 
    workingDaysWFH
  );

  await expect(page.getByText('Saved successfully')).toBeVisible({ timeout: 15000 }); 
});