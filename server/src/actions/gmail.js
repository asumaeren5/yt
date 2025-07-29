// src/actions/gmail.js

const {
  randomWait,
  randomScroll,
  idleMouseMove,
} = require("../core/humanizer");

async function performGmailActions(page) {
  console.log("--- Bắt đầu Module: Gmail ---");
  await page.goto("https://mail.google.com", { waitUntil: "networkidle2" });
  console.log("🌍 Đã vào Gmail.");
  await randomWait(3, 5);

  const emailRowSelector = 'div[role="main"] table[role="grid"] tr';

  try {
    await page.waitForSelector(emailRowSelector, { timeout: 20000 });
    const allEmails = await page.$$(emailRowSelector);

    if (allEmails.length > 0) {
      const emailsToReadCount = Math.min(allEmails.length, 2);
      for (let i = 0; i < emailsToReadCount; i++) {
        await (await page.$$(emailRowSelector))[i].click();

        const printButtonSelector = 'div[aria-label="Print all"]';
        await page.waitForSelector(printButtonSelector, { timeout: 15000 });

        console.log(`👀 Đang "đọc" email thứ ${i + 1}...`);
        await idleMouseMove(page); // Di chuột như đang đọc
        await randomScroll(page); // Cuộn để đọc hết mail
        await idleMouseMove(page);
        await randomWait(5, 10);

        console.log("◀️  Quay lại hộp thư đến...");
        await page.goBack({ waitUntil: "networkidle2" });
        await page.waitForSelector(emailRowSelector, { timeout: 15000 });
      }
    }
  } catch (e) {
    console.warn(`⚠️ Không thể tương tác với Gmail. Lỗi: ${e.message}`);
  }
  console.log("--- Hoàn thành Module: Gmail ---");
}

module.exports = { performGmailActions };
