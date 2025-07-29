const {
  randomWait,
  humanLikeTyping,
  randomScroll,
  idleMouseMove,
} = require("../core/humanizer");

async function performGoogleSearch(page, keyword, persona, browser) {
  console.log("--- Bắt đầu Module: Google Search v3.1 ---");

  // 1️⃣ Mở Google
  await page.goto("https://www.google.com", { waitUntil: "networkidle2" });
  await randomWait(1, 2, persona);

  const searchInputSelector = 'textarea[name="q"]';
  await page.waitForSelector(searchInputSelector, { visible: true });

  // 2️⃣ Giả lập gõ từ khóa
  await humanLikeTyping(page, searchInputSelector, keyword, persona);
  await page.keyboard.press("Enter");
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  console.log("👍 Đã tải trang kết quả tìm kiếm.");
  await idleMouseMove(page);

  // 3️⃣ Vòng lặp duyệt nhiều trang
  const MAX_PAGES = 2; // duyệt 2 trang đầu tiên
  for (let pageIndex = 1; pageIndex <= MAX_PAGES; pageIndex++) {
    console.log(`📄 --- Đang ở trang kết quả thứ ${pageIndex} ---`);

    await randomWait(2, 3, persona);
    await randomScroll(page, persona);

    // 3.1️⃣ Lấy danh sách kết quả
    const resultsSelector = "a > h3";
    const results = await page.$$(resultsSelector);
    if (results.length === 0) {
      console.log("⚠️ Không tìm thấy kết quả nào!");
      break;
    }

    // 3.2️⃣ Chọn ngẫu nhiên 1-2 bài viết để đọc
    const articlesToRead = Math.min(2, results.length);
    const indexes = Array.from({ length: results.length }, (_, i) => i);
    indexes.sort(() => Math.random() - 0.5); // shuffle

    for (let i = 0; i < articlesToRead; i++) {
      const idx = indexes[i];
      console.log(
        `📖 [${i + 1}/${articlesToRead}] Đọc kết quả thứ ${idx + 1}...`
      );

      try {
        const link = await page.evaluate(
          (el) => el.closest("a")?.href,
          results[idx]
        );
        if (!link) continue;

        // 4️⃣ Mở tab mới và đọc bài viết
        const newPage = await browser.newPage();
        await newPage.goto(link, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });

        await randomWait(1, 2, persona);
        await randomScroll(newPage, persona);
        await randomWait(1, 2, persona);

        // Đóng tab an toàn
        try {
          await newPage.close({ runBeforeUnload: true });
          await randomWait(0.5, 1.2, persona); // Delay để Chrome ổn định
        } catch (e) {
          console.log("⚠️ Lỗi khi đóng tab:", e.message);
        }
      } catch (err) {
        console.log("⚠️ Lỗi khi xử lý kết quả:", err.message);
      }
    }

    // 5️⃣ Chuyển sang trang tiếp theo nếu có
    try {
      const nextBtn = await page.$('a#pnnext, a[aria-label="Trang tiếp theo"]');
      if (nextBtn && pageIndex < MAX_PAGES) {
        await nextBtn.click();
        await page.waitForNavigation({
          waitUntil: "networkidle2",
          timeout: 20000,
        });
      } else {
        console.log("🟡 Không tìm thấy nút 'Trang tiếp theo'. Kết thúc.");
        break;
      }
    } catch (err) {
      console.log("⚠️ Không thể chuyển trang:", err.message);
      break;
    }
  }

  console.log("--- Hoàn thành Module: Google Search ---");
}

module.exports = { performGoogleSearch };
