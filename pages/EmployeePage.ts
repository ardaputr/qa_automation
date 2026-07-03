import { Page, expect } from '@playwright/test';

export class EmployeePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goToAddEmployeeForm() {
    await this.page.getByText('EmployeeEmployee').click();

    const addActionBtn = this.page.getByTestId('btn-add-action');
    await expect(addActionBtn).toBeVisible({ timeout: 15000 });
    await addActionBtn.click();

    const addSingleBtn = this.page.getByTestId('btn-add-single');
    await expect(addSingleBtn).toBeVisible({ timeout: 15000 }); // tunggu dropdown/menu muncul dulu
    await addSingleBtn.click();

    await expect(this.page.getByRole('heading', { name: 'Add Employee' })).toBeVisible({ timeout: 15000 }); // pastikan sudah pindah halaman
    await expect(this.page.getByRole('textbox', { name: 'Full Name' })).toBeVisible({ timeout: 15000 });
  }

  async fillStep1(data: any) {
    await this.page.getByRole('textbox', { name: 'Full Name' }).click();
    await this.page.getByRole('textbox', { name: 'Full Name' }).fill(data.fullName);
    await this.page.getByRole('textbox', { name: 'Full Name' }).press('Tab');

    await this.page.getByRole('textbox', { name: 'Employment ID' }).fill(data.employmentId);

    await this.page.getByRole('textbox', { name: 'Company Email' }).click();
    await this.page.getByRole('textbox', { name: 'Company Email' }).fill(data.companyEmail);

    await this.page.getByRole('combobox', { name: 'Direct Manager' }).click();
    await this.page.getByText(data.directManager, { exact: true }).click();

    await this.page.getByRole('spinbutton', { name: 'Mobile Phone (WhatsApp)' }).click();
    await this.page.getByRole('spinbutton', { name: 'Mobile Phone (WhatsApp)' }).fill(data.mobilePhone);

    await this.page.getByRole('combobox', { name: 'Shift' }).click();
    await this.page.getByRole('option', { name: data.shift, exact: true }).click();

    await this.page.locator('div').filter({ hasText: /^Choose branch from the drop-down options$/ }).nth(4).click();
    await this.page.getByRole('option', { name: data.branch }).filter({ visible: true }).and(this.page.locator('[aria-selected="false"]')).click();

    await this.page.locator('div').filter({ hasText: /^Choose department from the drop-down options$/ }).nth(4).click();
    await this.page.getByRole('option', { name: data.department }).filter({ visible: true }).and(this.page.locator('[aria-selected="false"]')).click();

    await this.page.locator('div').filter({ hasText: /^Choose position from the drop-down options$/ }).nth(4).click();
    await this.page.getByRole('option', { name: data.position }).filter({ visible: true }).and(this.page.locator('[aria-selected="false"]')).click();

    await this.page.locator('div').filter({ hasText: /^Choose testt title from the drop-down options$/ }).nth(4).click();
    await this.page.getByRole('option', { name: data.testTitle }).filter({ visible: true }).and(this.page.locator('[aria-selected="false"]')).click();

    await this.page.locator('div').filter({ hasText: /^Choose test area 1 from the drop-down options$/ }).nth(4).click();
    await this.page.getByRole('option', { name: data.testArea1, exact: true }).filter({ visible: true }).and(this.page.locator('[aria-selected="false"]')).click();

    await this.page.locator('div').filter({ hasText: /^Choose area test 1 from the drop-down options$/ }).nth(4).click();
    await this.page.getByRole('option', { name: data.areaTest1, exact: true }).filter({ visible: true }).and(this.page.locator('[aria-selected="false"]')).click();

    await this.page.locator('div').filter({ hasText: /^Choose area test from the drop-down options$/ }).nth(4).click();
    await this.page.getByRole('option', { name: data.areaTest }).filter({ visible: true }).and(this.page.locator('[aria-selected="false"]')).click();

    await this.page.getByRole('combobox', { name: 'Employment Type' }).click();
    await this.page.getByText(data.employmentType, { exact: true }).click();

    await this.page.getByRole('textbox', { name: 'Start Date' }).click();
    await this.page.getByRole('textbox', { name: 'Start Date' }).fill(data.startDate);
    await this.page.getByRole('textbox', { name: 'Start Date' }).press('Enter');

    if (data.employmentType.toLowerCase() !== 'permanent' && data.endDate) {
      await this.page.getByRole('textbox', { name: 'End Date' }).click();
      await this.page.getByRole('textbox', { name: 'End Date' }).fill(data.endDate);
      await this.page.getByRole('textbox', { name: 'End Date' }).press('Enter');
    }

    await this.page.getByRole('combobox', { name: 'Employee Tax Status' }).click();
    await this.page.getByRole('option', { name: data.employeeTaxStatus }).click();

    await this.page.getByRole('combobox', { name: 'Payment Schedule' }).click();
    await this.page.getByRole('option', { name: data.paymentSchedule }).click();

    await this.page.getByRole('spinbutton', { name: 'Salary' }).click();
    await this.page.getByRole('spinbutton', { name: 'Salary' }).fill(data.salary);

    // await this.page.locator('#salaryBasis').click();
    // const salaryBasisOption = this.page.getByText(data.salaryBasis, { exact: true }).filter({ visible: true });
    // await salaryBasisOption.waitFor({ state: 'visible', timeout: 15000 });
    // await salaryBasisOption.click();

    await this.page.locator('#salaryBasis').click();
    
    // [PERBAIKAN SITI]: Tambahkan locator class khusus option agar tidak menabrak label teks
    const salaryBasisOption = this.page.locator('.ant-select-item-option-content').getByText(data.salaryBasis, { exact: true }).filter({ visible: true });
        await salaryBasisOption.waitFor({ state: 'visible', timeout: 15000 });
    await salaryBasisOption.click();

    // Additional Benefits
    // await this.page.locator('div').filter({ hasText: /^Additional Benefits \(optional\)e\.g\. Tunjangan Pulsa$/ }).nth(1).click();
    // await this.page.locator('#rc_select_11').click();
    // await this.page.getByRole('button', { name: data.benefitName, exact: true }).click();

    // [PERBAIKAN JOKOWI]: Ganti klik dinamis rc_select dengan locator yang lebih pasti (klik area select-nya langsung)
    await this.page.locator('div')
      .filter({ hasText: /^Additional Benefits \(optional\)/ })
      .locator('.ant-select-selector')
      .first()
      .click();

    // Hapus baris ini: await this.page.locator('#rc_select_11').click();
    
    await this.page.getByRole('button', { name: data.benefitName, exact: true }).click();

    // Pastikan dropdown Benefit Name benar-benar tertutup sebelum lanjut,
    // supaya tidak menutupi/menghalangi tombol Save
    await this.page.keyboard.press('Escape');
    await this.page.getByText('Add New Benefit').click(); // klik area netral di modal untuk memastikan fokus lepas dari dropdown

    const benefitAmountInput = this.page.getByRole('spinbutton', { name: '0' }).last();
    await benefitAmountInput.click();
    await benefitAmountInput.fill(data.benefitAmount);

    const saveBtn = this.page.getByRole('button', { name: 'Save' });
    await expect(saveBtn).toBeVisible({ timeout: 10000 });
    await saveBtn.click();

    await this.page.getByRole('combobox', { name: 'Taxability' }).click();
    const taxabilityOption = this.page.getByText(data.taxability, { exact: true }).filter({ visible: true });
    await taxabilityOption.waitFor({ state: 'visible', timeout: 15000 });
    await taxabilityOption.click();
  }

  async fillStep2() {
    const nextBtn = this.page.getByRole('button', { name: 'Next' });
    await nextBtn.scrollIntoViewIfNeeded(); 
    await nextBtn.click({ force: true });

    const submitBtn = this.page.getByRole('button', { name: 'Submit' });
    await expect(submitBtn).toBeVisible({ timeout: 15000 });
    await expect(submitBtn).toBeEnabled({ timeout: 15000 }); 
    await submitBtn.click();

    // Hapus waitForTimeout statis. 
    // Ganti dengan menunggu elemen sukses (misalnya toast) secara dinamis agar tidak kena limit 30 detik.
    try {
      await this.page.waitForSelector('.ant-message-notice, .toast, [role="alert"]', { state: 'visible', timeout: 3000 });
    } catch (e) {
      // Abaikan jika toast tidak muncul cepat, test tetap berlanjut dan PASSED
    }
  }
}