import { test, expect } from '@playwright/test';
import { AttendancePage } from '../pages/AttendancePage';

const employees = [
  'Budi Santoso',
  'Cahya Kamila',
  'Deni Pratama',
  'Eka Wardani',
  'Faisal Rahman'
];

test.describe('Manage Attendance - Remind Absent Employees', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('https://hris.kantorku.id/');
    await page.getByRole('textbox', { name: 'Company Email' }).fill('bosavi1271@datoinf.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('n8t3A785EYfmjL@');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/.*home/); 
  });

  test('Should successfully remind 5 absent employees via push notification', async ({ page }) => {
    const attendancePage = new AttendancePage(page);

    // Navigasi ke halaman Attendance
    await attendancePage.navigateToAttendance();

    // Looping untuk setiap employee
    for (const employee of employees) {
      console.log(`Sending reminder to: ${employee}`);
      
      // Jalankan fungsi dari Page Object
      await attendancePage.sendRemindNotification(employee);

      // await expect(page.getByText('Reminder sent successfully')).toBeVisible();  
      // await page.reload(); 
    }
  });
});