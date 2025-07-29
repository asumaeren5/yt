// src/actions/sheets.js

const {
  smartWait,
  humanLikeTyping,
  humanMoveAndClick,
  hoverRandomly,
  useKeyboardShortcut,
} = require("../core/humanizer");
const { getRandomSheetData, getRandomTitle } = require("../utils/dataProvider");

async function createAndEditSheet(browser, persona) {
  console.log("--- Bắt đầu Sub-Module: Google Sheets (Nâng cao) ---");
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  try {
    await page.goto("https://sheets.google.com/create", {
      waitUntil: "networkidle2",
    });
    await page.waitForSelector("div#t-formula-bar-input", { timeout: 20000 });

    await smartWait("after_page_load", persona);
    await hoverRandomly(page, ["#file-menu", "#edit-menu", "#view-menu"]);

    for (let i = 0; i < 3; i++) {
      const randomData = `${getRandomSheetData()}: ${Math.round(
        Math.random() * 1000
      )}`;
      await page.keyboard.type(randomData, {
        delay: persona.typingDelay.max * 1000,
      });
      await page.keyboard.press("ArrowDown");
      await smartWait("typing_word_pause", persona);
    }

    await page.keyboard.press("ArrowUp");
    await useKeyboardShortcut(page, "b");
    await smartWait("before_major_click", persona);

    const sheetTitle = getRandomTitle("Bảng tính");
    await humanMoveAndClick(page, "#docs-title-widget", persona);
    await humanLikeTyping(page, "input.docs-title-input", sheetTitle, persona);
    await page.keyboard.press("Enter");
  } catch (e) {
    console.warn(`⚠️ Không thể tạo Google Sheets. Lỗi: ${e.message}`);
  } finally {
    console.log("--- Hoàn thành Sub-Module: Google Sheets ---");
    await page.close();
  }
}

module.exports = { createAndEditSheet };
