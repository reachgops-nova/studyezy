import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * TN Samacheer Kalvi Std 10 Maths (Tamil medium), Unit 6 (முக்கோணவியல் -
 * Trigonometry): 6.1 trig ratios & identities, 6.2 heights & distances.
 * Added 2026-10-26.
 */
export const TAMILNADU_10_MATH_6: InkUnit = {
  unitKey: "tamilnadustateboard-10-math-6",
  title: "முக்கோணவியல் (Trigonometry)",
  badge: "10 ஆம் வகுப்பு · இயல் 6",
  languageCode: "ta-IN",

  topics: [
    {
      topicId: "6.1",
      title: "முக்கோணவியல் விகிதங்களும் அடையாளங்களும்",
      scenes: [
        {
          label: "1. முக்கோணவியல் விகிதங்கள்",
          say: "செங்கோண முக்கோணத்தில் θ கோணத்திற்கு: sin θ = எதிர்பக்கம்/கர்ணம், cos θ = அடுத்துள்ள பக்கம்/கர்ணம், tan θ = எதிர்பக்கம்/அடுத்துள்ள பக்கம்.",
          ops: [
            { type: "text", value: "முக்கோணவியல் விகிதங்கள்", x: 80, y: 60, color: "#df4da8", size: 28 },
            { type: "line", x1: 150, y1: 400, x2: 150, y2: 180, color: "#39247f", width: 3 },
            { type: "line", x1: 150, y1: 400, x2: 550, y2: 400, color: "#39247f", width: 3 },
            { type: "line", x1: 150, y1: 180, x2: 550, y2: 400, color: "#188e69", width: 3 },
            { type: "text", value: "θ", x: 480, y: 390, color: "#dc2626", size: 24 },
            { type: "text", value: "எதிர்பக்கம்", x: 60, y: 280, color: "#39247f", size: 20 },
            { type: "text", value: "அடுத்த பக்கம்", x: 280, y: 440, color: "#39247f", size: 20 },
            { type: "text", value: "கர்ணம்", x: 350, y: 260, color: "#188e69", size: 20 },
            { type: "text", value: "sin θ = எதிர்/கர்ணம்   cos θ = அடுத்த/கர்ணம்   tan θ = எதிர்/அடுத்த", x: 600, y: 300, color: "#64748b", size: 18 },
          ],
        },
        {
          label: "2. அடிப்படை அடையாளம்",
          say: "அடிப்படை அடையாளம்: sin²θ + cos²θ = 1. sin θ = 3/5 எனில், cos θ காண்போம். cos²θ = 1 - 9/25 = 16/25 ⇒ cos θ = 4/5.",
          ops: [
            { type: "text", value: "sin²θ + cos²θ = 1", x: 80, y: 60, color: "#df4da8", size: 32 },
            { type: "box", x: 80, y: 140, w: 600, h: 110, color: "#188e69", label: "sinθ=3/5 ⇒ cos²θ=1-9/25=16/25 ⇒ cosθ=4/5", labelSize: 18 },
          ],
        },
        {
          label: "3. மேலும் அடையாளங்கள்",
          say: "1 + tan²θ = sec²θ. 1 + cot²θ = cosec²θ. இவை sin²θ+cos²θ=1-ஐ cos²θ அல்லது sin²θ-ஆல் வகுத்தால் கிடைக்கும்.",
          ops: [
            { type: "text", value: "மேலும் அடையாளங்கள்", x: 80, y: 60, color: "#df4da8", size: 28 },
            { type: "box", x: 80, y: 140, w: 450, h: 100, color: "#39247f", label: "1 + tan²θ = sec²θ", labelSize: 26 },
            { type: "box", x: 580, y: 140, w: 450, h: 100, color: "#39247f", label: "1 + cot²θ = cosec²θ", labelSize: 24 },
          ],
        },
        {
          label: "4. 💡 விகிதங்களை நினைவில் வைக்க",
          say: "'எ-க-அ' (எதிர்-கர்ணம்-அடுத்த) என்ற வரிசையில் sin, cos, tan-ஐ நினைவில் வையுங்கள் - sin=எதிர்/கர்ணம், cos=அடுத்த/கர்ணம், tan=எதிர்/அடுத்த. தமிழில் 'எ.கா.எ.அ' என மனப்பாடம் செய்யலாம்.",
          ops: [
            { type: "text", value: "💡 உத்தி: sin=எதிர்/கர்ணம், cos=அடுத்த/கர்ணம், tan=எதிர்/அடுத்த", x: 80, y: 50, color: TIP_COLOR, size: 16 },
            { type: "box", x: 80, y: 130, w: 300, h: 90, color: TIP_COLOR, label: "sin = எ/க", labelSize: 24 },
            { type: "box", x: 400, y: 130, w: 300, h: 90, color: TIP_COLOR, label: "cos = அ/க", labelSize: 24 },
            { type: "box", x: 720, y: 130, w: 300, h: 90, color: TIP_COLOR, label: "tan = எ/அ", labelSize: 24 },
          ],
        },
        {
          label: "5. ✍️ எழுதித் தீர்ப்போம்",
          say: "இப்போது நீங்கள் தீர்க்க வேண்டும். sin²θ+cos²θ=1 அடையாளத்தைப் பயன்படுத்தி இந்த இரு கேள்விகளையும் உங்கள் நோட்டுப் புத்தகத்தில் தீர்க்கவும்.",
          ops: [
            { type: "text", value: "✍️ எழுதித் தீர்ப்போம் - மேலும் எடுத்துக்காட்டுகள்", x: 80, y: 50, color: PRACTICE_COLOR, size: 22 },
            { type: "box", x: 80, y: 130, w: 500, h: 100, color: PRACTICE_COLOR, label: "1. cosθ=12/13 எனில் sinθ=?", labelSize: 22 },
            { type: "box", x: 80, y: 250, w: 500, h: 100, color: PRACTICE_COLOR, label: "2. sinθ=5/13 எனில் tanθ=?", labelSize: 22 },
            { type: "text", value: "விடை: 1) sinθ=5/13   2) tanθ=5/12", x: 80, y: 370, color: "#64748b", size: 20 },
          ],
        },
      ],
      questions: [
        { id: "6.1i-q1", prompt: "sin θ = எதிர்பக்கம்/எது?", options: ["கர்ணம்", "அடுத்த பக்கம்", "அடிப்பக்கம்"], correctIndex: 0, explanation: "sin θ = எதிர்பக்கம்/கர்ணம்." },
        { id: "6.1i-q2", prompt: "sin²θ + cos²θ = ?", options: ["1", "0", "2"], correctIndex: 0, explanation: "இது அடிப்படை முக்கோணவியல் அடையாளம்." },
        { id: "6.1i-q3", prompt: "sin θ = 3/5 எனில் cos θ?", options: ["4/5", "3/5", "5/4"], correctIndex: 0, explanation: "cos²θ=1-9/25=16/25 ⇒ cosθ=4/5." },
        { id: "6.1i-q4", prompt: "1 + tan²θ = ?", options: ["sec²θ", "cosec²θ", "1"], correctIndex: 0, explanation: "இது sin²θ+cos²θ=1-ஐ cos²θ-ஆல் வகுத்தால் கிடைக்கும் அடையாளம்." },
      ],
    },
    {
      topicId: "6.2",
      title: "உயரமும் தொலைவும்",
      scenes: [
        {
          label: "1. ஏற்றக் கோணமும் இறக்கக் கோணமும்",
          say: "ஒரு புள்ளியிலிருந்து மேல்நோக்கிப் பார்க்கும்போது ஏற்படும் கோணம் ஏற்றக் கோணம். மேலிருந்து கீழ்நோக்கிப் பார்க்கும்போது ஏற்படும் கோணம் இறக்கக் கோணம்.",
          ops: [
            { type: "text", value: "ஏற்றக் கோணமும் இறக்கக் கோணமும்", x: 80, y: 60, color: "#df4da8", size: 26 },
            { type: "line", x1: 150, y1: 450, x2: 150, y2: 150, color: "#39247f", width: 3 },
            { type: "line", x1: 150, y1: 450, x2: 700, y2: 450, color: "#64748b", width: 2, dashed: true },
            { type: "line", x1: 700, y1: 450, x2: 150, y2: 150, color: "#188e69", width: 3 },
            { type: "text", value: "கோபுரம்", x: 50, y: 290, color: "#39247f", size: 20 },
            { type: "text", value: "θ (ஏற்றக் கோணம்)", x: 550, y: 420, color: "#188e69", size: 22 },
            { type: "text", value: "கவனிப்பவர்", x: 650, y: 470, color: "#64748b", size: 20 },
          ],
        },
        {
          label: "2. உயரம் காணும் முறை",
          say: "20m தொலைவில் உள்ள கோபுரத்தின் உச்சிக்கு ஏற்றக்கோணம் 45°. உயரம் காண்போம். tan θ = உயரம்/தொலைவு. tan45° = 1 = உயரம்/20 ⇒ உயரம் = 20m.",
          ops: [
            { type: "text", value: "tan θ = உயரம் / தொலைவு", x: 80, y: 60, color: "#df4da8", size: 28 },
            { type: "box", x: 80, y: 140, w: 600, h: 110, color: "#188e69", label: "tan45°=1=உயரம்/20 ⇒ உயரம்=20m", labelSize: 22 },
          ],
        },
        {
          label: "3. மற்றொரு எடுத்துக்காட்டு",
          say: "30m உயரமுள்ள கோபுரத்திலிருந்து ஒரு கார் பார்க்கப்படும் இறக்கக்கோணம் 30°. காரின் தொலைவு காண்போம். tan30°=1/√3=30/தொலைவு ⇒ தொலைவு = 30√3 ≈ 51.96m.",
          ops: [
            { type: "text", value: "இறக்கக்கோணம் உதாரணம்", x: 80, y: 60, color: "#df4da8", size: 28 },
            { type: "box", x: 80, y: 140, w: 600, h: 110, color: "#188e69", label: "tan30°=1/√3=30/d ⇒ d=30√3≈51.96m", labelSize: 20 },
          ],
        },
        {
          label: "4. 💡 உயரம்-தொலைவு வினாக்களைத் தீர்க்கும் உத்தி",
          say: "எப்போதும் முதலில் ஒரு செங்கோண முக்கோணப் படம் வரையுங்கள் - கோபுரம்/மரம் செங்குத்துப் பக்கம், தரை அடிப்பக்கம், பார்வைக்கோடு கர்ணம். பின் எந்த விகிதம் (tan பொதுவாக) தேவை என முடிவு செய்யுங்கள்.",
          ops: [
            { type: "text", value: "💡 உத்தி: முதலில் படம் வரை, பின் tan θ = உயரம்/தொலைவு", x: 80, y: 60, color: TIP_COLOR, size: 20 },
            { type: "box", x: 80, y: 140, w: 500, h: 110, color: TIP_COLOR, label: "படம் → செங்கோண முக்கோணம் → tan θ பயன்படுத்து", labelSize: 18 },
          ],
        },
        {
          label: "5. ✍️ எழுதித் தீர்ப்போம்",
          say: "இப்போது நீங்கள் தீர்க்க வேண்டும். இந்த இரு உயரம்-தொலைவு வினாக்களையும் படம் வரைந்து உங்கள் நோட்டுப் புத்தகத்தில் தீர்க்கவும்.",
          ops: [
            { type: "text", value: "✍️ எழுதித் தீர்ப்போம் - மேலும் எடுத்துக்காட்டுகள்", x: 80, y: 50, color: PRACTICE_COLOR, size: 22 },
            { type: "box", x: 80, y: 130, w: 500, h: 110, color: PRACTICE_COLOR, label: "1. 10m தொலைவு, ஏற்றக்கோணம் 60° - உயரம்?", labelSize: 18 },
            { type: "box", x: 80, y: 260, w: 500, h: 110, color: PRACTICE_COLOR, label: "2. 15m உயர கோபுரம், இறக்கக்கோணம் 45° - தொலைவு?", labelSize: 16 },
            { type: "text", value: "விடை: 1) 10√3≈17.3m   2) 15m", x: 80, y: 390, color: "#64748b", size: 20 },
          ],
        },
      ],
      questions: [
        { id: "6.2i-q1", prompt: "20m தொலைவில் உள்ள கோபுரத்தின் உச்சிக்கு ஏற்றக்கோணம் 45° எனில் உயரம்?", options: ["20m", "10m", "40m"], correctIndex: 0, explanation: "tan45°=1=உயரம்/20 ⇒ உயரம்=20m." },
        { id: "6.2i-q2", prompt: "ஏற்றக் கோணம் என்றால் என்ன?", options: ["கீழிருந்து மேலே பார்க்கும்போது ஏற்படும் கோணம்", "மேலிருந்து கீழே பார்க்கும் கோணம்", "இரு கோடுகளுக்கு இடையேயான கோணம்"], correctIndex: 0, explanation: "கீழே நிற்கும் ஒருவர் மேலுள்ள பொருளைப் பார்க்கும்போது ஏற்படும் கோணமே ஏற்றக் கோணம்." },
        { id: "6.2i-q3", prompt: "உயரம்-தொலைவு வினாக்களில் பொதுவாகப் பயன்படும் விகிதம்?", options: ["tan θ", "sin θ மட்டும்", "cos θ மட்டும்"], correctIndex: 0, explanation: "உயரம் மற்றும் தொலைவு இரண்டும் தொடர்புடையதால் tan θ = உயரம்/தொலைவு பொதுவாகப் பயன்படும்." },
        { id: "6.2i-q4", prompt: "10m தொலைவில், ஏற்றக்கோணம் 60° எனில் உயரம்?", options: ["10√3 m", "10 m", "5√3 m"], correctIndex: 0, explanation: "tan60°=√3=உயரம்/10 ⇒ உயரம்=10√3 m." },
      ],
    },
  ],
};
