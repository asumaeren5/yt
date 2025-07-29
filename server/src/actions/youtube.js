// src/actions/youtube.js

const {
  smartWait,
  humanLikeTyping,
  humanMoveAndClick,
  randomScroll,
  idleMouseMove,
} = require("../core/humanizer");

/**
 * Phiên bản nâng cao: Tìm kiếm, xem, và tương tác sâu với video trên YouTube.
 * @param {import('puppeteer').Page} page
 * @param {string} keyword
 * @param {import('puppeteer').Browser} browser
 * @param {object} persona
 */
async function performYouTubeWatch(page, keyword, browser, persona) {
  console.log("--- Bắt đầu Module: YouTube (Tương tác sâu) ---");

  await page.goto("https://www.youtube.com", { waitUntil: "networkidle2" });
  console.log("🌍 Đã vào YouTube.");

  // Xử lý bảng chấp thuận (nếu có)
  try {
    const acceptButtonSelector = '[aria-label="Accept all"]';
    await page.waitForSelector(acceptButtonSelector, {
      visible: true,
      timeout: 5000,
    });
    await page.click(acceptButtonSelector);
    await page.waitForNavigation({ waitUntil: "networkidle2" });
  } catch (error) {
    /* Bỏ qua */
  }

  // 1. Tìm kiếm video
  try {
    console.log(`🔎 Tìm kiếm video: "${keyword}"`);
    const searchIconButtonSelector = 'button[aria-label="Search"]';
    await humanMoveAndClick(page, searchIconButtonSelector, persona);

    const searchInputSelector = 'input[name="search_query"]';
    await page.waitForSelector(searchInputSelector, { visible: true });
    await humanLikeTyping(page, searchInputSelector, keyword, persona);
    await page.keyboard.press("Enter");

    await page.waitForSelector("ytd-video-renderer", { timeout: 20000 });
    console.log("👍 Đã tải trang kết quả tìm kiếm.");
  } catch (e) {
    console.warn(`⚠️ Lỗi khi tìm kiếm video: ${e.message}`);
    return; // Dừng nếu không tìm kiếm được
  }

  await smartWait("after_page_load", persona);

  // 2. Chọn và click vào video
  try {
    const videoSelector = "a#video-title";
    const videoResults = await page.$$(videoSelector);

    if (videoResults.length > 0) {
      const videoIndexToClick = Math.floor(
        Math.random() * Math.min(videoResults.length, 5)
      );
      console.log(`🖱️  Chọn xem video thứ ${videoIndexToClick + 1}...`);

      await humanMoveAndClick(page, videoResults[videoIndexToClick], persona);
      await page.waitForNavigation({ waitUntil: "networkidle2" });
      console.log("✅ Đã vào trang xem video.");

      // 3. (NÂNG CẤP) Tương tác trong lúc xem
      const watchTime = (Math.random() * 45 + 30) * 1000; // 30-75 giây
      console.log(`🎬 Đang "xem" video trong ${watchTime / 1000} giây...`);

      // Chờ một chút để video bắt đầu chạy
      await smartWait("after_page_load", persona);

      // 50% cơ hội sẽ "Thích" video
      if (Math.random() < 0.5) {
        // Selector cho nút Like chưa được nhấn
        const likeButtonSelector =
          'like-button-view-model button[aria-pressed="false"]';
        try {
          await humanMoveAndClick(page, likeButtonSelector, persona);
          console.log('👍 Đã "Thích" video.');
        } catch (e) {
          /* Bỏ qua nếu không tìm thấy nút like */
        }
      }

      const endTime = Date.now() + watchTime;
      while (Date.now() < endTime) {
        // Di chuột và cuộn trang như đang xem và đọc bình luận
        await idleMouseMove(page);
        await randomScroll(page, persona);

        // 20% cơ hội tạm dừng video rồi xem tiếp
        if (Math.random() < 0.2) {
          try {
            const videoPlayer = await page.$(".html5-main-video");
            if (videoPlayer) {
              await videoPlayer.click();
              console.log("⏸️  Tạm dừng video...");
              await smartWait("typing_word_pause", persona);
              await videoPlayer.click();
              console.log("▶️  Tiếp tục xem...");
            }
          } catch (e) {
            /* Bỏ qua */
          }
        }
        await smartWait("long_pause", persona);
      }
    } else {
      console.log("🟡 Không tìm thấy video nào.");
    }
  } catch (e) {
    console.warn(`⚠️ Lỗi khi xem video: ${e.message}`);
  }

  console.log("--- Hoàn thành Module: YouTube ---");
}

module.exports = { performYouTubeWatch };
