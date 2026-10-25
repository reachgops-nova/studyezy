import type { InkUnit } from "./types";
import { TIP_COLOR } from "./types";

/**
 * Ink-board treatment of Cambridge Tamil Unit 22 (கல்வி அழகே அழகு - the
 * Kumaragurupara நீதிநெறி விளக்கம் verse), the closing unit of Term 3.
 * Content grounded in the unit's single DB Concept row (22.1 the verse's
 * meaning). Added 2026-10-25.
 */
export const CAMBRIDGE_4_TAMIL_22_INK: InkUnit = {
  unitKey: "cambridge-4-tamil-22",
  title: "கல்வி அழகே அழகு (Education is True Beauty)",
  badge: "Stage 4 · இயல் 22",
  languageCode: "ta-IN",

  topics: [
    {
      topicId: "22.1",
      title: "பாடல் பொருள்",
      scenes: [
        {
          label: "1. அணிகலனின் உவமை",
          say: "குமரகுருபரர் இயற்றிய இச்செய்யுள், ஒளிரும் மணிகளால் செய்யப்பட்ட அணிகலனுக்கு மேலும் அழகூட்ட வேறு அணிகலன் தேவையில்லை என்று கூறுகிறது.",
          ops: [
            { type: "text", value: "கல்வி அழகே அழகு", x: 80, y: 60, color: "#df4da8", size: 32 },
            { type: "box", x: 300, y: 140, w: 500, h: 150, color: "#39247f", label: "💎 ஒளிரும் மணி அணிகலன்", labelSize: 26 },
            { type: "text", value: "வேறு அணிகலன் தேவையில்லை - அதுவே அழகு!", x: 80, y: 330, color: "#64748b", size: 22 },
          ],
        },
        {
          label: "2. கல்வியே அழகு",
          say: "அதுபோலக் கல்வி கற்றவர்க்கு அவர் கற்ற கல்வியே அழகு தரும். ஆகையால், அழகு சேர்க்கும் பிற அணிகலன்கள் அவருக்குத் தேவையில்லை.",
          ops: [
            { type: "text", value: "கல்வியே அழகு", x: 80, y: 60, color: "#df4da8", size: 30 },
            { type: "box", x: 80, y: 140, w: 500, h: 110, color: "#188e69", label: "📚 கல்வி = உண்மையான அணிகலன்", labelSize: 22 },
            { type: "text", value: "கலன் = அணிகலன், மற்றோர் = வேறு ஒரு", x: 80, y: 290, color: "#64748b", size: 22 },
          ],
        },
        {
          label: "3. 💡 பாடலை நினைவில் வைக்க",
          say: "'மணி-கல்வி' இணையைப் பயன்படுத்தி நினைவில் வையுங்கள் - மணி எப்படி அணிகலனுக்கு அழகு தருகிறதோ, அதே போல கல்வி மனிதருக்கு அழகு தருகிறது. இரண்டுக்கும் வேறு ஒப்பனை தேவையில்லை.",
          ops: [
            { type: "text", value: "💡 உத்தி: மணி : அணிகலன் :: கல்வி : மனிதர்", x: 80, y: 60, color: TIP_COLOR, size: 22 },
            { type: "box", x: 80, y: 140, w: 480, h: 110, color: TIP_COLOR, label: "மணி → அணிகலனுக்கு அழகு", labelSize: 22 },
            { type: "box", x: 620, y: 140, w: 400, h: 110, color: TIP_COLOR, label: "கல்வி → மனிதருக்கு அழகு", labelSize: 20 },
          ],
        },
      ],
      questions: [
        { id: "22.1i-q1", prompt: "நீதிநெறி விளக்கம் பாடலை எழுதியவர் யார்?", options: ["குமரகுருபரர்", "அழ. வள்ளியப்பா", "சிவப்பிரகாச சுவாமிகள்"], correctIndex: 0, explanation: "நீதிநெறி விளக்கம் பாடலை எழுதியவர் குமரகுருபரர்." },
        { id: "22.1i-q2", prompt: "கற்றவருக்கு எது தேவையில்லை என்று குமரகுருபரர் கூறுகிறார்?", options: ["பிற அணிகலன்கள்", "உணவு", "புத்தகங்கள்"], correctIndex: 0, explanation: "கல்வியே அழகு தருவதால் பிற அணிகலன்கள் தேவையில்லை என்று பாடல் கூறுகிறது." },
        { id: "22.1i-q3", prompt: "கலன் என்ற சொல்லின் பொருள்?", options: ["அணிகலன்", "கல்வி", "நீர்"], correctIndex: 0, explanation: "கலன் என்றால் அணிகலன் என்று பொருள்." },
        { id: "22.1i-q4", prompt: "நீதிநெறி விளக்கத்தின் மையக்கருத்து யாது?", options: ["கல்வியே உண்மையான அழகு/செல்வம்", "அணிகலன்கள் அவசியம்", "செல்வமே முக்கியம்"], correctIndex: 0, explanation: "கல்வி கற்றவர்க்கு அவர் கற்ற கல்வியே அழகு தரும் என்பதே பாடலின் மையக்கருத்து." },
      ],
    },
  ],
};
