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

    {
      topicId: "பயிற்சி 6.1",
      title: "📘 பயிற்சி 6.1 - முழுத் தீர்வுகள் (முக்கோணவியல் முற்றொருமைகள்)",
      scenes: [
        {
          label: "1. வினா 1 - cotθ+tanθ, tan⁴θ+tan²θ",
          say: "(i) cotθ+tanθ = cosθ/sinθ + sinθ/cosθ = (cos²θ+sin²θ)/(sinθcosθ) = 1/(sinθcosθ) = secθ·cosecθ. (ii) tan⁴θ+tan²θ = tan²θ(tan²θ+1) = tan²θ·sec²θ. ஆனால் sec⁴θ-sec²θ = sec²θ(sec²θ-1) = sec²θ·tan²θ. இரண்டும் சமம்.",
          ops: [
            { type: "text", value: "1(i) cotθ+tanθ = cosθ/sinθ+sinθ/cosθ = 1/(sinθcosθ) = secθ cosecθ ✓", x: 60, y: 60, color: "#1e293b", size: 18 },
            { type: "text", value: "1(ii) tan⁴θ+tan²θ = tan²θ(1+tan²θ) = tan²θsec²θ", x: 60, y: 140, color: "#1e293b", size: 18 },
            { type: "text", value: "sec⁴θ-sec²θ = sec²θ(sec²θ-1) = sec²θtan²θ  ∴ சமம் ✓", x: 60, y: 200, color: "#1e293b", size: 18 },
          ],
        },
        {
          label: "2. வினா 2 - (1-tan²θ)/(cot²θ-1), cosθ/(1+sinθ)",
          say: "(i) cot²θ-1 = (1-tan²θ)/tan²θ ஆகையால் (1-tan²θ)/(cot²θ-1) = tan²θ. (ii) secθ-tanθ = (1-sinθ)/cosθ. இதை (1-sinθ)/(1-sinθ) கொண்டு LHS-ஐப் பெருக்கி cosθ(1-sinθ)/cos²θ = (1-sinθ)/cosθ என பெறலாம்.",
          ops: [
            { type: "text", value: "2(i) cot²θ-1 = (1-tan²θ)/tan²θ ⇒ (1-tan²θ)/(cot²θ-1) = tan²θ ✓", x: 60, y: 60, color: "#1e293b", size: 18 },
            { type: "text", value: "2(ii) cosθ/(1+sinθ) × (1-sinθ)/(1-sinθ) = cosθ(1-sinθ)/cos²θ", x: 60, y: 140, color: "#1e293b", size: 18 },
            { type: "text", value: "= (1-sinθ)/cosθ = secθ-tanθ ✓", x: 60, y: 200, color: "#1e293b", size: 18 },
          ],
        },
        {
          label: "3. வினா 3 - வர்க்கமூலச் சமன்பாடுகள்",
          say: "(i) [(1+sinθ)/(1-sinθ)] -ன் தொகுதி/பகுதியை (1+sinθ) கொண்டு பெருக்க, (1+sinθ)²/cos²θ கிடைக்கும்; மூலம் (1+sinθ)/cosθ = secθ+tanθ. (ii) அதே முறையில் இரண்டாவது உறுப்பு (1-sinθ)/cosθ; கூட்டினால் 2/cosθ = 2secθ.",
          ops: [
            { type: "text", value: "3(i) √[(1+sinθ)/(1-sinθ)] = √[(1+sinθ)²/cos²θ] = (1+sinθ)/cosθ = secθ+tanθ ✓", x: 60, y: 60, color: "#1e293b", size: 17 },
            { type: "text", value: "3(ii) இரு உறுப்புகளும் (1+sinθ)/cosθ, (1-sinθ)/cosθ", x: 60, y: 150, color: "#1e293b", size: 18 },
            { type: "text", value: "கூட்டல் = 2/cosθ = 2secθ ✓", x: 60, y: 210, color: "#1e293b", size: 18 },
          ],
        },
        {
          label: "4. வினா 4 - sec⁶θ, (sinθ+secθ)²+(cosθ+cosecθ)²",
          say: "(i) sec²θ=1+tan²θ என்பதால் sec⁶θ=(1+tan²θ)³=1+3tan²θ+3tan⁴θ+tan⁶θ = RHS. (ii) LHS விரிவாக்கி, sinθsecθ=tanθ, cosθcosecθ=cotθ பயன்படுத்தி tanθ+cotθ=secθcosecθ எனபதால் இரண்டு பக்கமும் சமம்.",
          ops: [
            { type: "text", value: "4(i) sec⁶θ=(1+tan²θ)³=1+3tan²θ+3tan⁴θ+tan⁶θ = tan⁶θ+3tan²θsec²θ+1 ✓", x: 60, y: 60, color: "#1e293b", size: 16 },
            { type: "text", value: "4(ii) LHS = 1+2(tanθ+cotθ)+sec²θ+cosec²θ; tanθ+cotθ=secθcosecθ", x: 60, y: 150, color: "#1e293b", size: 16 },
            { type: "text", value: "⇒ LHS = 1+2secθcosecθ+sec²θ+cosec²θ = RHS ✓", x: 60, y: 210, color: "#1e293b", size: 16 },
          ],
        },
        {
          label: "5. வினா 5 - sec⁴θ(1-sin⁴θ)-2tan²θ, (cotθ-cosθ)/(cotθ+cosθ)",
          say: "(i) 1-sin⁴θ=cos²θ(1+sin²θ); sec⁴θ·cos²θ=sec²θ. எனவே sec²θ(1+sin²θ)-2tan²θ = sec²θ+tan²θ-2tan²θ = sec²θ-tan²θ=1. (ii) cotθ=cosθ/sinθ எனப் பிரதியிட்டு, இரு பக்கமும் (1-sinθ)/(1+sinθ) என எளிமையாகும்.",
          ops: [
            { type: "text", value: "5(i) sec⁴θ(1-sin⁴θ) = sec²θ(1+sin²θ) = sec²θ+tan²θ", x: 60, y: 60, color: "#1e293b", size: 17 },
            { type: "text", value: "-2tan²θ ⇒ sec²θ-tan²θ = 1 ✓", x: 60, y: 120, color: "#1e293b", size: 17 },
            { type: "text", value: "5(ii) LHS=(1-sinθ)/(1+sinθ); RHS=(cosecθ-1)/(cosecθ+1)=(1-sinθ)/(1+sinθ) ✓", x: 60, y: 190, color: "#1e293b", size: 16 },
          ],
        },
        {
          label: "6. வினா 6 - கூட்டல்/கழித்தல் சூத்திரங்கள்",
          say: "(i) sinA-sinB, cosA+cosB, cosA-cosB, sinA+sinB-ஐ sum-to-product சூத்திரங்களால் 2cos((A+B)/2)sin((A-B)/2) போன்று எழுத, முதல் உறுப்பு tan((A-B)/2), இரண்டாவது -tan((A-B)/2) ஆகி கூட்டல் பூஜ்ஜியம். (ii) sin³A+cos³A = (sinA+cosA)(1-sinAcosA), sin³A-cos³A=(sinA-cosA)(1+sinAcosA) என காரணிப்படுத்தி ஒவ்வொரு பின்னமும் எளிமையாகி கூட்டல் 2.",
          ops: [
            { type: "text", value: "6(i) sum-to-product: முதல் உறுப்பு=tan((A-B)/2), இரண்டாவது=-tan((A-B)/2) ⇒ கூட்டல்=0 ✓", x: 60, y: 60, color: "#1e293b", size: 15 },
            { type: "text", value: "6(ii) sin³A+cos³A=(sinA+cosA)(1-sinAcosA) ⇒ 1st பின்னம்=1-sinAcosA", x: 60, y: 150, color: "#1e293b", size: 15 },
            { type: "text", value: "sin³A-cos³A=(sinA-cosA)(1+sinAcosA) ⇒ 2nd பின்னம்=1+sinAcosA; கூட்டல்=2 ✓", x: 60, y: 210, color: "#1e293b", size: 15 },
          ],
        },
        {
          label: "7. வினா 7 - sinθ+cosθ=√3, √3sinθ-cosθ=0",
          say: "(i) sinθ+cosθ=√3-ஐ வர்க்கமாக்க 1+2sinθcosθ=3 ⇒ sinθcosθ=1. tanθ+cotθ=1/(sinθcosθ)=1. (ii) tan(2θ+θ)=tan3θ-ஐ கோண கூட்டல் சூத்திரத்தால் விரிவாக்கினால் பொதுவான முத்தரப்புக் கோணச் சூத்திரம் (3tanθ-tan³θ)/(1-3tan²θ) கிடைக்கும்; கொடுக்கப்பட்ட நிபந்தனை tanθ=1/√3-ஐத் தருகிறது, இரு பக்கமும் சீரானவை.",
          ops: [
            { type: "text", value: "7(i) (sinθ+cosθ)²=3 ⇒ 1+2sinθcosθ=3 ⇒ sinθcosθ=1", x: 60, y: 60, color: "#1e293b", size: 17 },
            { type: "text", value: "tanθ+cotθ = 1/(sinθcosθ) = 1 ✓", x: 60, y: 120, color: "#1e293b", size: 17 },
            { type: "text", value: "7(ii) tan3θ=tan(2θ+θ) விரிவாக்கத்தால் (3tanθ-tan³θ)/(1-3tan²θ) - பொது அடையாளம் ✓", x: 60, y: 200, color: "#1e293b", size: 15 },
          ],
        },
        {
          label: "8. வினா 8 - m,n மற்றும் x,y பிரதியீடுகள்",
          say: "(i) cosα=mcosβ, cosα=nsinβ. (m²+n²)cos²β = m²cos²β+n²cos²β = cos²α+n²cos²β. n²sin²β=cos²α என்பதால் cos²α=n²sin²β=n²(1-cos²β); எனவே cos²α+n²cos²β=n². (ii) x=cotθ+tanθ=1/(sinθcosθ), y=secθ-cosθ=sin²θ/cosθ. x²y=1/cos³θ ⇒ (x²y)^(2/3)=sec²θ. xy²=sin³θ/cos³θ ⇒ (xy²)^(2/3)=tan²θ. வித்தியாசம்=1.",
          ops: [
            { type: "text", value: "8(i) m²cos²β=cos²α; n²cos²β கூட்டி, cos²α=n²sin²β பயன்படுத்தி (m²+n²)cos²β=n² ✓", x: 60, y: 60, color: "#1e293b", size: 14 },
            { type: "text", value: "8(ii) x=1/(sinθcosθ), y=sin²θ/cosθ ⇒ x²y=1/cos³θ ⇒ (x²y)^⅔=sec²θ", x: 60, y: 150, color: "#1e293b", size: 15 },
            { type: "text", value: "xy²=sin³θ/cos³θ ⇒ (xy²)^⅔=tan²θ; sec²θ-tan²θ=1 ✓", x: 60, y: 210, color: "#1e293b", size: 15 },
          ],
        },
        {
          label: "9. வினா 9 - p,q மற்றும் cos⁶θ-4cos⁴θ+8cos²θ",
          say: "(i) p²=1+2sinθcosθ ⇒ p²-1=2sinθcosθ. q=secθ+cosecθ=(sinθ+cosθ)/(sinθcosθ)=p/(sinθcosθ). எனவே q(p²-1)=2p. (ii) sinθ(1+sin²θ)=cos²θ-ஐ வர்க்கமாக்கி c=cos²θ எனப் பிரதியிட்டால் c³-4c²+8c-4=0, அதாவது cos⁶θ-4cos⁴θ+8cos²θ=4.",
          ops: [
            { type: "text", value: "9(i) p²-1=2sinθcosθ; q=p/(sinθcosθ) ⇒ q(p²-1)=2p ✓", x: 60, y: 60, color: "#1e293b", size: 17 },
            { type: "text", value: "9(ii) கொடுக்கப்பட்டதை வர்க்கமாக்கி c=cos²θ எனில்:", x: 60, y: 140, color: "#1e293b", size: 17 },
            { type: "text", value: "(1-c)(2-c)²=c² ⇒ c³-4c²+8c-4=0 ⇒ cos⁶θ-4cos⁴θ+8cos²θ=4 ✓", x: 60, y: 200, color: "#1e293b", size: 15 },
          ],
        },
        {
          label: "10. வினா 10 - cosθ/(1+sinθ)=1/a",
          say: "a=(1+sinθ)/cosθ. a²=(1+sinθ)²/(1-sin²θ)=(1+sinθ)/(1-sinθ). a²-1=2sinθ/(1-sinθ), a²+1=2/(1-sinθ). வகுத்தால் (a²-1)/(a²+1)=sinθ.",
          ops: [
            { type: "text", value: "a=(1+sinθ)/cosθ ⇒ a²=(1+sinθ)/(1-sinθ) [cos²θ=(1-sinθ)(1+sinθ)]", x: 60, y: 60, color: "#1e293b", size: 17 },
            { type: "text", value: "a²-1=2sinθ/(1-sinθ);  a²+1=2/(1-sinθ)", x: 60, y: 140, color: "#1e293b", size: 18 },
            { type: "text", value: "(a²-1)/(a²+1) = sinθ ✓", x: 60, y: 200, color: "#1e293b", size: 20 },
          ],
        },
      ],
      questions: [
        { id: "ex6.1-q1", prompt: "cotθ+tanθ எதற்குச் சமம்?", options: ["secθ·cosecθ", "sec²θ", "1"], correctIndex: 0, explanation: "cotθ+tanθ = (cos²θ+sin²θ)/(sinθcosθ) = 1/(sinθcosθ) = secθcosecθ." },
        { id: "ex6.1-q2", prompt: "sec²θ - tan²θ = ?", options: ["1", "0", "secθtanθ"], correctIndex: 0, explanation: "இது அடிப்படை முக்கோணவியல் அடையாளம்: sec²θ-tan²θ=1." },
        { id: "ex6.1-q3", prompt: "tanθ+cotθ எந்த வடிவில் எழுதலாம்?", options: ["1/(sinθcosθ)", "sinθcosθ", "secθ+cosecθ"], correctIndex: 0, explanation: "tanθ+cotθ = sinθ/cosθ+cosθ/sinθ = (sin²θ+cos²θ)/(sinθcosθ) = 1/(sinθcosθ) = secθcosecθ." },
        { id: "ex6.1-q4", prompt: "sinθ+cosθ=√3 எனில் sinθcosθ எவ்வளவு?", options: ["1", "√3", "0"], correctIndex: 0, explanation: "வர்க்கமாக்க 1+2sinθcosθ=3 ⇒ sinθcosθ=1." },
      ],
    },

    {
      topicId: "பயிற்சி 6.2",
      title: "📘 பயிற்சி 6.2 - முழுத் தீர்வுகள் (உயரங்களும் தொலைவுகளும்)",
      scenes: [
        {
          label: "1,2. வினா 1,2 - கோபுரம், வீடுகள்",
          say: "1. tanθ=10√3/30 = 1/√3 ⇒ θ=30°. 2. பாதசாரி சாலையின் மையத்தில்; ஒவ்வொரு பக்கமும் அரைஅகலம் x. tan30°=4√3/x ⇒ x=4√3×√3=12மீ. சாலையின் முழு அகலம்=2×12=24மீ.",
          ops: [
            { type: "text", value: "1. tanθ = 10√3/30 = 1/√3 ⇒ θ = 30°", x: 60, y: 60, color: "#1e293b", size: 20 },
            { type: "text", value: "2. tan30° = 4√3/x ⇒ x = 4√3×√3 = 12மீ (அரைஅகலம்)", x: 60, y: 140, color: "#1e293b", size: 19 },
            { type: "text", value: "சாலையின் அகலம் = 2×12 = 24 மீ", x: 60, y: 200, color: "#1e293b", size: 20 },
          ],
        },
        {
          label: "3. வினா 3 - ஜன்னல் உயரம்",
          say: "கண் மட்டத்திலிருந்து 5மீ தொலைவில், ஜன்னல் உச்சிக்கு 60°, அடிக்கு 45°. h1=5tan60°=5√3=8.66மீ. h2=5tan45°=5மீ. ஜன்னல் உயரம் = h1-h2 = 5(√3-1) = 5×0.732 = 3.66மீ. (நபரின் 180செ.மீ உயரம் கண்மட்ட அடிப்படையைக் குறிக்கும், வித்தியாசத்தை பாதிக்காது.)",
          ops: [
            { type: "text", value: "h1 = 5tan60° = 5√3 = 8.66மீ (உச்சி);  h2 = 5tan45° = 5மீ (அடி)", x: 60, y: 60, color: "#1e293b", size: 18 },
            { type: "text", value: "ஜன்னல் உயரம் = h1-h2 = 5(√3-1) = 5×0.732 = 3.66 மீ", x: 60, y: 140, color: "#1e293b", size: 19 },
          ],
        },
        {
          label: "4. வினா 4 - சிலையின் பீடம்",
          say: "பீட உயரம் h, தொலைவு d. tan40°=h/d ⇒ d=h/0.8391. tan60°=(h+1.6)/d=√3. எனவே h+1.6=√3×(h/0.8391)=2.0639h. 1.6=1.0639h ⇒ h=1.6/1.0639≈1.50மீ.",
          ops: [
            { type: "text", value: "tan40°=h/d,  tan60°=(h+1.6)/d=√3", x: 60, y: 60, color: "#1e293b", size: 19 },
            { type: "text", value: "(h+1.6) = (√3/0.8391)h = 2.0639h ⇒ 1.6 = 1.0639h", x: 60, y: 140, color: "#1e293b", size: 19 },
            { type: "text", value: "பீட உயரம் h ≈ 1.50 மீ", x: 60, y: 200, color: "#1e293b", size: 20 },
          ],
        },
        {
          label: "5. வினா 5 - கொடிக்கம்பம் & குவிமாடம்",
          say: "7மீ தொலைவில் கொடிக்கம்பத்தின் உச்சிக்கு 45°: tan45°=(r+h)/7 ⇒ r+h=7. 12மீ தொலைவில் (7+5) அடிக்கு (குவிமாட உச்சி) 30°: tan30°=r/12 ⇒ r=12/√3=4√3≈6.93மீ. h=7-6.93≈0.07மீ.",
          ops: [
            { type: "text", value: "7மீ: tan45° = (r+h)/7 ⇒ r+h = 7", x: 60, y: 60, color: "#1e293b", size: 19 },
            { type: "text", value: "12மீ: tan30° = r/12 ⇒ r = 12/√3 = 4√3 ≈ 6.93 மீ", x: 60, y: 130, color: "#1e293b", size: 19 },
            { type: "text", value: "(i) கொடிக்கம்பம் h ≈ 0.07 மீ   (ii) குவிமாட ஆரம் r ≈ 6.93 மீ", x: 60, y: 200, color: "#1e293b", size: 17 },
          ],
        },
        {
          label: "6. வினா 6 - கோபுரமும் மின் கம்பமும்",
          say: "கோபுர உயரம் 15மீ. கம்பத்தின் அடியிலிருந்து (தரை) கோபுர உச்சிக்கு 60°: tan60°=15/d ⇒ d=15/√3=5√3. கம்பத்தின் உச்சியிலிருந்து (உயரம் h) அதே உச்சிக்கு 30°: tan30°=(15-h)/d ⇒ 15-h = d/√3 = 5. h=15-5=10மீ.",
          ops: [
            { type: "text", value: "அடியிலிருந்து: tan60°=15/d ⇒ d=5√3", x: 60, y: 60, color: "#1e293b", size: 19 },
            { type: "text", value: "உச்சியிலிருந்து: tan30°=(15-h)/d ⇒ 15-h = 5√3/√3 = 5", x: 60, y: 140, color: "#1e293b", size: 19 },
            { type: "text", value: "மின் கம்பத்தின் உயரம் h = 15-5 = 10 மீ", x: 60, y: 200, color: "#1e293b", size: 20 },
          ],
        },
      ],
      questions: [
        { id: "ex6.2-q1", prompt: "10√3மீ உயர கோபுரத்தை 30மீ தொலைவிலிருந்து பார்த்தால் ஏற்றக்கோணம்?", options: ["30°", "45°", "60°"], correctIndex: 0, explanation: "tanθ=10√3/30=1/√3 ⇒ θ=30°." },
        { id: "ex6.2-q2", prompt: "4√3மீ உயர வீடுகளை சாலை மையத்திலிருந்து 30° கோணத்தில் பார்த்தால் சாலை அகலம்?", options: ["24மீ", "12மீ", "8மீ"], correctIndex: 0, explanation: "அரைஅகலம்=4√3×√3=12மீ; முழு அகலம்=24மீ." },
        { id: "ex6.2-q3", prompt: "5மீ தொலைவில் உச்சிக்கு 60°, அடிக்கு 45° எனில் ஜன்னல் உயரம்?", options: ["5(√3-1) மீ", "5√3 மீ", "5 மீ"], correctIndex: 0, explanation: "h1-h2 = 5tan60°-5tan45° = 5(√3-1)." },
        { id: "ex6.2-q4", prompt: "கோபுர உயரம் 15மீ; கம்பத்தின் அடியிலிருந்து 60°, உச்சியிலிருந்து 30° எனில் கம்ப உயரம்?", options: ["10மீ", "5மீ", "15மீ"], correctIndex: 0, explanation: "d=5√3; 15-h=5 ⇒ h=10மீ." },
      ],
    },

    {
      topicId: "பயிற்சி 6.3",
      title: "📘 பயிற்சி 6.3 - முழுத் தீர்வுகள் (இறக்கக்கோணம்)",
      scenes: [
        {
          label: "1,2. வினா 1,2 - பாறை, கட்டடங்கள்",
          say: "1. tan30°=50√3/d ⇒ d=50√3×√3=150மீ. 2. இரண்டாம் கட்டடம் 120மீ; முதல் கட்டடத்தின் உச்சிக்கு 45° ஏற்றக்கோணம். tan45°=(h1-120)/70=1 ⇒ h1=190மீ.",
          ops: [
            { type: "text", value: "1. tan30° = 50√3/d ⇒ d = 50√3×√3 = 150 மீ", x: 60, y: 60, color: "#1e293b", size: 20 },
            { type: "text", value: "2. tan45° = (h₁-120)/70 = 1 ⇒ h₁ = 190 மீ", x: 60, y: 140, color: "#1e293b", size: 20 },
          ],
        },
        {
          label: "3. வினா 3 - கோபுரமும் விளக்குக் கம்பமும்",
          say: "கோபுர உயரம் 60மீ, தொலைவு d. அடிக்கு 60°: tan60°=60/d ⇒ d=60/√3=34.64மீ. உச்சிக்கு 38°: tan38°=(60-p)/d ⇒ 0.7813×34.64=27.07=60-p ⇒ p=32.93மீ.",
          ops: [
            { type: "text", value: "அடிக்கு: tan60°=60/d ⇒ d=60/√3=34.64மீ", x: 60, y: 60, color: "#1e293b", size: 19 },
            { type: "text", value: "உச்சிக்கு: tan38°=(60-p)/d ⇒ 60-p=0.7813×34.64=27.07", x: 60, y: 140, color: "#1e293b", size: 18 },
            { type: "text", value: "விளக்குக் கம்பத்தின் உயரம் p ≈ 32.93 மீ", x: 60, y: 210, color: "#1e293b", size: 20 },
          ],
        },
        {
          label: "4. வினா 4 - விமானமும் இரு படகுகளும்",
          say: "விமான உயரம் 1800மீ. d1=1800/tan60°=1800/√3=600√3=1039.2மீ. d2=1800/tan30°=1800√3=3117.6மீ. இரு படகுகளுக்கும் இடைப்பட்ட தொலைவு = d2-d1 = 1200√3 = 2078.4மீ.",
          ops: [
            { type: "text", value: "d₁ = 1800/tan60° = 600√3 = 1039.2மீ", x: 60, y: 60, color: "#1e293b", size: 19 },
            { type: "text", value: "d₂ = 1800/tan30° = 1800√3 = 3117.6மீ", x: 60, y: 130, color: "#1e293b", size: 19 },
            { type: "text", value: "தொலைவு = d₂-d₁ = 1200√3 ≈ 2078.4 மீ", x: 60, y: 200, color: "#1e293b", size: 20 },
          ],
        },
        {
          label: "5. வினா 5 - நிரூபணம் 4h/√3",
          say: "கலங்கரை விளக்கத்தின் உயரம் h. எதிரெதிர் பக்கங்களில் d1=h/tan30°=h√3, d2=h/tan60°=h/√3. மொத்த தொலைவு = d1+d2 = h√3+h/√3 = (3h+h)/√3 = 4h/√3. நிரூபிக்கப்பட்டது.",
          ops: [
            { type: "text", value: "d₁ = h/tan30° = h√3;   d₂ = h/tan60° = h/√3", x: 60, y: 60, color: "#1e293b", size: 19 },
            { type: "text", value: "தொலைவு = d₁+d₂ = h√3 + h/√3 = (3h+h)/√3 = 4h/√3 ✓", x: 60, y: 140, color: "#1e293b", size: 19 },
          ],
        },
        {
          label: "6. வினா 6 - மின் தூக்கி வேகம்",
          say: "நீரூற்று தொலைவு d=30√3 அடி (மாறாதது). உச்சியில் (90அடி) இறக்கக்கோணம் 60°: h1=d·tan60°=30√3×√3=90அடி (சரிபார்க்கிறது). 2 நிமிடம் கழித்து 30°: h2=d·tan30°=30√3×(1/√3)=30அடி. இறங்கிய தூரம்=90-30=60அடி/2நிமிடம் = 30 அடி/நிமிடம்.",
          ops: [
            { type: "text", value: "உச்சியில்: tan60°=h₁/30√3 ⇒ h₁=90 அடி (கட்டட உயரத்துடன் பொருந்துகிறது)", x: 60, y: 60, color: "#1e293b", size: 16 },
            { type: "text", value: "2நிமி பின்: tan30°=h₂/30√3 ⇒ h₂=30 அடி", x: 60, y: 140, color: "#1e293b", size: 18 },
            { type: "text", value: "வேகம் = (90-30)/2 = 30 அடி/நிமிடம்", x: 60, y: 200, color: "#1e293b", size: 20 },
          ],
        },
      ],
      questions: [
        { id: "ex6.3-q1", prompt: "50√3மீ உயர பாறையிலிருந்து 30° இறக்கக்கோணத்தில் பொருள் தெரிந்தால் தொலைவு?", options: ["150மீ", "50மீ", "100மீ"], correctIndex: 0, explanation: "tan30°=50√3/d ⇒ d=50√3×√3=150மீ." },
        { id: "ex6.3-q2", prompt: "கலங்கரை விளக்க உயரம் h; எதிரெதிர் பக்கத்தில் 30°,60° இறக்கக்கோணத்தில் கப்பல்கள் எனில் இடைவெளி?", options: ["4h/√3", "2h/√3", "h√3"], correctIndex: 0, explanation: "d1+d2 = h√3+h/√3 = 4h/√3." },
        { id: "ex6.3-q3", prompt: "1800மீ உயர விமானத்திலிருந்து படகுகளுக்கு 60°,30° இறக்கக்கோணம் எனில் படகுகளுக்கிடையே தொலைவு?", options: ["1200√3மீ", "600√3மீ", "1800√3மீ"], correctIndex: 0, explanation: "d2-d1 = 1800√3-600√3 = 1200√3மீ." },
        { id: "ex6.3-q4", prompt: "மின் தூக்கி 90அடியில் 60°, 2நிமி பின் 30° இறக்கக்கோணம், தொலைவு 30√3அடி எனில் வேகம்?", options: ["30 அடி/நிமிடம்", "60 அடி/நிமிடம்", "15 அடி/நிமிடம்"], correctIndex: 0, explanation: "h1=90, h2=30; வித்தியாசம் 60அடி/2நிமி = 30அடி/நிமி." },
      ],
    },

    {
      topicId: "பயிற்சி 6.4",
      title: "📘 பயிற்சி 6.4 - முழுத் தீர்வுகள் (ஏற்றம் + இறக்கம் கலந்தவை)",
      scenes: [
        {
          label: "1. வினா 1 - இரு மரங்கள்",
          say: "13மீ மரத்தின் உச்சியிலிருந்து இரண்டாம் மரத்தின் அடிக்கு 30° இறக்கம்: tan30°=13/d ⇒ d=13√3. உச்சிக்கு 45° ஏற்றம்: H-13=d=13√3 ⇒ H=13(1+√3)=13×2.732=35.52மீ.",
          ops: [
            { type: "text", value: "tan30°=13/d ⇒ d=13√3;   tan45°=(H-13)/d=1 ⇒ H-13=13√3", x: 60, y: 60, color: "#1e293b", size: 19 },
            { type: "text", value: "இரண்டாம் மரத்தின் உயரம் H = 13(1+√3) ≈ 35.52 மீ", x: 60, y: 140, color: "#1e293b", size: 20 },
          ],
        },
        {
          label: "2. வினா 2 - கப்பலும் குன்றும்",
          say: "கப்பலின் மேல்தளம் கடல்மட்டத்திலிருந்து 40மீ உயரம். குன்றின் அடிக்கு 30° இறக்கம்: tan30°=40/d ⇒ d=40√3≈69.28மீ. உச்சிக்கு 60° ஏற்றம்: H-40=d√3=40×3=120 ⇒ H=160மீ.",
          ops: [
            { type: "text", value: "tan30°=40/d ⇒ d=40√3≈69.28மீ (கப்பலிலிருந்து தொலைவு)", x: 60, y: 60, color: "#1e293b", size: 18 },
            { type: "text", value: "tan60°=(H-40)/d ⇒ H-40=40√3×√3=120 ⇒ H=160மீ", x: 60, y: 140, color: "#1e293b", size: 18 },
            { type: "text", value: "குன்றின் உயரம் = 160 மீ", x: 60, y: 210, color: "#1e293b", size: 20 },
          ],
        },
        {
          label: "3. வினா 3 - மேகமும் ஏரியும் (நிரூபணம்)",
          say: "புள்ளியின் உயரம் h, மேகத்தின் உயரம் H, தொலைவு d. ஏற்றம்: tanθ1=(H-h)/d. பிம்பத்தின் இறக்கம் (பிம்பம் நீர்மட்டத்திற்குக் கீழே H ஆழத்தில்): tanθ2=(H+h)/d. இரண்டையும் சமன்படுத்தி H(tanθ2-tanθ1)=h(tanθ1+tanθ2) ⇒ H=h(tanθ1+tanθ2)/(tanθ2-tanθ1).",
          ops: [
            { type: "text", value: "tanθ₁=(H-h)/d,   tanθ₂=(H+h)/d  [பிம்பம் நீருக்குக் கீழே H ஆழத்தில்]", x: 60, y: 60, color: "#1e293b", size: 16 },
            { type: "text", value: "d சமன்படுத்த: (H-h)/tanθ₁=(H+h)/tanθ₂", x: 60, y: 140, color: "#1e293b", size: 18 },
            { type: "text", value: "H(tanθ₂-tanθ₁)=h(tanθ₁+tanθ₂) ⇒ H = h(tanθ₁+tanθ₂)/(tanθ₂-tanθ₁) ✓", x: 60, y: 210, color: "#1e293b", size: 16 },
          ],
        },
        {
          label: "4. வினா 4 - அலைபேசிக் கோபுரம்",
          say: "அடுக்குமாடி உயரம் 50மீ. அடியிலிருந்து கோபுர உச்சிக்கு 60°: tan60°=T/d ⇒ d=T/√3. உச்சியிலிருந்து கோபுர அடிக்கு 30°: tan30°=50/d ⇒ d=50√3. சமன்படுத்த T=50√3×√3=150மீ. 150≥120மீ என்பதால் கட்டுப்பாட்டிற்கு உட்படுகிறது.",
          ops: [
            { type: "text", value: "d = T/√3 (அடியிலிருந்து) = 50√3 (உச்சியிலிருந்து)", x: 60, y: 60, color: "#1e293b", size: 18 },
            { type: "text", value: "T = 50√3×√3 = 150 மீ", x: 60, y: 140, color: "#1e293b", size: 20 },
            { type: "text", value: "150மீ ≥ 120மீ குறைந்தபட்ச உயரம் ⇒ ஆம், கட்டுப்பாட்டிற்கு உட்படுகிறது ✓", x: 60, y: 200, color: "#1e293b", size: 16 },
          ],
        },
        {
          label: "5. வினா 5 - அடுக்குமாடியும் விளக்குக் கம்பமும்",
          say: "அடுக்குமாடி உயரம் 66மீ. அடிக்கு 30°: d=66/tan30°=66√3≈114.3மீ. உச்சிக்கு 60°: L-66=d√3=66√3×√3=198 ⇒ L=264மீ. (i) L=264மீ (ii) வித்தியாசம்=198மீ (iii) தொலைவு=114.3மீ.",
          ops: [
            { type: "text", value: "d=66/tan30°=66√3≈114.3மீ;  L-66=d×√3=198 ⇒ L=264மீ", x: 60, y: 60, color: "#1e293b", size: 17 },
            { type: "text", value: "(i) விளக்குக் கம்ப உயரம் = 264 மீ", x: 60, y: 140, color: "#1e293b", size: 19 },
            { type: "text", value: "(ii) உயர வித்தியாசம் = 198மீ   (iii) தொலைவு ≈ 114.3மீ", x: 60, y: 200, color: "#1e293b", size: 17 },
          ],
        },
        {
          label: "6. வினா 6 - மூன்று கிராமவாசிகள்",
          say: "AB=8கி.மீ, BC=12கி.மீ. A-லிருந்து B-க்கு இறக்கக்கோணம் 20°: உயர வித்தியாசம் = 8×tan20° = 8×0.3640 = 2.912கி.மீ. B-லிருந்து C-க்கு ஏற்றக்கோணம் 30°: உயர வித்தியாசம் = 12×tan30° = 12/1.732 = 6.93கி.மீ.",
          ops: [
            { type: "text", value: "(i) A,B செங்குத்து உயரம் = 8×tan20° = 8×0.3640 = 2.912 கி.மீ", x: 60, y: 60, color: "#1e293b", size: 18 },
            { type: "text", value: "(ii) B,C செங்குத்து உயரம் = 12×tan30° = 12/1.732 ≈ 6.93 கி.மீ", x: 60, y: 140, color: "#1e293b", size: 18 },
          ],
        },
      ],
      questions: [
        { id: "ex6.4-q1", prompt: "13மீ மரத்திலிருந்து 30° இறக்கமும் இரண்டாம் மரத்திற்கு 45° ஏற்றமும் எனில் இரண்டாம் மரத்தின் உயரம்?", options: ["13(1+√3) மீ", "13√3 மீ", "26 மீ"], correctIndex: 0, explanation: "d=13√3; H=13+13√3=13(1+√3)." },
        { id: "ex6.4-q2", prompt: "மேகமும் அதன் ஏரிப் பிம்பமும் கொண்ட வினாவில் பிம்பத்தின் இறக்கக்கோணத்திற்கான தொலைவு சூத்திரம்?", options: ["tanθ₂=(H+h)/d", "tanθ₂=(H-h)/d", "tanθ₂=H/d"], correctIndex: 0, explanation: "பிம்பம் நீர்மட்டத்திற்குக் கீழே H ஆழத்தில் இருப்பதால் புள்ளியிலிருந்து மொத்த செங்குத்துத் தொலைவு H+h." },
        { id: "ex6.4-q3", prompt: "அடுக்குமாடி 50மீ; அடியிலிருந்து கோபுர உச்சிக்கு 60°, உச்சியிலிருந்து அடிக்கு 30° எனில் கோபுர உயரம்?", options: ["150மீ", "100மீ", "50√3மீ"], correctIndex: 0, explanation: "T/√3=50√3 ⇒ T=150மீ." },
        { id: "ex6.4-q4", prompt: "AB=8கி.மீ தொலைவில் இறக்கக்கோணம் 20° எனில் உயர வித்தியாசம்?", options: ["8×tan20°", "8/tan20°", "8×sin20°"], correctIndex: 0, explanation: "உயரம் = கிடைதூரம்×tanகோணம் = 8×tan20°." },
      ],
    },

    {
      topicId: "பயிற்சி 6.5",
      title: "📘 பயிற்சி 6.5 - முழுத் தீர்வுகள் (பலவுள் தெரிவு - முற்றொருமைகள்)",
      scenes: [
        {
          label: "1,2. வினா 1,2",
          say: "1. sin²θ + 1/(1+tan²θ) = sin²θ + cos²θ = 1 (ஆ). 2. tanθ·cosec²θ - tanθ = tanθ(cosec²θ-1) = tanθ·cot²θ = cotθ (ஈ).",
          ops: [
            { type: "text", value: "1. sin²θ + 1/(1+tan²θ) = sin²θ + cos²θ = 1   விடை: (ஆ) 1", x: 60, y: 60, color: "#1e293b", size: 19 },
            { type: "text", value: "2. tanθcosec²θ-tanθ = tanθ(cosec²θ-1) = tanθcot²θ = cotθ   விடை: (ஈ) cotθ", x: 60, y: 140, color: "#1e293b", size: 17 },
          ],
        },
        {
          label: "3,4. வினா 3,4",
          say: "3. (sinα+cosecα)²+(cosα+secα)² விரிவாக்கி 1+2sinαcosecα+cosec²α+1+2cosαsecα+sec²α = 2+2+2+tan²α+cot²α = k+tan²α+cot²α ⇒ k=7 (ஆ). 4. sinθ+cosθ=a, secθ+cosecθ=b ⇒ b(a²-1)=2a (ஏற்கனவே நிரூபித்தது) (அ) 2a.",
          ops: [
            { type: "text", value: "3. (sinα+cosecα)²+(cosα+secα)² = 7+tan²α+cot²α   விடை: (ஆ) 7", x: 60, y: 60, color: "#1e293b", size: 17 },
            { type: "text", value: "4. b(a²-1) = 2a  [பயிற்சி 6.1, வினா 9(i) படி]   விடை: (அ) 2a", x: 60, y: 140, color: "#1e293b", size: 18 },
          ],
        },
        {
          label: "5,6. வினா 5,6",
          say: "5. 5x=secθ ⇒ x²=sec²θ/25. 5/y=tanθ ⇒ 1/y²=tan²θ/25. x²-1/y²=(sec²θ-tan²θ)/25=1/25 (ஆ). 6. sinθ=cosθ ⇒ θ=45°. 2tan²45°+sin²45°-1 = 2+0.5-1=1.5=3/2 (ஆ).",
          ops: [
            { type: "text", value: "5. x²-1/y² = (sec²θ-tan²θ)/25 = 1/25   விடை: (ஆ) 1/25", x: 60, y: 60, color: "#1e293b", size: 18 },
            { type: "text", value: "6. θ=45°: 2(1)²+(1/√2)²-1 = 2+0.5-1 = 3/2   விடை: (ஆ) 3/2", x: 60, y: 140, color: "#1e293b", size: 18 },
          ],
        },
        {
          label: "7,8. வினா 7,8",
          say: "7. x=atanθ ⇒ x²/a²=tan²θ. y=bsecθ ⇒ y²/b²=sec²θ. y²/b²-x²/a²=sec²θ-tan²θ=1 (அ). 8. (1+tanθ+secθ)(1+cotθ-cosecθ) = [(c+s+1)/c][(s+c-1)/s] = [(s+c)²-1]/(sc) = 2sc/sc = 2 (இ).",
          ops: [
            { type: "text", value: "7. y²/b² - x²/a² = sec²θ-tan²θ = 1   விடை: (அ) y²/b²-x²/a²=1", x: 60, y: 60, color: "#1e293b", size: 17 },
            { type: "text", value: "8. [(sinθ+cosθ+1)(sinθ+cosθ-1)]/(sinθcosθ) = 2sinθcosθ/sinθcosθ = 2   விடை: (இ) 2", x: 60, y: 140, color: "#1e293b", size: 16 },
          ],
        },
        {
          label: "9,10. வினா 9,10",
          say: "9. p-q=(a-b)(cotθ-cosecθ), p+q=(a+b)(cotθ+cosecθ). p²-q²=(a²-b²)(cot²θ-cosec²θ)=(a²-b²)(-1)=b²-a² (ஆ). 10. உயரம்:நிழல்=√3:1 ⇒ tanθ=√3 ⇒ θ=60° (ஈ).",
          ops: [
            { type: "text", value: "9. p²-q² = (a²-b²)(cot²θ-cosec²θ) = -(a²-b²) = b²-a²   விடை: (ஆ) b²-a²", x: 60, y: 60, color: "#1e293b", size: 17 },
            { type: "text", value: "10. tanθ=√3 ⇒ θ=60°   விடை: (ஈ) 60°", x: 60, y: 140, color: "#1e293b", size: 19 },
          ],
        },
        {
          label: "11,12. வினா 11,12",
          say: "11. அடியிலிருந்து: tan30°=H/d ⇒ d=H√3. b உயரத்திலிருந்து: tan60°=b/d ⇒ d=b/√3. சமன்படுத்த H√3=b/√3 ⇒ H=b/3 (ஆ). 12. நிழல் வித்தியாசம் = 60/tan30° - 60/tan45° = 60√3-60 = 103.92-60 = 43.92மீ (ஆ).",
          ops: [
            { type: "text", value: "11. H√3 = b/√3 ⇒ H = b/3   விடை: (ஆ) b/3", x: 60, y: 60, color: "#1e293b", size: 18 },
            { type: "text", value: "12. x = 60√3-60 = 60(1.732-1) = 43.92மீ   விடை: (ஆ) 43.92 மீ", x: 60, y: 140, color: "#1e293b", size: 17 },
          ],
        },
        {
          label: "13,14. வினா 13,14",
          say: "13. அடிக்கு 60°: d=H/√3. உச்சிக்கு(20மீ) 30°: H-20=d/√3=H/3 ⇒ H=30. d=30/√3=10√3 (ஈ). 14. tanα·tanβ=1 (நிரப்புக்கோணங்கள்); (4h/x)(2h/x)=1 ⇒ h²=x²/8 ⇒ h=x/(2√2) (ஆ).",
          ops: [
            { type: "text", value: "13. H-20=H/3 ⇒ H=30மீ; d=30/√3=10√3மீ   விடை: (ஈ) 30, 10√3", x: 60, y: 60, color: "#1e293b", size: 17 },
            { type: "text", value: "14. (4h/x)(2h/x)=1 ⇒ h=x/(2√2)   விடை: (ஆ) x/(2√2)", x: 60, y: 140, color: "#1e293b", size: 18 },
          ],
        },
        {
          label: "15. வினா 15",
          say: "மேக உயரம் H, தொலைவு d. tanβ=(H-h)/d. tan45°=(H+h)/d=1 ⇒ d=H+h. tanβ(H+h)=H-h ⇒ H(tanβ-1)=-h(1+tanβ) ⇒ H=h(1+tanβ)/(1-tanβ) (அ).",
          ops: [
            { type: "text", value: "d=H+h [45° இறக்கம்];  tanβ=(H-h)/(H+h)", x: 60, y: 60, color: "#1e293b", size: 19 },
            { type: "text", value: "H = h(1+tanβ)/(1-tanβ)   விடை: (அ) h(1+tanβ)/(1-tanβ)", x: 60, y: 140, color: "#1e293b", size: 19 },
          ],
        },
      ],
      questions: [
        { id: "ex6.5-q1", prompt: "sin²θ + 1/(1+tan²θ) = ?", options: ["1", "tan²θ", "0"], correctIndex: 0, explanation: "1/(1+tan²θ)=cos²θ; sin²θ+cos²θ=1." },
        { id: "ex6.5-q2", prompt: "tanθcosec²θ - tanθ = ?", options: ["cotθ", "secθ", "sinθ"], correctIndex: 0, explanation: "tanθ(cosec²θ-1)=tanθcot²θ=cotθ." },
        { id: "ex6.5-q3", prompt: "(sinα+cosecα)²+(cosα+secα)² = k+tan²α+cot²α எனில் k?", options: ["7", "9", "5"], correctIndex: 0, explanation: "விரிவாக்கினால் 2+2sinαcosecα+2cosαsecα = 2+2+2=... k=7 கிடைக்கும்." },
        { id: "ex6.5-q4", prompt: "sinθ+cosθ=a, secθ+cosecθ=b எனில் b(a²-1) = ?", options: ["2a", "3a", "0"], correctIndex: 0, explanation: "a²-1=2sinθcosθ; b=a/(sinθcosθ) ⇒ b(a²-1)=2a." },
      ],
    },

    {
      topicId: "அலகுப் பயிற்சி 6",
      title: "📘 அலகுப் பயிற்சி 6 - முழுத் தீர்வுகள் (இயல் மதிப்பீடு)",
      scenes: [
        {
          label: "1. வினா 1 - நிரூபணங்கள்",
          say: "(i) cot²A[(secA-1)/(1+sinA)] முதல் உறுப்பு cosA/[(1+cosA)(1+sinA)] ஆகவும், sec²A[(sinA-1)/(1+secA)] இரண்டாம் உறுப்பு (sinA-1)/[cosA(1+cosA)] ஆகவும் எளிமையாகும்; கூட்டல் பகுதியில் cos²A-cos²A=0. (ii) tan²θ+1=sec²θ; (sec²θ-2)/sec²θ=1-2cos²θ.",
          ops: [
            { type: "text", value: "1(i) இரு உறுப்புகளும் 1/(1+cosA) × [cosA/(1+sinA)+(sinA-1)/cosA] என தொகுக்கலாம்", x: 60, y: 60, color: "#1e293b", size: 15 },
            { type: "text", value: "எண் = cos²A+(sinA-1)(1+sinA) = cos²A-cos²A = 0 ✓", x: 60, y: 130, color: "#1e293b", size: 17 },
            { type: "text", value: "1(ii) (tan²θ-1)/(tan²θ+1) = (sec²θ-2)/sec²θ = 1-2cos²θ ✓", x: 60, y: 200, color: "#1e293b", size: 17 },
          ],
        },
        {
          label: "2. வினா 2 - அரைக்கோணப் பதிலீடு",
          say: "t=tan(θ/2) எனில் sinθ=2t/(1+t²), cosθ=(1-t²)/(1+t²). (1+sinθ-cosθ)=2t(1+t)/(1+t²), (1+sinθ+cosθ)=2(1+t)/(1+t²). விகிதம்=t=tan(θ/2). வர்க்கமாக்க tan²(θ/2)=(1-cosθ)/(1+cosθ) [அரைக்கோண அடையாளம்].",
          ops: [
            { type: "text", value: "t=tan(θ/2) எனில்: (1+sinθ-cosθ)/(1+sinθ+cosθ) = t = tan(θ/2)", x: 60, y: 60, color: "#1e293b", size: 17 },
            { type: "text", value: "வர்க்கமாக்க: tan²(θ/2) = (1-cosθ)/(1+cosθ) - அரைக்கோண அடையாளம் ✓", x: 60, y: 140, color: "#1e293b", size: 17 },
          ],
        },
        {
          label: "3. வினா 3 - x²+y²=1",
          say: "xsinθ=ycosθ=k எனில் x=k/sinθ, y=k/cosθ. கொடுக்கப்பட்ட சமன்பாட்டில் பிரதியிட: k sin²θ+k cos²θ=sinθcosθ ⇒ k=sinθcosθ. எனவே x=cosθ, y=sinθ. x²+y²=cos²θ+sin²θ=1.",
          ops: [
            { type: "text", value: "xsinθ=ycosθ=k ⇒ x=k/sinθ, y=k/cosθ", x: 60, y: 60, color: "#1e293b", size: 19 },
            { type: "text", value: "பிரதியிட: k=sinθcosθ ⇒ x=cosθ, y=sinθ ⇒ x²+y²=1 ✓", x: 60, y: 140, color: "#1e293b", size: 18 },
          ],
        },
        {
          label: "4. வினா 4 - ±√(a²+b²-c²)",
          say: "(acosθ-bsinθ)²+(asinθ+bcosθ)² = a²+b² (விரிவாக்கி, குறுக்கு உறுப்புகள் நீக்கம்). c²+(asinθ+bcosθ)²=a²+b² ⇒ (asinθ+bcosθ)²=a²+b²-c² ⇒ asinθ+bcosθ=±√(a²+b²-c²).",
          ops: [
            { type: "text", value: "(acosθ-bsinθ)² + (asinθ+bcosθ)² = a²+b²  [cross terms நீக்கம்]", x: 60, y: 60, color: "#1e293b", size: 17 },
            { type: "text", value: "c² + (asinθ+bcosθ)² = a²+b² ⇒ asinθ+bcosθ = ±√(a²+b²-c²) ✓", x: 60, y: 140, color: "#1e293b", size: 17 },
          ],
        },
        {
          label: "5. வினா 5 - பறவையின் வேகம்",
          say: "மரம் 80மீ. முதலில் 45°: d1=80/tan45°=80மீ. 2 வினாடி பின் 30°: d2=80/tan30°=80√3=138.56மீ. பறந்த தொலைவு=138.56-80=58.56மீ. வேகம்=58.56/2=29.28 மீ/வி.",
          ops: [
            { type: "text", value: "d₁=80/tan45°=80மீ;  d₂=80/tan30°=80√3≈138.56மீ", x: 60, y: 60, color: "#1e293b", size: 19 },
            { type: "text", value: "வேகம் = (138.56-80)/2 = 29.28 மீ/வி", x: 60, y: 140, color: "#1e293b", size: 20 },
          ],
        },
        {
          label: "6. வினா 6 - விமானத்திற்கான நேரம்",
          say: "விமான உயரம் 600மீ. 37°-ல்: d1=600/0.7536=796.18மீ. 53°-ல்: d2=600/1.3270=452.15மீ. கடந்த தொலைவு=796.18-452.15=344.03மீ. நேரம்=344.03/175≈1.97 வினாடி.",
          ops: [
            { type: "text", value: "d₁=600/tan37°=796.18மீ;  d₂=600/tan53°=452.15மீ", x: 60, y: 60, color: "#1e293b", size: 18 },
            { type: "text", value: "தேவையான நேரம் = (796.18-452.15)/175 ≈ 1.97 வினாடி", x: 60, y: 140, color: "#1e293b", size: 18 },
          ],
        },
        {
          label: "7. வினா 7 - திசைகோண வினா",
          say: "AB=30கி.மீ, 35° கோணம் (cos35°=sin55°=0.8192, sin35°=cos55°=0.5736). வடக்கு கூறு=30×0.8192=24.58கி.மீ, மேற்கு கூறு=30×0.5736=17.21கி.மீ. BC=32கி.மீ, 48° கோணம் (cos48°=sin42°=0.6691, sin48°=cos42°=0.7431). வடக்கு கூறு=32×0.6691=21.41கி.மீ, கிழக்கு கூறு=32×0.7431=23.78கி.மீ.",
          ops: [
            { type: "text", value: "(i) A-க்கு வடக்கு B தொலைவு = 30cos35° = 30×0.8192 ≈ 24.58 கி.மீ", x: 60, y: 50, color: "#1e293b", size: 15 },
            { type: "text", value: "(ii) A-க்கு மேற்கு B தொலைவு = 30sin35° = 30×0.5736 ≈ 17.21 கி.மீ", x: 60, y: 110, color: "#1e293b", size: 15 },
            { type: "text", value: "(iii) B-க்கு வடக்கு C தொலைவு = 32cos48° = 32×0.6691 ≈ 21.41 கி.மீ", x: 60, y: 170, color: "#1e293b", size: 15 },
            { type: "text", value: "(iv) B-க்கு கிழக்கு C தொலைவு = 32sin48° = 32×0.7431 ≈ 23.78 கி.மீ", x: 60, y: 230, color: "#1e293b", size: 15 },
          ],
        },
        {
          label: "8. வினா 8 - கலங்கரை விளக்கமும் இரு கப்பல்களும்",
          say: "d1=h/tan60°=h/√3, d2=h/tan45°=h. மொத்தத் தொலைவு=h/√3+h=h(1+√3)/√3. இது 200(√3+1)/√3 -க்குச் சமம் என்பதால் h=200மீ.",
          ops: [
            { type: "text", value: "d₁+d₂ = h(1+√3)/√3 = 200(√3+1)/√3", x: 60, y: 60, color: "#1e293b", size: 19 },
            { type: "text", value: "கலங்கரை விளக்கத்தின் உயரம் h = 200 மீ", x: 60, y: 140, color: "#1e293b", size: 20 },
          ],
        },
        {
          label: "9. வினா 9 - சிலையின் உயரம்",
          say: "கட்டடமும் சிலையும் 35மீ இடைவெளி. கட்டட உயரம் B: tan34°=B/35 ⇒ B=35×0.6745=23.61மீ. சிலை உச்சிக்கு 24° ஏற்றம்: S-B=35×0.4452=15.58மீ ⇒ S=23.61+15.58=39.19மீ.",
          ops: [
            { type: "text", value: "கட்டட உயரம்: tan34°=B/35 ⇒ B=35×0.6745=23.61மீ", x: 60, y: 60, color: "#1e293b", size: 18 },
            { type: "text", value: "S-B=35×tan24°=35×0.4452=15.58மீ", x: 60, y: 140, color: "#1e293b", size: 18 },
            { type: "text", value: "சிலையின் உயரம் S = 23.61+15.58 ≈ 39.19 மீ", x: 60, y: 200, color: "#1e293b", size: 20 },
          ],
        },
      ],
      questions: [
        { id: "u6-q1", prompt: "(tan²θ-1)/(tan²θ+1) எளிமையாக்கினால்?", options: ["1-2cos²θ", "2cos²θ-1", "sin²θ"], correctIndex: 0, explanation: "tan²θ+1=sec²θ; (sec²θ-2)/sec²θ=1-2cos²θ." },
        { id: "u6-q2", prompt: "acosθ-bsinθ=c எனில் asinθ+bcosθ எதற்குச் சமம்?", options: ["±√(a²+b²-c²)", "a²+b²-c²", "c"], correctIndex: 0, explanation: "இரு வெளிப்பாடுகளின் வர்க்கங்களைக் கூட்ட a²+b² கிடைக்கும்; எனவே வர்க்கமூலம் எடுக்க வேண்டும்." },
        { id: "u6-q3", prompt: "80மீ மரத்தில் பறவை; 45°-ல் இருந்து 2வி பின் 30° ஆக மாறினால் வேகம் என்ன?", options: ["29.28 மீ/வி", "40 மீ/வி", "58.56 மீ/வி"], correctIndex: 0, explanation: "தொலைவு வித்தியாசம் 58.56மீ, 2 வினாடியில்; வேகம்=29.28மீ/வி." },
        { id: "u6-q4", prompt: "கலங்கரை விளக்கத்தின் உயரம் h; இரு கப்பல்களுக்கு 60°,45° இறக்கம், தொலைவு h(1+√3)/√3 எனில் இது எதைக் குறிக்கிறது?", options: ["d1+d2 இன் தொகை சூத்திரம்", "d1-d2", "h மட்டும்"], correctIndex: 0, explanation: "d1=h/√3, d2=h; கூட்டல் h(1+√3)/√3." },
      ],
    },
  ],
};
