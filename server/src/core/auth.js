// src/core/auth.js

const { humanLikeTyping } = require("./humanizer");

async function checkAndLogin(page, username, password, persona) {
  console.log("--- Bắt đầu Module: Xác thực ---");
  await page.goto("https://accounts.google.com/", {
    waitUntil: "networkidle2",
  });

  const emailInputSelector = 'input[type="email"]';
  const emailInputElement = await page.$(emailInputSelector);

  if (emailInputElement) {
    console.log(
      "🟡 Trạng thái: Chưa đăng nhập. Bắt đầu quá trình đăng nhập..."
    );

    // (NÂNG CẤP) Truyền `persona` để điều khiển tốc độ gõ và lỗi
    await humanLikeTyping(page, emailInputSelector, username, persona);
    await page.keyboard.press("Enter");

    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 });

    const passwordInputSelector = 'input[type="password"]';
    await page.waitForSelector(passwordInputSelector, {
      visible: true,
      timeout: 15000,
    });

    // (NÂNG CẤP) Truyền `persona`
    await humanLikeTyping(page, passwordInputSelector, password, persona);
    await page.keyboard.press("Enter");

    console.log("⏳ Đang chờ xác thực...");
    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 });
    console.log("✅ Đăng nhập thành công!");
  } else {
    console.log("✅ Trạng thái: Đã đăng nhập. Bỏ qua bước đăng nhập.");
  }

  console.log("--- Hoàn thành Module: Xác thực ---");
}

module.exports = { checkAndLogin };
