// src/personas/userPersona.js

const PERSONAS = [
  {
    name: "Sinh viên vội vàng",
    base: {
      mistakeRate: 0.15,
      distractionChance: 0.4,
    },
    moods: {
      lo_lang: {
        // Gõ nhanh hơn, sai nhiều hơn
        typingDelay: { min: 0.02, max: 0.07 },
        thinkingTime: { min: 0.3, max: 1.0 },
      },
      thu_thai: {
        // Gõ chậm hơn, chính xác hơn
        typingDelay: { min: 0.05, max: 0.1 },
        thinkingTime: { min: 0.8, max: 2.0 },
      },
    },
  },
  {
    name: "Nhân viên văn phòng cẩn thận",
    base: {
      mistakeRate: 0.03,
      distractionChance: 0.5,
    },
    moods: {
      tap_trung: {
        typingDelay: { min: 0.08, max: 0.15 },
        thinkingTime: { min: 2, max: 5 },
      },
      lo_dang: {
        typingDelay: { min: 0.1, max: 0.25 },
        thinkingTime: { min: 4, max: 10 },
      },
    },
  },
];

function getDynamicPersona() {
  const basePersona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
  const moodKeys = Object.keys(basePersona.moods);
  const randomMoodKey = moodKeys[Math.floor(Math.random() * moodKeys.length)];
  const mood = basePersona.moods[randomMoodKey];

  // Kết hợp thông số cơ bản và tâm trạng
  const finalPersona = { ...basePersona.base, ...mood };
  finalPersona.name = `${basePersona.name} (Tâm trạng: ${randomMoodKey})`;

  console.log(
    `👤 Bắt đầu phiên làm việc với tính cách động: "${finalPersona.name}"`
  );
  return finalPersona;
}

module.exports = { getDynamicPersona };
