import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { EmployeePage } from '../pages/EmployeePage';
import employeesData from '../data/employees.json';

test.describe('Skenario 1: Mengelola Karyawan (Data-Driven)', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(); // Asumsi Anda menggunakan goto() di LoginPage
    await loginPage.doLogin('bosavi1271@datoinf.com', 'n8t3A785EYfmjL@'); // Asumsi menggunakan doLogin()
    await expect(page).not.toHaveURL(/login/);
  });

  for (const employee of employeesData) {
    test(`Menambahkan karyawan baru: ${employee.fullName}`, async ({ page }) => {
      const employeePage = new EmployeePage(page);

      // 1. Masuk ke halaman form Add Employee
      await employeePage.goToAddEmployeeForm();

      // 2. Isi data langkah 1 menggunakan data dari JSON 
      await employeePage.fillStep1(employee);

      // 3. Submit (Perhatikan: tidak ada argumen employee di dalam kurung)
      await employeePage.fillStep2();

      // 4. Verifikasi (Assertion) bahwa karyawan berhasil ditambah
      // Menunggu notifikasi muncul
      await expect(page.getByText(/success/i).first()).toBeVisible({ timeout: 15000 });
    });
  }

});