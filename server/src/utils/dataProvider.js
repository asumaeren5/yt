// src/utils/dataProvider.js

const sentences = [
  "Hôm nay là một ngày đẹp trời tại Tây Ninh.",
  "Dự án automation này đang tiến triển rất tốt.",
  "Cần ghi chú lại một vài ý tưởng quan trọng.",
  "Danh sách những việc cần làm trong tuần tới.",
  "Báo cáo tiến độ công việc hàng ngày.",
  "Một vài suy nghĩ ngẫu nhiên trong lúc làm việc.",
  "Lên kế hoạch cho chuyến đi du lịch cuối tuần.",
  "Kiểm tra lại kết quả thử nghiệm lần cuối.",
  "Gửi báo giá cho khách hàng vào chiều nay.",
  "Họp nhóm vào lúc 10 giờ sáng mai.",
  "Nội dung trình bày trong buổi họp ban giám đốc.",
  "Tổng kết quý II và đề xuất cho quý III.",
  "Ghi nhận phản hồi từ người dùng về sản phẩm mới.",
  "Lập kế hoạch học tập cho tháng 8.",
  "Danh sách tài liệu cần đọc thêm.",
  "Ghi chú buổi phỏng vấn ứng viên backend.",
  "Tổng hợp câu hỏi thường gặp từ khách hàng.",
  "Dự thảo email trả lời khách hàng tiềm năng.",
  "Phân tích dữ liệu truy cập website tuần này.",
  "Bảng theo dõi tiến độ các team dự án.",
  "Chuẩn bị nội dung cho buổi training nội bộ.",
  "Tài liệu onboarding cho nhân viên mới.",
  "Ghi nhận các vấn đề phát sinh trong sprint.",
  "Danh sách các công cụ cần tích hợp vào hệ thống.",
  "Nhật ký công việc tự động hóa ngày hôm nay.",
  "Một số gợi ý cải thiện hiệu suất hệ thống.",
  "Lịch công tác tháng này của phòng kỹ thuật.",
  "Cập nhật checklist QA/Testing mới nhất.",
  "Danh sách đối tác chiến lược cần follow-up.",
  "Thông tin chi tiết về khóa học AI sắp tới.",
  "Checklist cho buổi triển khai sản phẩm mới.",
  "Thống kê lượng người dùng active hàng ngày.",
  "Các bước cần làm trước khi release sản phẩm.",
  "To-do list hôm nay: kiểm tra script, fix bug.",
  "Cấu trúc API mới cần được review kỹ.",
  "Một vài dòng suy ngẫm khi code lúc đêm khuya.",
  "Nội dung slide cho buổi báo cáo dự án.",
  "Tổng hợp feedback từ nhóm kinh doanh.",
  "Lịch nhắc gặp mặt khách hàng thứ Sáu tuần này.",
  "Tài liệu mô tả business logic hệ thống.",
  "Bảng kế hoạch marketing sản phẩm quý IV.",
  "Thông tin liên hệ cần lưu trữ gấp.",
  "So sánh hiệu năng giữa hai framework phổ biến.",
  "Nhật ký điều tra lỗi nghiêm trọng hôm qua.",
  "Bản nháp báo cáo tình hình nhân sự hiện tại.",
  "Lưu ý cần thiết khi deploy hệ thống.",
  "Chi tiết mô hình kiến trúc microservices.",
  "Ghi chú workshop công nghệ mới vừa tham dự.",
  "Lộ trình học tập DevOps trong 3 tháng.",
  "Ý tưởng MVP cho ứng dụng quản lý thói quen.",
];

const titles = [
  "Ghi chú nhanh",
  "Tài liệu quan trọng",
  "Bản nháp",
  "Kế hoạch công việc",
  "Ý tưởng mới",
  "Thông tin nội bộ",
  "Slide thuyết trình",
  "Tổng hợp báo cáo",
  "Lịch làm việc",
  "Danh sách công việc",
  "Báo cáo sản xuất",
  "Chi tiết kỹ thuật",
  "Checklist QA",
  "Nội dung training",
  "Suy nghĩ linh tinh",
  "Tài liệu nghiên cứu",
  "Ghi chú khách hàng",
  "Kịch bản test",
  "Sơ đồ luồng dữ liệu",
  "Tài liệu phân tích",
];

const sheetData = [
  "Doanh thu tháng",
  "Chi phí",
  "Lợi nhuận",
  "Khách hàng mới",
  "Tỷ lệ chuyển đổi",
  "Số lượng đơn hàng",
  "Chi phí quảng cáo",
  "Hiệu suất nhân viên",
  "Thời gian xử lý ticket",
  "Đánh giá khách hàng",
  "Bảng KPI tháng 7",
  "Bảng phân tích đối thủ",
  "Báo cáo marketing",
  "Biểu đồ tăng trưởng",
  "Phân tích ROI",
  "Thống kê user active",
  "Tỉ lệ giữ chân người dùng",
  "Hiệu quả chiến dịch email",
  "Chi phí nhân sự",
  "Ngân sách năm 2025",
];

// Trả về 1 câu ngẫu nhiên
function getRandomSentence() {
  return sentences[Math.floor(Math.random() * sentences.length)];
}

// Trả về 1 tiêu đề ngẫu nhiên (thêm prefix nếu cần)
function getRandomTitle(prefix = "Tài liệu") {
  return `${prefix} - ${titles[Math.floor(Math.random() * titles.length)]}`;
}

// Trả về 1 mục dữ liệu sheet ngẫu nhiên
function getRandomSheetData() {
  return sheetData[Math.floor(Math.random() * sheetData.length)];
}

module.exports = {
  getRandomSentence,
  getRandomTitle,
  getRandomSheetData,
};
