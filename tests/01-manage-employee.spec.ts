import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { EmployeePage } from '../pages/EmployeePage';
import employeesData from '../data/employees.json';

test.setTimeout(120000);

test.describe('Skenario 1: Mengelola Karyawan (Data-Driven)', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.doLogin('bosavi1271@datoinf.com', 'n8t3A785EYfmjL@');
    await expect(page).not.toHaveURL(/login/);
  });

  for (const employee of employeesData) {
    test(`Menambahkan karyawan baru: ${employee.fullName}`, async ({ page }) => {
      const employeePage = new EmployeePage(page);

      // 1. Masuk ke halaman form Add Employee
      await employeePage.goToAddEmployeeForm();

      // 2. Isi data langkah 1 menggunakan data dari JSON 
      await employeePage.fillStep1(employee);

      // 3. Submit
      await employeePage.fillStep2();

      // 4. Verifikasi (Assertion) bahwa karyawan berhasil ditambah
      await expect(page.getByText(/success/i).first()).toBeVisible({ timeout: 15000 });
    });
  }

});