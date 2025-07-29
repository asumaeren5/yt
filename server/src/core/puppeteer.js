// src/core/puppeteer.js

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

async function launchBrowser(profilePath) {
  console.log(`🚀 Khởi chạy trình duyệt với profile: ${profilePath}`);

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--window-size=1280,720",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      // === TÙY CHỌN TỐI ƯU ĐỂ CHỐNG CRASH ===
      "--disable-features=IsolateOrigins,site-per-process",
    ],
    userDataDir: profilePath,
  });

  return browser;
}

module.exports = { launchBrowser };
