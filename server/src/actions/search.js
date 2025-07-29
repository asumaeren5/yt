const {
  randomWait,
  humanLikeTyping,
  randomScroll,
  smartWait,
  advancedScroll, // <-- Thêm import,
  performDistraction, // Import mới
  idleMouseMove, // Import mới
  hoverRandomly, // Import mới
  randomSelectTextV2,
  simulateTabSwitching,
} = require("../core/humanizer");

async function clickGoogleTab(page, tabText) {
  try {
    console.log(`🧭 Đang tìm tab: "${tabText}"...`);
    const tabXPath = `//div[@role="navigation"]//a[contains(., '${tabText}')]`;
    const [tabLink] = await page.$$("xpath/" + tabXPath);

    if (tabLink) {
      // **SỬA LỖI**: Kiểm tra xem tab có đang được chọn không (aria-selected="true")
      const isSelected = await tabLink.evaluate(
        (el) => el.getAttribute("aria-selected") === "true"
      );

      if (isSelected) {
        console.log(`...Đã ở sẵn trên tab "${tabText}", bỏ qua.`);
        return true;
      }

      console.log(`🖱️  Click vào tab "${tabText}".`);
      await tabLink.click();
      await page.waitForNavigation({
        waitUntil: "networkidle2",
        timeout: 20000,
      });
      return true;
    }

    console.warn(`⚠️ Không tìm thấy tab "${tabText}".`);
    return false;
  } catch (e) {
    console.error(`❌ Lỗi khi click tab "${tabText}": ${e.message}`);
    return false;
  }
}

async function performGoogleSearch(page, keyword, browser, persona) {
  console.log(
    "--- Bắt đầu Module: Google Search v9.4 (Chống Sập Trình Duyệt) ---"
  );

  // ... (Phần tìm kiếm ban đầu giữ nguyên)
  await page.goto("https://www.google.com", { waitUntil: "networkidle2" });
  await hoverRandomly(page, [
    '[aria-label="Tìm kiếm bằng giọng nói"]',
    '[aria-label="Tìm kiếm hình ảnh"]',
  ]);
  const searchInputSelector = 'textarea[name="q"]';
  await page.waitForSelector(searchInputSelector, { visible: true });
  await humanLikeTyping(page, searchInputSelector, keyword, persona);
  await page.keyboard.press("Enter");
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  console.log("👍 Đã tải trang kết quả tìm kiếm.");
  await smartWait("long_pause", persona);

  // === TẠO MỘT DANH SÁCH HÀNH VI NGẪU NHIÊN ===
  const optionalTasks = [];
  if (Math.random() < 0.7) optionalTasks.push("images");
  if (Math.random() < 0.6) optionalTasks.push("news");
  if (Math.random() < (persona.distractionChance || 0.4))
    optionalTasks.push("distraction");

  // Xáo trộn danh sách để thứ tự thực hiện luôn khác nhau
  optionalTasks.sort(() => Math.random() - 0.5);

  for (const task of optionalTasks) {
    if (task === "images") {
      if (await clickGoogleTab(page, "Hình ảnh")) {
        console.log("🖼️  Bắt đầu tương tác với kết quả hình ảnh...");
        await idleMouseMove(page);
        await randomScroll(page, persona);
        const imageResultsSelector = "div[data-docid]";
        await page.waitForSelector(imageResultsSelector, { timeout: 30000 });
        const imagesToView = Math.floor(Math.random() * 3) + 3;
        console.log(`🖼️  Sẽ xem ${imagesToView} hình ảnh...`);

        for (let i = 0; i < imagesToView; i++) {
          let newPage = null;
          try {
            const images = await page.$$(imageResultsSelector);
            if (i >= images.length) break;

            console.log(`[Ảnh ${i + 1}/${imagesToView}] Mở ảnh...`);
            await images[i].click();
            await randomWait(1, 2); // Chờ 1-2 giây cho khung xem trước tải

            const visitButtonXPath = `//a[contains(., "Truy cập")]`;
            // **SỬA LỖI**: Kiểm tra nhanh sự tồn tại của nút
            const [visitButton] = await page.$$("xpath/" + visitButtonXPath);

            if (visitButton) {
              // Nếu có nút, thực hiện logic cũ
              const url = await visitButton.evaluate((a) => a.href);
              if (!url) throw new Error("Không lấy được URL");

              console.log(`\t🔗 Mở link nguồn: ${url}`);
              newPage = await browser.newPage();
              await newPage.goto(url, {
                waitUntil: "domcontentloaded",
                timeout: 40000,
              });
              await advancedScroll(newPage);
              await newPage.close();
            } else {
              // Nếu không có nút, ghi nhận và bỏ qua
              console.log("\t...Ảnh này không có nút 'Truy cập', bỏ qua.");
              await randomWait(2, 4); // Giả vờ xem ảnh trong 2-4 giây
            }

            await page.keyboard.press("Escape");
            await randomWait(1, 2);
          } catch (err) {
            console.warn(`⚠️ Lỗi khi xem ảnh thứ ${i + 1}: ${err.message}`);
            if (newPage && !newPage.isClosed()) await newPage.close();

            // Cố gắng đóng khung xem trước nếu còn
            const [stuckVisitButton] = await page.$$(
              "xpath/" + `//a[contains(., "Truy cập")]`
            );
            const closeButtonXPath = `//button[@aria-label="Đóng"]`;
            const [stuckCloseButton] = await page.$$(
              "xpath/" + closeButtonXPath
            );
            if (stuckVisitButton || stuckCloseButton) {
              console.log("...Cố gắng đóng khung xem trước bị kẹt.");
              await page.keyboard.press("Escape");
            }
            await randomWait(1, 2);
          }
        }
      }
    } else if (task === "news") {
      if (await clickGoogleTab(page, "Tin tức")) {
        console.log("📰 Đang xem các kết quả tin tức...");
        await advancedScroll(page);
        const articles = await page.$$("a.WlydOe");
        if (articles.length > 0) {
          const articleLink =
            articles[Math.floor(Math.random() * articles.length)];
          const url = await articleLink.evaluate((a) => a.href);
          if (url) await readContentInNewTab(url, browser, persona);
        }
      }
    } else if (task === "distraction") {
      await performDistraction(browser, persona);
    }
  }

  // Quay lại tab "Tất cả" để tiếp tục logic cũ (nếu cần)
  await clickGoogleTab(page, "Tất cả");

  const resultsXPath = "//div[@id='search']//a[h3]";
  await page.waitForSelector("xpath/" + resultsXPath, { timeout: 20000 });
  const results = await page.$$("xpath/" + resultsXPath);

  if (results.length > 0) {
    const resultToRead =
      results[Math.floor(Math.random() * Math.min(results.length, 5))];
    const url = await resultToRead.evaluate((a) => a.href);
    if (url) {
      console.log(`📖 Quyết định đọc bài viết chính: ${url}`);
      await readContentInNewTab(url, browser, persona);
    }
  }

  console.log("--- Hoàn thành Module: Google Search ---");
}

async function readContentInNewTab(url, browser, persona) {
  let newPage = null;
  try {
    newPage = await browser.newPage();
    await newPage.goto(url, { waitUntil: "domcontentloaded", timeout: 40000 });
    console.log(`\t... Đang "đọc" nội dung từ: ${url}`);

    if (newPage.isClosed()) return;
    await advancedScroll(newPage);

    if (newPage.isClosed()) return;
    if (Math.random() < 0.4) await idleMouseMove(newPage);

    if (newPage.isClosed()) return;
    if (Math.random() < 0.3) await randomSelectTextV2(newPage);

    if (newPage.isClosed()) return;
    if (Math.random() < 0.25) await simulateTabSwitching(browser);

    if (newPage.isClosed()) return;
    await smartWait("long_pause", persona);

    if (!newPage.isClosed()) {
      await newPage.close();
    }
  } catch (e) {
    console.warn(`⚠️ Lỗi khi đọc nội dung từ tab mới: ${e.message}`);
    // **SỬA LỖI**: Kiểm tra loại lỗi. Nếu là lỗi kết nối, không làm gì cả.
    const errorMessage = e.message.toLowerCase();
    if (
      errorMessage.includes("connection closed") ||
      errorMessage.includes("detached frame")
    ) {
      console.log(
        "...Kết nối đến tab đã bị đóng bởi trang web. Bỏ qua và tiếp tục."
      );
      return; // Thoát khỏi hàm một cách an toàn
    }

    // Đối với các lỗi khác, vẫn cố gắng đóng tab
    if (newPage && !newPage.isClosed()) {
      await newPage.close();
    }
  }
}

module.exports = { performGoogleSearch };
