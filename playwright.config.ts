import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Menunjuk ke folder tempat file skenario test berada
  testDir: './tests',
  
  // PENTING: Matikan mode paralel dan set workers ke 1. 
  // Ini memastikan file 01 jalan lebih dulu, baru 02, dan seterusnya secara berurutan.
  fullyParallel: false,
  workers: 1,
  
  // Gunakan reporter HTML bawaan Playwright
  reporter: 'html',

  use: {
    // Base URL agar di dalam file test kamu cukup menulis page.goto('/')
    baseURL: 'https://hris.kantorku.id',
    
    // PENTING: Pengaturan otomatis merekam video setiap test dijalankan
    video: 'on',
    
    // Otomatis mengambil screenshot jika ada test yang gagal (membantu debugging)
    screenshot: 'only-on-failure',
    
    // Set ke 'false' agar kamu bisa melihat browser terbuka dan bergerak saat test berjalan. 
    // Nanti bisa diubah ke 'true' jika ingin berjalan di belakang layar.
    headless: false, 
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
    // Kamu cukup menggunakan Chrome/Chromium untuk tugas ini agar lebih cepat
  ],
});