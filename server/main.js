// main.js

const { createProfileSession } = require("./src/managers/profileManager");
const { decideNextAction } = require("./src/managers/strategyManager");
const { checkAndLogin } = require("./src/core/auth");
const { getDynamicPersona } = require("./src/personas/userPersona");
require("dotenv").config();

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

async function main() {
  // === THAY ĐỔI DUY NHẤT Ở ĐÂY ===
  const profileId = "user_01"; // Sử dụng một tên profile cố định

  let browser;

  try {
    const persona = getDynamicPersona();

    const session = await createProfileSession(profileId);
    browser = session.browser;
    const page = session.page;

    await checkAndLogin(page, USERNAME, PASSWORD, persona);

    const strategy = decideNextAction();
    console.log(`🎯 Hành động được chọn: ${strategy.name}`);

    const keyword =
      strategy.keywords[Math.floor(Math.random() * strategy.keywords.length)];

    if (strategy.needsBrowser) {
      await strategy.action(page, keyword, browser, persona);
    } else {
      await strategy.action(page, keyword, persona);
    }

    console.log("🎉 Kịch bản chính đã hoàn thành nhiệm vụ!");
  } catch (error) {
    console.error(
      "❌ Đã xảy ra lỗi nghiêm trọng trong quá trình chính:",
      error
    );
  } finally {
    if (browser) {
      await browser.close();
      console.log("🔚 Trình duyệt đã được đóng.");
    }
  }
}

main();
