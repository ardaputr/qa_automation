import { Page, expect } from '@playwright/test';

export class EmployeePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goToAddEmployeeForm() {
    // Sesuai dengan awal rekaman manual Anda
    await this.page.getByText('Employee', { exact: true }).first().click();
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
    await this.page.getByRole('textbox', { name: 'Full Name' }).press('Tab'); // Persis manual
    
    await this.page.getByRole('textbox', { name: 'Employment ID' }).fill('');
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

    await this.page.locator('div').filter({ hasText: /^Choose test area 1 from the drop-down options$/ }).nth(4).click();
    await this.page.getByRole('option', { name: data.testArea1, exact: true }).click();

    await this.page.locator('div').filter({ hasText: /^Choose area test 1 from the drop-down options$/ }).nth(4).click();
    await this.page.getByRole('option', { name: data.areaTest1, exact: true }).click();

    await this.page.locator('div').filter({ hasText: /^Choose area test from the drop-down options$/ }).nth(4).click();
    await this.page.getByRole('option', { name: data.areaTest }).click();

    // ===============================
    // EMPLOYMENT TYPE & DATES
    // ===============================
    await this.page.getByRole('combobox', { name: 'Employment Type' }).click();
    await this.page.getByText(data.employmentType, { exact: true }).click();

    // Persis seperti manual: click -> fill -> press Enter
    await this.page.getByRole('textbox', { name: 'Start Date' }).click();
    await this.page.getByRole('textbox', { name: 'Start Date' }).fill(data.startDate);
    await this.page.getByRole('textbox', { name: 'Start Date' }).press('Enter');

    // End date khusus untuk non-Permanent
    if (data.employmentType.toLowerCase() !== 'permanent' && data.endDate) {
      await this.page.getByRole('textbox', { name: 'End Date' }).click();
      await this.page.getByRole('textbox', { name: 'End Date' }).fill(data.endDate);
      await this.page.getByRole('textbox', { name: 'End Date' }).press('Enter');
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

    // Persis manual menggunakan nth(1)
    await this.page.locator('#salaryBasis').click();
    await this.page.getByText(data.salaryBasis, { exact: true }).nth(1).click();

    // ===============================
    // ADDITIONAL BENEFITS
    // ===============================
    await this.page.locator('div').filter({ hasText: /^Additional Benefits \(optional\)e\.g\. Tunjangan Pulsa$/ }).nth(1).click();
    // Di manual Anda, rc_select_11 diklik setelah div wrapper-nya
    await this.page.locator('#rc_select_11').click(); 
    await this.page.getByRole('button', { name: data.benefitName }).click();

    await this.page.getByRole('spinbutton', { name: '0' }).click();
    await this.page.getByRole('spinbutton', { name: '0' }).fill(data.benefitAmount);
    await this.page.getByRole('button', { name: 'Save' }).click();

    // ===============================
    // TAXABILITY
    // ===============================
    await this.page.getByRole('combobox', { name: 'Taxability' }).click();
    await this.page.getByText(data.taxability).nth(1).click(); // Persis manual pakai nth(1)
  }

  async fillStep2() {
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }
}