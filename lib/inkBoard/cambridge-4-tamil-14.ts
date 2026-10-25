import type { InkUnit } from "./types";
import { TIP_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Tamil Unit 14 (நன்னெறி - the
 * sea-and-moonlight gentle-words verse by சிவப்பிரகாச சுவாமிகள்). Content
 * grounded in the unit's single DB Concept row (14.1 the verse's
 * meaning). Added 2026-10-25. Last unit of Term 2.
 */
export const CAMBRIDGE_4_TAMIL_14_INK: InkUnit = {
  unitKey: "cambridge-4-tamil-14",
  title: "நன்னெறி (Good Conduct)",
  badge: "Stage 4 · இயல் 14",
  languageCode: "ta-IN",

  topics: [
    {
      topicId: "14.1",
      title: "பாடல் பொருள்",
      scenes: [
        {
          label: "1. கடலின் உவமை",
          say: "சிவப்பிரகாச சுவாமிகள் இயற்றிய இச்செய்யுள், கடல் சூரியனின் வெப்பத்தால் பொங்காமல், குளிர்ந்த நிலவொளி கண்டே பொங்குவதை உவமையாகக் கூறுகிறது.",
          ops: [
            { type: "text", value: "நன்னெறி", x: 80, y: 60, color: "#df4da8", size: 34 },
            { type: "text", value: "ஆசிரியர்: சிவப்பிரகாச சுவாமிகள்", x: 80, y: 140, color: "#64748b", size: 24 },
            { type: "box", x: 80, y: 200, w: 480, h: 110, color: "#dc2626", label: "☀️ அழல்கதிர் (சூரிய வெப்பம்) → கடல் பொங்காது", labelSize: 18 },
            { type: "box", x: 80, y: 340, w: 480, h: 110, color: "#188e69", label: "🌙 தண்ணென் கதிர் (நிலவொளி) → கடல் பொங்கும்", labelSize: 18 },
          ],
        },
        {
          label: "2. இன்சொல்லின் சக்தி",
          say: "அதே போல், மக்களும் இனிய சொற்களைக் கேட்டே மகிழ்வார்கள், கடுமையான சொற்களால் அல்ல. இன்சொல் என்றால் இனிமையான சொல். வன்சொல் என்றால் கடுமையான சொல்.",
          ops: [
            { type: "text", value: "இன்சொல்லின் சக்தி", x: 80, y: 60, color: "#df4da8", size: 30 },
            { type: "box", x: 80, y: 140, w: 300, h: 100, color: "#188e69", label: "இன்சொல்", labelSize: 26 },
            { type: "text", value: "= இனிமையான சொல்", x: 420, y: 195, color: "#188e69", size: 24 },
            { type: "box", x: 80, y: 270, w: 300, h: 100, color: "#dc2626", label: "வன்சொல்", labelSize: 26 },
            { type: "text", value: "= கடுமையான சொல்", x: 420, y: 325, color: "#dc2626", size: 24 },
            { type: "text", value: "மக்கள் இன்சொல்லைக் கேட்டே மகிழ்வர்", x: 80, y: 440, color: "#39247f", size: 24 },
          ],
        },
        {
          label: "3. 💡 உவமையை நினைவில் வைக்க",
          say: "இந்த உவமையை நினைவில் வைக்க - வெப்பமானது (சூரியன்/வன்சொல்) எதையும் பொங்கவைக்காது, குளிர்ந்தது (நிலவு/இன்சொல்) தான் பொங்கவைக்கும் என்று இரட்டை ஒப்பீடாக நினைவில் கொள்ளுங்கள்.",
          ops: [
            { type: "text", value: "💡 உத்தி: வெப்பம் = வன்சொல், குளிர்ச்சி = இன்சொல்", x: 80, y: 50, color: TIP_COLOR, size: 22 },
            { type: "box", x: 80, y: 130, w: 480, h: 110, color: TIP_COLOR, label: "சூரியன் (வெப்பம்) = வன்சொல் → பலன் இல்லை", labelSize: 18 },
            { type: "box", x: 80, y: 270, w: 480, h: 110, color: TIP_COLOR, label: "நிலவு (குளிர்ச்சி) = இன்சொல் → மகிழ்ச்சி", labelSize: 18 },
          ],
        },
      ],
      questions: [
        { id: "14.1i-q1", prompt: "இச்செய்யுளை இயற்றியவர் யார்?", options: ["சிவப்பிரகாச சுவாமிகள்", "அழ. வள்ளியப்பா", "ஔவையார்"], correctIndex: 0, explanation: "நன்னெறி செய்யுளை இயற்றியவர் சிவப்பிரகாச சுவாமிகள்." },
        { id: "14.1i-q2", prompt: "இன்சொல் என்பதன் பொருள்?", options: ["இனிமையான சொல்", "கடுமையான சொல்", "பொருளற்ற சொல்"], correctIndex: 0, explanation: "இன்சொல் என்றால் இனிமையான சொல்." },
        { id: "14.1i-q3", prompt: "கடல் எதைக் கண்டு பொங்கும் என செய்யுள் கூறுகிறது?", options: ["நிலவின் குளிர் ஒளி", "சூரியனின் வெப்பம்", "காற்றின் வேகம்"], correctIndex: 0, explanation: "கடல் சூரியனின் வெப்பத்தால் அல்ல, நிலவின் குளிர் ஒளியைக் கண்டே பொங்கும்." },
        { id: "14.1i-q4", prompt: "வன்சொல் என்பதன் பொருள்?", options: ["கடுமையான சொல்", "இனிமையான சொல்", "பழைய சொல்"], correctIndex: 0, explanation: "வன்சொல் என்றால் கடுமையான சொல்." },
      ],
    },
  ],
};
