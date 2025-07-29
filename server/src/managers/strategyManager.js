// src/managers/strategyManager.js

const { performGoogleSearch } = require("../actions/search");
const { performYouTubeWatch } = require("../actions/youtube");
const { performGmailActions } = require("../actions/gmail");
const { performDriveUpload } = require("../actions/drive");
const {
  getGoogleKeywords,
  getYoutubeKeywords,
} = require("../utils/keywordProvider"); // <-- IMPORT TỪ FILE MỚI

const STRATEGIES = [
  {
    name: "Tìm kiếm trên Google",
    action: performGoogleSearch,
    keywords: getGoogleKeywords(), // <-- LẤY TỪ KHÓA TỪ HÀM MỚI
  },
  // {
  //   name: "Xem video YouTube",
  //   action: performYouTubeWatch,
  //   keywords: getYoutubeKeywords(), // <-- LẤY TỪ KHÓA TỪ HÀM MỚI
  // },
  // {
  //   name: "Kiểm tra Gmail",
  //   action: performGmailActions,
  //   keywords: ["dummy_keyword"],
  // },
  // {
  //   name: "Làm việc trên Google Drive",
  //   action: performDriveUpload,
  //   keywords: ["dummy_keyword"],
  //   needsBrowser: true,
  // },
];

function decideNextAction() {
  console.log("🤖 Bộ não đang quyết định hành động...");
  const randomIndex = Math.floor(Math.random() * STRATEGIES.length);
  return STRATEGIES[randomIndex];
}

module.exports = { decideNextAction };
