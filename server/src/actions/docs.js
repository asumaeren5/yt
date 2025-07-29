// src/actions/docs.js

const {
  smartWait,
  humanLikeTyping,
  randomScroll,
  performDistraction,
  randomSelectText,
  hoverRandomly,
  useKeyboardShortcut,
} = require("../core/humanizer");
const { getRandomSentence, getRandomTitle } = require("../utils/dataProvider");

async function createAndEditDoc(browser, persona) {
  console.log("--- Bắt đầu Sub-Module: Google Docs (Nâng cao) ---");
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  try {
    await page.goto("https://docs.google.com/create", {
      waitUntil: "networkidle2",
    });
    const editorSelector = "div.kix-page-paginated";
    await page.waitForSelector(editorSelector, { timeout: 20000 });

    await smartWait("after_page_load", persona);
    await hoverRandomly(page, ["#File_menu", "#Edit_menu", "#View_menu"]);
    await page.click(editorSelector);

    await humanLikeTyping(page, editorSelector, getRandomSentence(), persona);

    if (Math.random() < 0.5) {
      await randomSelectText(page);
      await useKeyboardShortcut(page, "b");
      await page.keyboard.press("ArrowRight");
    }

    await page.keyboard.press("Enter");
    await smartWait("typing_word_pause", persona);

    await humanLikeTyping(
      page,
      editorSelector,
      " " + getRandomSentence(),
      persona
    );

    await randomScroll(page, persona);
    await useKeyboardShortcut(page, "s");
    await smartWait("before_major_click", persona);

    const docTitle = getRandomTitle("Ghi chú");
    await humanLikeTyping(page, "input.docs-title-input", docTitle, persona);
    await page.keyboard.press("Enter");

    if (Math.random() < (persona.distractionChance || 0.3)) {
      await performDistraction(browser, persona);
    }
  } catch (e) {
    console.warn(`⚠️ Không thể tạo Google Docs. Lỗi: ${e.message}`);
  } finally {
    console.log("--- Hoàn thành Sub-Module: Google Docs ---");
    await page.close();
  }
}

module.exports = { createAndEditDoc };
