import type { InkUnit } from "./types";

/**
 * Ink-board treatment of Cambridge Tamil Unit 4 (முளைப்பாரி - a folk
 * harvest ritual song), real content from the unit's own DB Concept row
 * (4.1 only - this unit has a single concept). Added 2026-10-25, same
 * pairing established in cambridge-4-tamil-1.ts. Describes the folk
 * practice in original, summarized wording (as the DB content already
 * does) rather than any verbatim song verse.
 */
export const CAMBRIDGE_4_TAMIL_4_INK: InkUnit = {
  unitKey: "cambridge-4-tamil-4",
  title: "முளைப்பாரி (Mulaippari - Folk Song)",
  badge: "Stage 4 · இயல் 4",
  languageCode: "ta-IN",

  topics: [
    {
      topicId: "4.1",
      title: "நாட்டுப்புறப் பாடல்",
      scenes: [
        {
          label: "1. முளைப்பாரி என்றால் என்ன?",
          say: "முளைப்பாரி என்பது நவதானியங்களை முளைக்க வைத்து நிறைக்கப்பட்ட சிறு மண்பாண்டம். இது விளைச்சல் பெருகுதலை உணர்த்தப் பாடப்படும் ஒரு நாட்டுப்புறப் பாடல். ஒரு செவ்வாய்க்கிழமை அன்று இந்த வழக்கம் தொடங்கப்படுகிறது.",
          ops: [
            { type: "text", value: "முளைப்பாரி என்றால் என்ன? 🌱", x: 80, y: 60, color: "#df4da8", size: 30 },
            { type: "box", x: 80, y: 140, w: 1100, h: 130, color: "#188e69", label: "நவதானியங்களை முளைக்க வைத்து நிறைக்கப்பட்ட மண்பாண்டம்", labelSize: 26 },
            { type: "text", value: "நல்ல விளைச்சல்/செழிப்பு உண்டாகுதலை உணர்த்த பாடப்படும் பாடல்", x: 80, y: 310, color: "#39247f", size: 24 },
            { type: "text", value: "ஒரு செவ்வாய்க்கிழமை அன்று தொடங்கப்படுகிறது", x: 80, y: 370, color: "#64748b", size: 22 },
          ],
        },
        {
          label: "2. நவதானியங்கள் - 9 வகைகள்",
          say: "முளைப்பாரிக்குப் பயன்படும் நவதானியங்கள் ஒன்பது வகைகள். நெல், கோதுமை, பச்சைப்பயிறு, துவரை, மொச்சை, எள், கொள்ளு, உளுந்து, கொண்டைக்கடலை ஆகியவை நவதானியங்கள்.",
          ops: [
            { type: "text", value: "நவதானியங்கள் - 9 வகைகள்", x: 80, y: 50, color: "#df4da8", size: 28 },
            { type: "text", value: "நெல்", x: 100, y: 130, color: "#188e69", size: 24 },
            { type: "text", value: "கோதுமை", x: 330, y: 130, color: "#188e69", size: 24 },
            { type: "text", value: "பச்சைப்பயிறு", x: 600, y: 130, color: "#188e69", size: 24 },
            { type: "text", value: "துவரை", x: 100, y: 190, color: "#188e69", size: 24 },
            { type: "text", value: "மொச்சை", x: 330, y: 190, color: "#188e69", size: 24 },
            { type: "text", value: "எள்", x: 600, y: 190, color: "#188e69", size: 24 },
            { type: "text", value: "கொள்ளு", x: 100, y: 250, color: "#188e69", size: 24 },
            { type: "text", value: "உளுந்து", x: 330, y: 250, color: "#188e69", size: 24 },
            { type: "text", value: "கொண்டைக்கடலை", x: 600, y: 250, color: "#188e69", size: 24 },
            { type: "text", value: "அன்றாட வழக்குச் சொற்கள் (வந்து, செவ்வாய், வாங்கி, முறித்து)", x: 80, y: 350, color: "#64748b", size: 20 },
            { type: "text", value: "எழுத்து வழக்குச் சொற்களிலிருந்து வேறுபடும்", x: 80, y: 385, color: "#64748b", size: 20 },
          ],
        },
        {
          label: "3. 💡 9 தானியங்களை நினைவில் வைக்க",
          say: "9 தானியங்களையும் ஒன்றன்பின் ஒன்றாக மனப்பாடம் செய்வதை விட, இரண்டு குழுவாகப் பிரித்துப் பாருங்கள். முதல் குழு, தானியங்கள் - நெல், கோதுமை. இரண்டாம் குழு, பயறு வகைகள் - பச்சைப்பயிறு, துவரை, மொச்சை, எள், கொள்ளு, உளுந்து, கொண்டைக்கடலை. இரண்டு தானியங்கள் மட்டும் தனியாக நினைவில் வைத்தால், மீதமுள்ள ஏழும் பயறு வகைகள் என எளிதாக ஞாபகம் வரும்.",
          ops: [
            { type: "text", value: "💡 உத்தி: 2 குழுவாகப் பிரி!", x: 80, y: 50, color: "#b8860b", size: 28 },
            { type: "box", x: 80, y: 120, w: 450, h: 110, color: "#b8860b", label: "தானியங்கள் (2)", labelSize: 28 },
            { type: "text", value: "நெல், கோதுமை", x: 110, y: 260, color: "#39247f", size: 24 },
            { type: "box", x: 580, y: 120, w: 550, h: 110, color: "#b8860b", label: "பயறு வகைகள் (7)", labelSize: 28 },
            { type: "text", value: "பச்சைப்பயிறு, துவரை, மொச்சை,", x: 610, y: 260, color: "#39247f", size: 20 },
            { type: "text", value: "எள், கொள்ளு, உளுந்து, கொண்டைக்கடலை", x: 610, y: 295, color: "#39247f", size: 20 },
            { type: "text", value: "2 தானியம் நினைவில் வைத்தால், மீதி 7-ம் பயறு வகைகள்!", x: 80, y: 400, color: "#188e69", size: 22 },
          ],
        },
      ],
      questions: [
        { id: "4.1i-q1", prompt: "முளைப்பாரி என்றால் என்ன?", options: ["நவதானியங்களை முளைக்க வைத்த மண்பாண்டம்", "ஒரு வகை உணவு", "ஒரு வகை ஆடை"], correctIndex: 0, explanation: "முளைப்பாரி என்பது நவதானியங்களை முளைக்க வைத்து நிறைக்கப்பட்ட மண்பாண்டம்." },
        { id: "4.1i-q2", prompt: "நவதானியங்களில் எத்தனை வகைகள் உள்ளன?", options: ["9", "7", "12"], correctIndex: 0, explanation: "நவதானியங்கள் என்பது ஒன்பது வகை தானியங்கள்." },
        { id: "4.1i-q3", prompt: "முளைப்பாரி எதை உணர்த்துவதற்காகப் போடப்படுகிறது?", options: ["நல்ல விளைச்சல்/செழிப்பு", "நல்ல மழை மட்டும்", "பண்டிகை கொண்டாட்டம் மட்டும்"], correctIndex: 0, explanation: "முளைப்பாரி நல்ல விளைச்சல்/செழிப்பு உண்டாகுதலை உணர்த்துகிறது." },
        { id: "4.1i-q4", prompt: "முளைப்பாரி எந்த நாளில் தொடங்கப்படுகிறது?", options: ["ஒரு செவ்வாய்க்கிழமை", "ஒரு திங்கட்கிழமை", "ஒரு ஞாயிற்றுக்கிழமை"], correctIndex: 0, explanation: "முளைப்பாரி ஒரு செவ்வாய்க்கிழமை அன்று தொடங்கப்படுகிறது." },
      ],
    },
  ],
};
