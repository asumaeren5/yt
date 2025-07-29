// src/utils/keywordProvider.js

const locations = ["Tây Ninh", "Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ"];
const randomLocation = locations[Math.floor(Math.random() * locations.length)];

const googleKeywords = [
  // Truy vấn thông tin hàng ngày
  `giá vàng hôm nay`,
  `tỷ giá đô la`,
  `lịch thi đấu bóng đá`,
  `kết quả xổ số`,
  `thời tiết ${randomLocation} ngày mai`,

  // Học tập & Công việc
  "cách viết CV xin việc ấn tượng",
  "hàm VLOOKUP trong excel",
  "tài liệu học Node.js cơ bản",
  "các thuật toán sắp xếp",
  "git command cheat sheet",

  // Giải trí & Đời sống
  "phim chiếu rạp tháng này",
  "quán cafe đẹp ở quận 1",
  "địa điểm du lịch gần sài gòn 2 ngày 1 đêm",
  "công thức nấu bò kho",
  "cách giảm cân hiệu quả",

  // Mua sắm & Dịch vụ
  "so sánh iPhone 16 và Samsung S25",
  "mã giảm giá shopee",
  "đặt vé xe đi Vũng Tàu",
  "khách sạn giá rẻ tại Đà Lạt",
];

const youtubeKeywords = [
  // Âm nhạc
  "nhạc lofi chill ",
  "top trending music youtube",
  "liên khúc nhạc trẻ mới nhất",
  "nhạc không lời piano",

  // Giải trí
  "video hài hước tiktok",
  "review phim marvel",
  "chương trình rap việt mùa 4",
  "mixigaming official",

  // Kiến thức & Đời sống
  "ted talk vietsub",
  "học tiếng anh giao tiếp cho người mới bắt đầu",
  "podcast về tài chính cá nhân",
  "hướng dẫn nấu ăn ngon",
  "khoa học vũ trụ",
];

function getGoogleKeywords() {
  return googleKeywords;
}

function getYoutubeKeywords() {
  return youtubeKeywords;
}

module.exports = {
  getGoogleKeywords,
  getYoutubeKeywords,
};
