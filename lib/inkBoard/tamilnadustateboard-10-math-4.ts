import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * TN Samacheer Kalvi Std 10 Maths (Tamil medium), Unit 4 (வடிவியல் -
 * Geometry): 4.1 Thales theorem & similar triangles, 4.2 Pythagoras
 * theorem & tangents to a circle. Added 2026-10-26.
 */
export const TAMILNADU_10_MATH_4: InkUnit = {
  unitKey: "tamilnadustateboard-10-math-4",
  title: "வடிவியல் (Geometry)",
  badge: "10 ஆம் வகுப்பு · இயல் 4",
  languageCode: "ta-IN",

  topics: [
    {
      topicId: "4.1",
      title: "தேல்ஸ் தேற்றமும் ஒப்புமை முக்கோணங்களும்",
      scenes: [
        {
          label: "1. தேல்ஸ் தேற்றம்",
          say: "ஒரு முக்கோணத்தின் ஒரு பக்கத்திற்கு இணையாக வரையப்படும் கோடு, மற்ற இரு பக்கங்களையும் ஒரே விகிதத்தில் வெட்டும். முக்கோணம் ABC-யில் DE ∥ BC எனில், AD/DB = AE/EC.",
          ops: [
            { type: "text", value: "தேல்ஸ் தேற்றம் (அடிப்படை விகிதத் தேற்றம்)", x: 80, y: 60, color: "#df4da8", size: 24 },
            { type: "line", x1: 500, y1: 100, x2: 250, y2: 400, color: "#39247f", width: 3 },
            { type: "line", x1: 500, y1: 100, x2: 750, y2: 400, color: "#39247f", width: 3 },
            { type: "line", x1: 250, y1: 400, x2: 750, y2: 400, color: "#39247f", width: 3 },
            { type: "line", x1: 375, y1: 250, x2: 625, y2: 250, color: "#188e69", width: 3, dashed: true },
            { type: "text", value: "A", x: 490, y: 80, color: "#39247f", size: 24 },
            { type: "text", value: "D", x: 355, y: 245, color: "#188e69", size: 24 },
            { type: "text", value: "E", x: 635, y: 245, color: "#188e69", size: 24 },
            { type: "text", value: "B", x: 230, y: 420, color: "#39247f", size: 24 },
            { type: "text", value: "C", x: 755, y: 420, color: "#39247f", size: 24 },
            { type: "text", value: "DE ∥ BC ⇒ AD/DB = AE/EC", x: 80, y: 480, color: "#188e69", size: 26 },
          ],
        },
        {
          label: "2. தேற்றத்தைப் பயன்படுத்துதல்",
          say: "AD/DB = 2/3, AE = 4 எனில் EC காண்போம். தேல்ஸ் தேற்றப்படி AE/EC = AD/DB. எனவே 4/EC = 2/3 ⇒ EC = 4×3/2 = 6.",
          ops: [
            { type: "text", value: "எடுத்துக்காட்டு: AD/DB=2/3, AE=4, EC=?", x: 80, y: 60, color: "#df4da8", size: 24 },
            { type: "box", x: 80, y: 140, w: 600, h: 110, color: "#188e69", label: "4/EC = 2/3 ⇒ EC = 4×3/2 = 6", labelSize: 24 },
          ],
        },
        {
          label: "3. ஒப்புமை முக்கோணங்கள் (AA)",
          say: "இரு முக்கோணங்களில் இரு கோணங்கள் சமமானால், அவை ஒப்புமை முக்கோணங்கள் (AA ஒப்புமைத் தேற்றம்). ஒப்புமை முக்கோணங்களின் ஒத்த பக்கங்கள் ஒரே விகிதத்தில் இருக்கும்.",
          ops: [
            { type: "text", value: "AA ஒப்புமைத் தேற்றம்", x: 80, y: 60, color: "#df4da8", size: 28 },
            { type: "box", x: 80, y: 140, w: 500, h: 110, color: "#39247f", label: "2 கோணங்கள் சமம் ⇒ முக்கோணங்கள் ஒப்புமை", labelSize: 20 },
            { type: "text", value: "ஒப்புமை முக்கோணங்களின் ஒத்த பக்கங்கள் ஒரே விகிதம்", x: 80, y: 290, color: "#64748b", size: 22 },
          ],
        },
        {
          label: "4. 💡 தேல்ஸ் தேற்றத்தை நினைவில் வைக்க",
          say: "'இணையான கோடு எப்போதும் சமமாகப் பிரிக்கும்' என்று நினைவில் வையுங்கள். எந்தப் பக்கத்தை எந்தப் பக்கத்தோடு இணைக்க வேண்டும் என்பதைக் குழப்பாமல் இருக்க, எப்போதும் 'மேல் பகுதி / கீழ் பகுதி' என்ற வரிசையில் இரு பக்கங்களுக்கும் எழுதுங்கள்.",
          ops: [
            { type: "text", value: "💡 உத்தி: 'மேல் பகுதி / கீழ் பகுதி' வரிசையில் எழுது", x: 80, y: 60, color: TIP_COLOR, size: 22 },
            { type: "box", x: 80, y: 140, w: 500, h: 110, color: TIP_COLOR, label: "AD/DB = AE/EC (இரண்டும் மேல்/கீழ்)", labelSize: 20 },
          ],
        },
        {
          label: "5. ✍️ எழுதித் தீர்ப்போம்",
          say: "இப்போது நீங்கள் தீர்க்க வேண்டும். தேல்ஸ் தேற்றத்தைப் பயன்படுத்தி இந்த இரு கேள்விகளையும் உங்கள் நோட்டுப் புத்தகத்தில் தீர்க்கவும்.",
          ops: [
            { type: "text", value: "✍️ எழுதித் தீர்ப்போம் - மேலும் எடுத்துக்காட்டுகள்", x: 80, y: 50, color: PRACTICE_COLOR, size: 22 },
            { type: "box", x: 80, y: 130, w: 500, h: 110, color: PRACTICE_COLOR, label: "1. AD/DB=3/4, AE=6 எனில் EC=?", labelSize: 20 },
            { type: "box", x: 80, y: 260, w: 500, h: 110, color: PRACTICE_COLOR, label: "2. AD=4,DB=6,AE=6 எனில் EC=?", labelSize: 20 },
            { type: "text", value: "விடை: 1) EC=8   2) EC=9", x: 80, y: 390, color: "#64748b", size: 22 },
          ],
        },
      ],
      questions: [
        { id: "4.1i-q1", prompt: "தேல்ஸ் தேற்றப்படி DE∥BC எனில் என்ன உண்மை?", options: ["AD/DB = AE/EC", "AD×DB = AE×EC", "AD+DB = AE+EC"], correctIndex: 0, explanation: "இணையான கோடு மற்ற இரு பக்கங்களையும் ஒரே விகிதத்தில் வெட்டும்." },
        { id: "4.1i-q2", prompt: "AD/DB=2/3, AE=4 எனில் EC?", options: ["6", "4", "8"], correctIndex: 0, explanation: "4/EC=2/3 ⇒ EC=6." },
        { id: "4.1i-q3", prompt: "AA ஒப்புமைத் தேற்றம் என்ன கூறுகிறது?", options: ["2 கோணங்கள் சமமானால் முக்கோணங்கள் ஒப்புமை", "3 பக்கங்களும் சமமாக இருக்க வேண்டும்", "ஒரு கோணம் மட்டும் போதும்"], correctIndex: 0, explanation: "இரு கோணங்கள் சமமானால் மூன்றாவது கோணமும் தானாக சமமாகும்." },
        { id: "4.1i-q4", prompt: "AD/DB=3/4, AE=6 எனில் EC?", options: ["8", "6", "4"], correctIndex: 0, explanation: "6/EC=3/4 ⇒ EC=8." },
      ],
    },
    {
      topicId: "4.2",
      title: "பிதாகரஸ் தேற்றமும் வட்டத்தொடு கோடுகளும்",
      scenes: [
        {
          label: "1. பிதாகரஸ் தேற்றம்",
          say: "ஒரு செங்கோண முக்கோணத்தில், கர்ணத்தின் வர்க்கம் மற்ற இரு பக்கங்களின் வர்க்கங்களின் கூடுதலுக்குச் சமம். AB=3, BC=4 எனில் கர்ணம் AC = √(9+16) = 5.",
          ops: [
            { type: "text", value: "பிதாகரஸ் தேற்றம்: AC² = AB² + BC²", x: 80, y: 60, color: "#df4da8", size: 26 },
            { type: "line", x1: 150, y1: 400, x2: 150, y2: 150, color: "#39247f", width: 3 },
            { type: "line", x1: 150, y1: 400, x2: 500, y2: 400, color: "#39247f", width: 3 },
            { type: "line", x1: 150, y1: 150, x2: 500, y2: 400, color: "#188e69", width: 3 },
            { type: "text", value: "B", x: 120, y: 420, color: "#39247f", size: 24 },
            { type: "text", value: "A", x: 120, y: 130, color: "#39247f", size: 24 },
            { type: "text", value: "C", x: 510, y: 420, color: "#39247f", size: 24 },
            { type: "text", value: "AB=3", x: 60, y: 270, color: "#39247f", size: 22 },
            { type: "text", value: "BC=4", x: 290, y: 440, color: "#39247f", size: 22 },
            { type: "text", value: "AC (கர்ணம்) = √(3²+4²) = 5", x: 600, y: 280, color: "#188e69", size: 26 },
          ],
        },
        {
          label: "2. வட்டத்தொடு கோடு தேற்றம்",
          say: "ஒரு வட்டத்தின் தொடுகோடு, தொடுநிலையில் வரையப்படும் ஆரத்திற்குச் செங்குத்தாக இருக்கும். மேலும் ஒரு புற புள்ளியிலிருந்து வரையப்படும் இரு தொடுகோடுகளின் நீளங்கள் சமம்.",
          ops: [
            { type: "text", value: "வட்டத்தொடு கோடு தேற்றம்", x: 80, y: 60, color: "#df4da8", size: 28 },
            { type: "box", x: 80, y: 140, w: 500, h: 110, color: "#39247f", label: "தொடுகோடு ⊥ தொடுநிலை ஆரம்", labelSize: 24 },
            { type: "text", value: "புற புள்ளியிலிருந்து 2 தொடுகோடுகள் = சம நீளம்", x: 80, y: 290, color: "#64748b", size: 22 },
          ],
        },
        {
          label: "3. 💡 பித்தகோரியன் முப்புள்ளிகள்",
          say: "சில பொதுவான எண் முக்கூட்டுகள் (3,4,5), (5,12,13), (8,15,17) எப்போதும் பித்தகோரியன் திரளாக இருக்கும் - இவற்றை மனப்பாடம் செய்தால் பல வினாக்களை விரைவாகத் தீர்க்கலாம்.",
          ops: [
            { type: "text", value: "💡 உத்தி: பொதுவான பித்தகோரியன் முப்புள்ளிகளை மனப்பாடம் செய்", x: 80, y: 50, color: TIP_COLOR, size: 18 },
            { type: "box", x: 80, y: 130, w: 280, h: 90, color: TIP_COLOR, label: "3, 4, 5", labelSize: 28 },
            { type: "box", x: 400, y: 130, w: 280, h: 90, color: TIP_COLOR, label: "5, 12, 13", labelSize: 24 },
            { type: "box", x: 720, y: 130, w: 280, h: 90, color: TIP_COLOR, label: "8, 15, 17", labelSize: 24 },
          ],
        },
        {
          label: "4. ✍️ எழுதித் தீர்ப்போம்",
          say: "இப்போது நீங்கள் தீர்க்க வேண்டும். இந்த இரு செங்கோண முக்கோணங்களுக்கும் பிதாகரஸ் தேற்றத்தைப் பயன்படுத்தி கர்ணத்தை உங்கள் நோட்டுப் புத்தகத்தில் காணுங்கள்.",
          ops: [
            { type: "text", value: "✍️ எழுதித் தீர்ப்போம் - மேலும் எடுத்துக்காட்டுகள்", x: 80, y: 50, color: PRACTICE_COLOR, size: 22 },
            { type: "box", x: 80, y: 130, w: 450, h: 100, color: PRACTICE_COLOR, label: "1. AB=6, BC=8 எனில் AC=?", labelSize: 24 },
            { type: "box", x: 580, y: 130, w: 450, h: 100, color: PRACTICE_COLOR, label: "2. AB=9, BC=12 எனில் AC=?", labelSize: 24 },
            { type: "text", value: "விடை: 1) AC=10   2) AC=15", x: 80, y: 260, color: "#64748b", size: 22 },
          ],
        },
      ],
      questions: [
        { id: "4.2i-q1", prompt: "AB=3, BC=4 செங்கோண முக்கோணத்தில் கர்ணம் AC?", options: ["5", "7", "6"], correctIndex: 0, explanation: "AC²=9+16=25 ⇒ AC=5." },
        { id: "4.2i-q2", prompt: "வட்டத்தின் தொடுகோடு, தொடுநிலை ஆரத்திற்கு எவ்வாறு இருக்கும்?", options: ["செங்குத்தாக", "இணையாக", "குறுக்காக"], correctIndex: 0, explanation: "தொடுகோடு எப்போதும் தொடுநிலை ஆரத்திற்குச் செங்குத்தாக இருக்கும்." },
        { id: "4.2i-q3", prompt: "AB=6, BC=8 எனில் கர்ணம் AC?", options: ["10", "14", "12"], correctIndex: 0, explanation: "AC²=36+64=100 ⇒ AC=10 (3,4,5 திரளின் இரட்டிப்பு)." },
        { id: "4.2i-q4", prompt: "ஒரு புற புள்ளியிலிருந்து வரையப்படும் இரு தொடுகோடுகள் எவ்வாறு இருக்கும்?", options: ["சம நீளம்", "வெவ்வேறு நீளம்", "எப்போதும் 0"], correctIndex: 0, explanation: "புற புள்ளியிலிருந்து வரையப்படும் இரு தொடுகோடுகளின் நீளங்கள் எப்போதும் சமம்." },
      ],
    },
  ],
};
