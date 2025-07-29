// src/actions/drive.js

const {
  randomWait,
  humanMoveAndClick,
  randomScroll,
  performDistraction,
  idleMouseMove,
  smartWait,
} = require("../core/humanizer");
const { createAndEditDoc } = require("./docs");
const { createAndEditSheet } = require("./sheets");
const fs = require("fs");
const path = require("path");
// (NÂNG CẤP) Hàm con nhận `persona`
async function findAndEditOldFile(page, browser, persona) {
  console.log("--- Bắt đầu Kịch bản con: Chỉnh sửa file cũ ---");
  try {
    const typeFilterSelector = 'div[aria-label="Loại"]';
    await humanMoveAndClick(page, typeFilterSelector, persona);
    await smartWait("after_major_click", persona);

    const isDoc = Math.random() < 0.5;

    // (SỬA LỖI) Chọn theo vị trí: Tài liệu (thứ 2), Trang tính (thứ 3)
    const fileTypeSelector = isDoc
      ? 'div[role="menuitemcheckbox"]:nth-child(2)'
      : 'div[role="menuitemcheckbox"]:nth-child(3)';

    const fileTypeName = isDoc ? "Google Docs" : "Google Sheets";
    console.log(
      `🔎 Lọc danh sách để tìm file ${fileTypeName} (theo vị trí)...`
    );

    const fileTypeButton = await page.waitForSelector(fileTypeSelector, {
      visible: true,
      timeout: 5000,
    });
    await fileTypeButton.click();
    await page.waitForNetworkIdle();

    const firstFileSelector = 'div[role="gridcell"]';
    await page.waitForSelector(firstFileSelector, {
      visible: true,
      timeout: 10000,
    });
    const firstFile = await page.$(firstFileSelector);

    if (firstFile) {
      console.log(`📂 Mở file ${fileTypeName} cũ để chỉnh sửa...`);

      // --- LOGIC XỬ LÝ TAB MỚI ---
      const pagesBeforeClick = (await browser.pages()).length;
      await firstFile.click({ clickCount: 2 });
      await randomWait(3, 5); // Chờ một chút để tab mới có thời gian mở ra
      const pagesAfterClick = await browser.pages();

      let editPage = page; // Mặc định là trang hiện tại
      let openedInNewTab = pagesAfterClick.length > pagesBeforeClick;

      if (openedInNewTab) {
        console.log("ℹ️  File được mở trong tab mới.");
        editPage = pagesAfterClick[pagesAfterClick.length - 1]; // Trang mới là trang cuối cùng
      } else {
        console.log("ℹ️  File được mở trên tab hiện tại.");
      }
      // --- KẾT THÚC LOGIC XỬ LÝ TAB ---

      if (isDoc) {
        await editPage.waitForSelector("div.kix-page-paginated", {
          timeout: 20000,
        });
        await editPage.click("div.kix-page-paginated");
        await editPage.keyboard.press("End");
        await editPage.keyboard.press("Enter");
        await editPage.keyboard.type(
          `\n(Cập nhật lúc ${new Date().toLocaleTimeString("vi-VN")})`,
          { delay: 50 }
        );
      } else {
        await editPage.waitForSelector("div#t-formula-bar-input", {
          timeout: 20000,
        });
        await editPage.keyboard.press("ArrowDown");
        await editPage.keyboard.type(
          `Cập nhật ${Math.round(Math.random() * 100)}`
        );
        await editPage.keyboard.press("Enter");
      }
      console.log("✍️  Đã thêm nội dung cập nhật.");
      await randomWait(5, 10, persona);

      // Xử lý sau khi chỉnh sửa
      if (openedInNewTab && !editPage.isClosed()) {
        await editPage.close(); // Nếu là tab mới thì đóng nó đi
      } else {
        await page.goBack({ waitUntil: "networkidle2" }); // Nếu là tab hiện tại thì quay lại
      }
    }
  } catch (e) {
    console.warn(`⚠️ Không thể chỉnh sửa file cũ. Lỗi: ${e.message}`);
    await page.goto("https://drive.google.com/drive/my-drive", {
      waitUntil: "networkidle2",
    });
  }
}

// (NÂNG CẤP) Hàm con nhận `persona`
async function findAndDownloadFile(page, persona) {
  console.log("--- Bắt đầu Kịch bản con: Tải xuống file ---");
  try {
    await idleMouseMove(page);
    const allFiles = await page.$$('div[role="gridcell"]');
    if (allFiles.length > 0) {
      const randomFile = allFiles[Math.floor(Math.random() * allFiles.length)];
      await randomFile.click({ button: "right" });
      await smartWait("before_major_click", persona);

      console.log('⬇️  Tìm và click vào nút "Tải xuống"...');
      await clickContextMenuItem(page, "tải xuống");

      console.log("✅ Đã bắt đầu tải xuống.");
      await smartWait("after_major_click", persona);
    }
  } catch (e) {
    console.warn(`⚠️ Không thể tải xuống file. Lỗi: ${e.message}`);
  }
}
/**
 * Phiên bản tổng hợp: Đa nhiệm, xử lý file trùng, dạo quanh, và quản lý promise an toàn.
 * @param {import('puppeteer').Page} page
 * @param {string} keyword - Không dùng trong module này
 * @param {import('puppeteer').Browser} browser
 * @param {object} persona - Đối tượng "tính cách" của bot
 */
async function performDriveUpload(page, keyword, browser, persona) {
  console.log("--- Bắt đầu Module: Google Drive (Logic cuối cùng) ---");

  const uploadDirectory = path.resolve(__dirname, "..", "..", "upload_files");
  const allFiles = fs.readdirSync(uploadDirectory);
  if (allFiles.length === 0) return;

  await page.goto("https://drive.google.com/drive/my-drive", {
    waitUntil: "networkidle2",
  });
  await smartWait("after_page_load", persona);

  try {
    const loopCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < loopCount; i++) {
      console.log(`\n--- Vòng lặp ${i + 1}/${loopCount} ---`);
      const randomFileToUpload =
        allFiles[Math.floor(Math.random() * allFiles.length)];

      await idleMouseMove(page);
      await humanMoveAndClick(
        page,
        'button[guidedhelpid="new_menu_button"]',
        persona
      );

      // (THAY ĐỔI QUAN TRỌNG) Bỏ bước waitForSelector menu, thay bằng chờ cố định
      console.log("ℹ️  Chờ menu xuất hiện...");
      await randomWait(1, 1.5);

      console.log("⌨️  Điều hướng menu bằng bàn phím...");
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser({ timeout: 15000 }),
        (async () => {
          await page.keyboard.press("ArrowDown");
          await randomWait(0.1, 0.3);
          await page.keyboard.press("Enter");
        })(),
      ]);
      const filePath = [path.join(uploadDirectory, randomFileToUpload)];
      await fileChooser.accept(filePath);
      console.log(`⬆️  Bắt đầu upload file: ${randomFileToUpload}...`);

      // Thực hiện tuần tự để chống lỗi race condition
      try {
        const confirmBtn = 'button[data-mdc-dialog-action="ok"]';
        await page.waitForSelector(confirmBtn, {
          visible: true,
          timeout: 7000,
        });
        await page.click(confirmBtn);
      } catch (e) {}

      if (Math.random() < (persona.distractionChance || 0.3)) {
        await performDistraction(browser, persona);
      } else {
        if (Math.random() < 0.5) await createAndEditDoc(browser, persona);
        else await createAndEditSheet(browser, persona);
      }

      const fileAppearedXPath = `//span[text()="${randomFileToUpload}"]`;
      await page.waitForSelector("xpath/" + fileAppearedXPath, {
        timeout: 60000,
      });
      console.log(`✅ File "${randomFileToUpload}" đã xuất hiện.`);

      await smartWait("long_pause", persona);

      const choice = Math.random();
      if (choice < 0.33) {
        await findAndEditOldFile(page, browser, persona);
      } else if (choice < 0.66) {
        await findAndDownloadFile(page, persona);
      } else {
        console.log("🚶‍♂️ Lần này chỉ dạo quanh sidebar...");
        const sidebarSelectors = [
          {
            name: "Được chia sẻ với tôi",
            selector: 'div[data-tree-id="Drive"]',
          },
          { name: "Thùng rác", selector: 'div[data-tree-id="DriveDocl"]' },
        ];
        const randomAction =
          sidebarSelectors[Math.floor(Math.random() * sidebarSelectors.length)];
        await humanMoveAndClick(page, randomAction.selector, persona);
        await page.waitForNetworkIdle({ timeout: 15000 });
        await randomScroll(page, persona);
        await humanMoveAndClick(page, 'div[data-tree-id="Dri"]', persona);
        await page.waitForNetworkIdle({ timeout: 15000 });
      }
    }
  } catch (e) {
    console.warn(`⚠️ Lỗi trong module Drive: ${e.message}`);
  }
  console.log("--- Hoàn thành Module: Google Drive ---");
}
module.exports = { performDriveUpload };
