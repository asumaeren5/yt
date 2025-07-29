
const path = require('path');
const fs = require('fs');
const { launchBrowser } = require('../core/puppeteer');

/**
 * Tạo một phiên làm việc (session) cho một profile cụ thể
 * @param {string} profileId - Tên định danh cho profile (ví dụ: 'user_01')
 * @returns {Promise<{browser: import('puppeteer').Browser, page: import('puppeteer').Page}>}
 */
async function createProfileSession(profileId) {
  // Tạo đường dẫn tuyệt đối đến thư mục profile
  const profilePath = path.resolve(__dirname, '..', '..', 'profiles', profileId);

  // Đảm bảo thư mục profile tồn tại
  if (!fs.existsSync(profilePath)) {
    console.log(`📂 Tạo thư mục profile mới tại: ${profilePath}`);
    fs.mkdirSync(profilePath, { recursive: true });
  }

  const browser = await launchBrowser(profilePath);
  const page = (await browser.pages())[0]; // Lấy tab đầu tiên có sẵn
  await page.setViewport({ width: 1280, height: 720 });

  console.log('✅ Phiên làm việc đã sẵn sàng!');
  return { browser, page };
}

module.exports = { createProfileSession };