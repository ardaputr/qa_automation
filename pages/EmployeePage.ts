import { Page, expect } from '@playwright/test';

export class EmployeePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goToAddEmployeeForm() {
    // Navigasi ke form tambah karyawan berdasarkan codegen
    await this.page.getByText('EmployeeEmployee').click();
    await this.page.getByTestId('btn-add-action').click();
    await this.page.getByTestId('btn-add-single').click();
    await expect(this.page.getByRole('textbox', { name: 'Full Name' })).toBeVisible();
  }

  async fillStep1(data: any) {
    // ===============================
    // BASIC INFORMATION
    // ===============================
    await this.page.getByRole('textbox', { name: 'Full Name' }).click();
    await this.page.getByRole('textbox', { name: 'Full Name' }).fill(data.fullName);
    await this.page.getByRole('textbox', { name: 'Full Name' }).press('Tab');

    await this.page.getByRole('textbox', { name: 'Employment ID' }).fill(data.employmentId);

    await this.page.getByRole('textbox', { name: 'Company Email' }).click();
    await this.page.getByRole('textbox', { name: 'Company Email' }).fill(data.companyEmail);

    // ===============================
    // DIRECT MANAGER & PHONE
    // ===============================
    await this.page.getByRole('combobox', { name: 'Direct Manager' }).click();
    await this.page.getByText(data.directManager, { exact: true }).click();

    await this.page.getByRole('spinbutton', { name: 'Mobile Phone (WhatsApp)' }).click();
    await this.page.getByRole('spinbutton', { name: 'Mobile Phone (WhatsApp)' }).fill(data.mobilePhone);

    // ===============================
    // SHIFT, BRANCH, DEPT, POSITION
    // ===============================
    await this.page.getByRole('combobox', { name: 'Shift' }).click();
    await this.page.getByRole('option', { name: data.shift, exact: true }).click();

    // Menggunakan locator persis dari codegen
    await this.page.locator('div').filter({ hasText: /^Choose branch from the drop-down options$/ }).nth(4).click();
    await this.page.getByRole('option', { name: data.branch }).click();

    await this.page.locator('div').filter({ hasText: /^Choose department from the drop-down options$/ }).nth(4).click();
    await this.page.getByRole('option', { name: data.department }).click();

    await this.page.locator('div').filter({ hasText: /^Choose position from the drop-down options$/ }).nth(4).click();
    await this.page.getByRole('option', { name: data.position }).click();

    // ===============================
    // TEST CUSTOM FIELDS
    // ===============================
    await this.page.locator('div').filter({ hasText: /^Choose testt title from the drop-down options$/ }).nth(4).click();
    await this.page.getByRole('option', { name: data.testTitle }).click();
    await this.page.waitForTimeout(300); // Jeda kecil agar dropdown stabil

    await this.page.locator('div').filter({ hasText: /^Choose test area 1 from the drop-down options$/ }).nth(4).click();
    await this.page.getByRole('option', { name: data.testArea1, exact: true }).click();
    await this.page.waitForTimeout(300);

    await this.page.locator('div').filter({ hasText: /^Choose area test 1 from the drop-down options$/ }).nth(4).click();
    await this.page.getByRole('option', { name: data.areaTest1, exact: true }).click();
    await this.page.waitForTimeout(300);

    await this.page.locator('div').filter({ hasText: /^Choose area test from the drop-down options$/ }).nth(4).click();
    await this.page.getByRole('option', { name: data.areaTest }).click();
    await this.page.waitForTimeout(300);

    // ===============================
    // EMPLOYMENT TYPE & DATES
    // ===============================
    await this.page.getByRole('combobox', { name: 'Employment Type' }).click();
    await this.page.getByText(data.employmentType, { exact: true }).click();

    await this.page.getByRole('textbox', { name: 'Start Date' }).click();
    await this.page.getByRole('textbox', { name: 'Start Date' }).fill(data.startDate);
    await this.page.getByRole('textbox', { name: 'Start Date' }).press('Enter');
    await this.page.waitForTimeout(300);

    // Logika pengisian End Date khusus untuk tipe non-Permanent
    if (data.employmentType.toLowerCase() !== 'permanent' && data.endDate) {
      await this.page.getByRole('textbox', { name: 'End Date' }).click();
      await this.page.getByRole('textbox', { name: 'End Date' }).fill(data.endDate);
      await this.page.getByRole('textbox', { name: 'End Date' }).press('Enter');
      await this.page.waitForTimeout(300);
    }

    // ===============================
    // PAYROLL & SALARY
    // ===============================
    await this.page.getByRole('combobox', { name: 'Employee Tax Status' }).click();
    await this.page.getByRole('option', { name: data.employeeTaxStatus }).click();

    await this.page.getByRole('combobox', { name: 'Payment Schedule' }).click();
    await this.page.getByRole('option', { name: data.paymentSchedule }).click();

    await this.page.getByRole('spinbutton', { name: 'Salary' }).click();
    await this.page.getByRole('spinbutton', { name: 'Salary' }).fill(data.salary);

    await this.page.locator('#salaryBasis').click();
    await this.page.getByText(data.salaryBasis, { exact: true }).nth(1).click();

    // ===============================
    // ADDITIONAL BENEFITS
    // ===============================
    await this.page.locator('div').filter({ hasText: /^Additional Benefits \(optional\)e\.g\. Tunjangan Pulsa$/ }).nth(1).click();
    await this.page.waitForTimeout(500); // Jeda agar animasi popup benefit terbuka
    await this.page.getByRole('button', { name: data.benefitName, exact: true }).click();

    // Menggunakan .last() untuk memastikan kolom input terfokus
    const benefitAmountInput = this.page.getByRole('spinbutton', { name: '0' }).last();
    await benefitAmountInput.click();
    await benefitAmountInput.fill(data.benefitAmount);
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.waitForTimeout(500); // Jeda animasi save

    // ===============================
    // TAXABILITY
    // ===============================
    await this.page.getByRole('combobox', { name: 'Taxability' }).click();
    await this.page.getByText(data.taxability, { exact: true }).nth(1).click();
  }

  async fillStep2() {
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }
}