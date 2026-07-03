import { Page, Locator } from '@playwright/test';

export class AttendancePage {
  readonly page: Page;
  readonly scheduleMenu: Locator;
  readonly attendanceMenu: Locator;
  readonly searchInput: Locator;
  readonly absentLink: Locator;
  readonly remindButton: Locator;
  readonly pushNotificationOption: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Locators
    this.scheduleMenu = page.getByRole('link', { name: 'Schedule', exact: true });
    this.attendanceMenu = page.getByRole('link', { name: 'Attendance' });
    this.searchInput = page.getByRole('textbox', { name: 'Search employee here' });
    this.absentLink = page.getByRole('link', { name: 'Absent but hasn’t been' });
    this.remindButton = page.getByRole('button', { name: 'Remind' });
    this.pushNotificationOption = page.getByText('Via Push Notification');
  }

  async navigateToAttendance() {
    await this.scheduleMenu.click();
    await this.attendanceMenu.click();
  }

  async sendRemindNotification(employeeName: string) {
    // 1. Clear input & Cari nama employee
    await this.searchInput.clear(); 
    await this.searchInput.fill(employeeName);
    await this.page.waitForTimeout(1000); 

    // 2. Klik baris berdasarkan nama employee
    await this.page.locator('tr').filter({ hasText: employeeName }).click();

    // 3. Klik tombol Remind
    await this.remindButton.click();

    // 4. Pilih Via Push Notification
    await this.pushNotificationOption.click();

    // 5. Klik tombol Send
    await this.page.locator('svg.h-4.w-4').last().click();
    await this.page.waitForTimeout(1000); 
  }
}