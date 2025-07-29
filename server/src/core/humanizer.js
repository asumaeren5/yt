// src/core/humanizer.js
const { getRandomSentence } = require("../utils/dataProvider");

function logAction(type, msg) {
  const typeMap = {
    wait: "⏳",
    typing: "✍️",
    click: "🖱️",
    scroll: "↕️",
    nav: "🧭",
    info: "ℹ️",
    error: "❌",
  };
  console.log(`${typeMap[type] || "🎬"} [${type}] ${msg}`);
}

function randomWait(min, max) {
  const duration = parseFloat((Math.random() * (max - min) + min).toFixed(3));
  logAction("wait", `Chờ trong ${duration} giây...`);
  return new Promise((resolve) => setTimeout(resolve, duration * 1000));
}
async function smartWait(context, persona) {
  const delays = {
    after_page_load: { min: 1.5, max: 3 },
    before_major_click: { min: 1, max: 2.5 },
    after_scroll: { min: 1.2, max: 2 },
    typing_word_pause: { min: 0.3, max: 0.7 },
    long_pause: { min: 6, max: 12 }, // <-- Thêm pause dài
  };
  const delayConfig = delays[context] || { min: 1, max: 2 };

  // Áp dụng "tâm trạng" của persona để điều chỉnh delay
  const speedFactor = persona?.browseSpeed ? (1 / persona.browseSpeed) * 4 : 1;

  await randomWait(
    delayConfig.min * speedFactor,
    delayConfig.max * speedFactor
  );
}

async function simulateFocusBlur(page, selector) {
  logAction("info", `🤔 Do dự với element: ${selector}`);
  try {
    await page.focus(selector);
    await randomWait(0.8, 1.5);
    await page.evaluate(() => document.activeElement.blur()); // Bỏ focus
    await randomWait(0.5, 1);
  } catch (e) {
    /* Bỏ qua nếu lỗi */
  }
}

async function humanLikeTyping(page, selector, text, persona) {
  await page.click(selector);

  // (NÂNG CẤP) Bôi đen và xóa nội dung cũ trước khi gõ
  console.log("✍️  Xóa nội dung cũ (Ctrl+A -> Backspace)...");
  await page.keyboard.down("Control");
  await page.keyboard.press("a");
  await page.keyboard.up("Control");
  await page.keyboard.press("Backspace");
  await randomWait(0.2, 0.5); // Chờ một chút sau khi xóa

  const mistakeRate = persona ? persona.mistakeRate : 0.1;
  const { min: minDelay, max: maxDelay } = persona
    ? persona.typingDelay
    : { min: 0.05, max: 0.15 };

  // Bản đồ các ký tự tiếng Việt và ký tự gốc không dấu
  const mistakeChars = {
    á: "a",
    à: "a",
    ạ: "a",
    ã: "a",
    â: "a",
    ấ: "a",
    ầ: "a",
    ậ: "a",
    ẫ: "a",
    ă: "a",
    ắ: "a",
    ằ: "a",
    ặ: "a",
    ẵ: "a",
    é: "e",
    è: "e",
    ẹ: "e",
    ẽ: "e",
    ê: "e",
    ế: "e",
    ề: "e",
    ệ: "e",
    ễ: "e",
    í: "i",
    ì: "i",
    ị: "i",
    ĩ: "i",
    ó: "o",
    ò: "o",
    ọ: "o",
    õ: "o",
    ô: "o",
    ố: "o",
    ồ: "o",
    ộ: "o",
    ỗ: "o",
    ơ: "o",
    ớ: "o",
    ờ: "o",
    ợ: "o",
    ỡ: "o",
    ú: "u",
    ù: "u",
    ụ: "u",
    ũ: "u",
    ư: "u",
    ứ: "u",
    ừ: "u",
    ự: "u",
    ữ: "u",
    ý: "y",
    ỳ: "y",
    ỵ: "y",
    ỹ: "y",
    đ: "d",
  };

  if (Math.random() < 0.1) {
    console.log("✍️  [typing] Gõ lặp một cụm từ rồi xóa...");
    const phrase = text.substring(0, Math.floor(text.length * 0.4));
    await page.keyboard.type(phrase, { delay: 80 });
    await useKeyboardShortcut(page, "a");
    await page.keyboard.press("Backspace");
  }

  for (const char of text) {
    // Quyết định xem có mắc lỗi không
    if (Math.random() < mistakeRate) {
      // Nếu ký tự là tiếng Việt có dấu, 70% khả năng sẽ mắc lỗi "quên dấu"
      if (mistakeChars[char] && Math.random() < 0.7) {
        console.log("⌨️  Gõ thiếu dấu, xóa lại...");
        await page.keyboard.type(mistakeChars[char]); // Gõ ký tự không dấu
        await new Promise((r) =>
          setTimeout(r, (Math.random() * (0.4 - 0.2) + 0.2) * 1000)
        );
        await page.keyboard.press("Backspace");
      } else {
        // 30% còn lại hoặc các ký tự khác, mắc lỗi gõ nhầm phím ngẫu nhiên
        console.log("⌨️  Gõ nhầm phím, xóa lại...");
        const wrongChar = String.fromCharCode(
          97 + Math.floor(Math.random() * 26)
        );
        await page.keyboard.type(wrongChar);
        await new Promise((r) => setTimeout(r, 300 + Math.random() * 400)); // 300–700ms

        await page.keyboard.press("Backspace");
      }
    }

    // Gõ ký tự đúng
    await page.keyboard.type(char);
    await new Promise((r) =>
      setTimeout(r, (Math.random() * (maxDelay - minDelay) + minDelay) * 1000)
    );
  }
}

async function simulateTypingIntoInput(page, selector, text, persona) {
  await page.focus(selector);
  for (const char of text) {
    await page.keyboard.sendCharacter(char);
    const delay = persona?.typingDelay
      ? Math.random() * (persona.typingDelay.max - persona.typingDelay.min) +
        persona.typingDelay.min
      : Math.random() * (0.15 - 0.05) + 0.05;
    await new Promise((r) => setTimeout(r, delay * 1000));
  }
}

async function humanMoveAndClick(
  page,
  selectorOrElement,
  persona,
  retries = 1
) {
  try {
    let element;
    const targetName =
      typeof selectorOrElement === "string"
        ? selectorOrElement
        : "element đã chọn";

    // (NÂNG CẤP) Xử lý cả selector (string) và element handle (object)
    if (typeof selectorOrElement === "string") {
      await page.waitForSelector(selectorOrElement, {
        visible: true,
        timeout: 10000,
      });
      element = await page.$(selectorOrElement);
    } else {
      element = selectorOrElement; // Đây là một element handle đã được truyền vào
    }

    if (!element) throw new Error("Không thể tìm thấy element để click.");

    const box = await element.boundingBox();
    if (!box)
      throw new Error("Element không có kích thước hoặc không hiển thị.");

    // ... (Phần logic di chuột và click giữ nguyên)
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    for (let i = 0; i < 2; i++) {
      const offsetX = (Math.random() - 0.5) * box.width * 0.6;
      const offsetY = (Math.random() - 0.5) * box.height * 0.6;
      await page.mouse.move(centerX + offsetX, centerY + offsetY, {
        steps: Math.floor(Math.random() * 10) + 5,
      });
      await randomWait(0.1, 0.3);
    }
    await page.mouse.move(centerX, centerY, { steps: 10 });
    await randomWait(0.1, 0.3);
    await page.mouse.down();
    await randomWait(0.05, 0.12);
    await page.mouse.up();

    logAction("click", `Click tự nhiên vào: ${targetName}`);
  } catch (e) {
    const targetName =
      typeof selectorOrElement === "string"
        ? selectorOrElement
        : "element đã chọn";
    logAction("error", `Không click được vào ${targetName}.`);
    if (retries > 0) {
      logAction("info", `Thử lại lần cuối... (còn ${retries} lần)`);
      // Không reload khi thử lại với element handle, chỉ áp dụng cho selector string
      if (typeof selectorOrElement === "string") {
        await page.reload({ waitUntil: "networkidle2" });
        return humanMoveAndClick(page, selectorOrElement, persona, retries - 1);
      }
    }
    logAction("error", `Thử lại thất bại. Bỏ qua hành động.`);
    throw e;
  }
}

async function randomScroll(page, persona) {
  console.log("↕️  Cuộn trang ngẫu nhiên...");
  const scrollStyle = persona?.scrollStyle || "normal";
  const scrollCount = Math.floor(Math.random() * 4) + 2;

  for (let i = 0; i < scrollCount; i++) {
    let scrollAmount;
    if (scrollStyle === "fast_jerky") {
      scrollAmount = Math.random() * 1000 - 500; // Biên độ lớn
    } else {
      // slow_smooth
      scrollAmount = Math.random() * 400 - 200; // Biên độ nhỏ
    }
    await page.mouse.wheel({ deltaY: scrollAmount });
    await randomWait(0.5, 1.5);

    // Thêm hành vi cuộn ngược
    if (Math.random() < 0.2) {
      console.log("... cuộn ngược lại một chút");
      await page.mouse.wheel({ deltaY: -scrollAmount * 0.3 });
      await randomWait(0.5, 1);
    }
  }
}

async function performDistraction(browser, persona) {
  console.log("\n--- Bắt đầu hành vi Phân tâm ---");
  let newPage;
  try {
    newPage = await browser.newPage();
    const bias = persona?.distractionBias || ["search", "news"];
    const choice = bias[Math.floor(Math.random() * bias.length)];

    if (choice === "news") {
      try {
        await newPage.goto("https://vnexpress.net", {
          waitUntil: "domcontentloaded",
          timeout: 20000,
        });
        console.log("📰 Đọc báo từ VnExpress và click thử một tin...");
        await randomScroll(newPage, persona);

        const headlines = await newPage.$$("h3.title-news a");
        if (headlines.length > 0 && !newPage.isClosed()) {
          const link = headlines[Math.floor(Math.random() * headlines.length)];

          await Promise.allSettled([
            newPage.waitForNavigation({
              waitUntil: "domcontentloaded",
              timeout: 10000,
            }),
            link.click(),
          ]);

          if (!newPage.isClosed()) await randomScroll(newPage, persona);
        }

        if (!newPage.isClosed()) await randomWait(4, 7, persona);
      } catch (e) {
        console.warn(`⚠️ [news] Lỗi khi xử lý báo: ${e.message}`);
      }
    } else {
      try {
        await newPage.goto("https://www.google.com", {
          waitUntil: "networkidle2",
          timeout: 20000,
        });

        const query = getRandomSentence();
        console.log(`🤔 Bị phân tâm, tìm kiếm: "${query}"`);
        await humanLikeTyping(newPage, 'textarea[name="q"]', query, persona);

        await Promise.allSettled([
          newPage.waitForNavigation({
            waitUntil: "networkidle2",
            timeout: 10000,
          }),
          newPage.keyboard.press("Enter"),
        ]);

        if (!newPage.isClosed()) {
          await randomScroll(newPage, persona);
          await randomWait(5, 8, persona);
        }
      } catch (e) {
        console.warn(`⚠️ [search] Lỗi khi xử lý tìm kiếm: ${e.message}`);
      }
    }
  } catch (e) {
    console.warn(`⚠️ Lỗi khi phân tâm: ${e.message}`);
  } finally {
    console.log("🧭 Quay trở lại công việc chính sau khi phân tâm.");
    if (newPage && !newPage.isClosed()) {
      try {
        await newPage.close();
      } catch (closeErr) {
        console.warn(`⚠️ Lỗi khi đóng tab phân tâm: ${closeErr.message}`);
      }
    }
  }
}

async function simulateTabSwitching(browser) {
  console.log("📑 Mở tab khác và quay lại...");
  const tempPage = await browser.newPage();
  try {
    await tempPage.goto("https://vnexpress.net", {
      waitUntil: "domcontentloaded",
    });
    await randomWait(3, 6);
  } catch (e) {}
  await tempPage.close();
}

async function idleMouseMove(page) {
  const { width, height } = await page.viewport();
  const x = Math.floor(Math.random() * width);
  const y = Math.floor(Math.random() * height);
  await page.mouse.move(x, y, { steps: 15 });
  await randomWait(0.3, 0.6);
}

async function randomSelectText(page) {
  console.log("🖋️  Thử chọn văn bản mô phỏng...");
  await page.keyboard.down("Shift");
  const arrowCount = Math.floor(Math.random() * 5) + 3;
  for (let i = 0; i < arrowCount; i++) {
    await page.keyboard.press("ArrowLeft");
    await randomWait(0.05, 0.1);
  }
  await page.keyboard.up("Shift");
  await page.keyboard.down("Control");
  await page.keyboard.press("c");
  await page.keyboard.up("Control");
  await randomWait(0.3, 0.5);
}

async function hoverRandomly(page, selectors) {
  try {
    const randomSelector =
      selectors[Math.floor(Math.random() * selectors.length)];
    console.log(`🙄 Rê chuột qua ${randomSelector} nhưng không click...`);
    await page.waitForSelector(randomSelector, {
      visible: true,
      timeout: 5000,
    });
    await page.hover(randomSelector);
    await randomWait(1, 2.5);
  } catch (e) {}
}

async function simulateZoom(page) {
  console.log("🤏 Zoom nhỏ trang xem thử...");
  await page.keyboard.down("Control");
  await page.keyboard.press("Minus");
  await page.keyboard.up("Control");
  await randomWait(1, 2);
  console.log("👌 Zoom lại như cũ...");
  await page.keyboard.down("Control");
  await page.keyboard.press("Equal");
  await page.keyboard.up("Control");
}

async function useKeyboardShortcut(page, key, modifier = "Control") {
  console.log(`⌨️  Sử dụng phím tắt ${modifier} + ${key}...`);
  await page.keyboard.down(modifier);
  await page.keyboard.press(key);
  await page.keyboard.up(modifier);
}

async function simulateMemoryLapse(page, browser) {
  console.log("🧠 [memory_lapse] Hình như quên gì đó...");
  const pages = await browser.pages();
  if (pages.length > 1) {
    // Chuyển qua lại tab gần nhất
    await pages[pages.length - 2].bringToFront();
    await randomWait(1, 3);
    await page.bringToFront();
  }
}
async function clickByVisibleText(page, role, visibleText) {
  const elements = await page.$$(`li[role="${role}"]`);
  for (const el of elements) {
    const text = await el.evaluate((node) =>
      node.innerText.trim().toLowerCase()
    );
    if (text.includes(visibleText.toLowerCase())) {
      await el.hover();
      await el.click();
      return true;
    }
  }
  return false;
}
async function clickContextMenuItem(page, text) {
  const menuItems = await page.$$('div[role="menuitem"]');
  for (const item of menuItems) {
    const itemText = await item.evaluate((el) => el.innerText.trim());
    if (itemText.toLowerCase().includes(text.toLowerCase())) {
      await item.hover();
      await item.click();
      return true;
    }
  }
  return false;
}
module.exports = {
  randomWait,
  humanLikeTyping,
  simulateTypingIntoInput,
  humanMoveAndClick,
  randomScroll,
  performDistraction,
  simulateTabSwitching,
  idleMouseMove,
  randomSelectText,
  hoverRandomly,
  simulateZoom,
  useKeyboardShortcut,
  smartWait,
  simulateMemoryLapse,
  clickByVisibleText,
  clickContextMenuItem,
};
