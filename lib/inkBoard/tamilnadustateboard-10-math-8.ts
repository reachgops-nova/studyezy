import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * TN Samacheer Kalvi Std 10 Maths (Tamil medium), Unit 8 (புள்ளியியலும்
 * நிகழ்தகவும் - Statistics and Probability): 8.1 standard deviation,
 * 8.2 probability. Added 2026-10-26. Last unit of the TN 10 Math
 * curriculum - completes the full-year syllabus alongside Unit 1-7.
 */
export const TAMILNADU_10_MATH_8: InkUnit = {
  unitKey: "tamilnadustateboard-10-math-8",
  title: "புள்ளியியலும் நிகழ்தகவும் (Statistics and Probability)",
  badge: "10 ஆம் வகுப்பு · இயல் 8",
  languageCode: "ta-IN",

  topics: [
    {
      topicId: "8.1",
      title: "திட்ட விலகல்",
      scenes: [
        {
          label: "1. திட்ட விலகல் என்றால் என்ன",
          say: "தரவுகள் சராசரியிலிருந்து எவ்வளவு பரவியுள்ளன என்பதை அளப்பது திட்ட விலகல் (standard deviation) σ. திட்ட விலகல் குறைவாக இருந்தால் தரவுகள் சராசரிக்கு அருகில் இருக்கும்.",
          ops: [
            { type: "text", value: "திட்ட விலகல் (Standard Deviation)", x: 80, y: 60, color: "#df4da8", size: 26 },
            { type: "box", x: 150, y: 140, w: 600, h: 110, color: "#39247f", label: "σ = √[Σ(x-x̄)²/n]", labelSize: 32 },
            { type: "text", value: "x̄ = சராசரி, n = தரவுகளின் எண்ணிக்கை", x: 80, y: 290, color: "#64748b", size: 22 },
          ],
        },
        {
          label: "2. கணக்கிடும் முறை",
          say: "2,4,6,8,10 தரவுகளின் திட்ட விலகலைக் காண்போம். முதலில் சராசரி x̄ = (2+4+6+8+10)/5 = 6. விலகல்கள்: -4,-2,0,2,4. வர்க்கங்கள்: 16,4,0,4,16, கூடுதல்=40. σ = √(40/5) = √8 ≈ 2.83.",
          ops: [
            { type: "text", value: "எடுத்துக்காட்டு: 2,4,6,8,10", x: 80, y: 60, color: "#df4da8", size: 26 },
            { type: "box", x: 80, y: 140, w: 300, h: 90, color: "#188e69", label: "x̄ = 6", labelSize: 28 },
            { type: "box", x: 420, y: 140, w: 400, h: 90, color: "#188e69", label: "Σ(x-x̄)² = 40", labelSize: 22 },
            { type: "text", value: "σ = √(40/5) = √8 ≈ 2.83", x: 80, y: 280, color: "#39247f", size: 26 },
          ],
        },
        {
          label: "3. வேறுபாடு (variance)",
          say: "திட்ட விலகலின் வர்க்கமே வேறுபாடு (variance) - variance = σ². மேலுள்ள உதாரணத்தில் variance = 8.",
          ops: [
            { type: "text", value: "வேறுபாடு (Variance) = σ²", x: 80, y: 60, color: "#df4da8", size: 28 },
            { type: "box", x: 80, y: 140, w: 500, h: 110, color: "#39247f", label: "variance = σ² = (√8)² = 8", labelSize: 24 },
          ],
        },
        {
          label: "4. 💡 திட்ட விலகலைக் கணக்கிடும் உத்தி",
          say: "நான்கு படிகளை நினைவில் வையுங்கள் - 1) சராசரி காண், 2) ஒவ்வொரு தரவும் சராசரியிலிருந்து எவ்வளவு விலகுகிறது எனக் காண், 3) விலகல்களை வர்க்கப்படுத்தி கூட்டு, 4) தரவுகளின் எண்ணிக்கையால் வகுத்து வர்க்கமூலம் எடு.",
          ops: [
            { type: "text", value: "💡 உத்தி: சரா - விலகு - வர்க்கி - மூலி", x: 80, y: 60, color: TIP_COLOR, size: 24 },
            { type: "box", x: 80, y: 140, w: 250, h: 90, color: TIP_COLOR, label: "1. சராசரி", labelSize: 20 },
            { type: "box", x: 350, y: 140, w: 250, h: 90, color: TIP_COLOR, label: "2. விலகல்", labelSize: 20 },
            { type: "box", x: 620, y: 140, w: 250, h: 90, color: TIP_COLOR, label: "3. வர்க்கப்படுத்தி கூட்டு", labelSize: 16 },
            { type: "box", x: 890, y: 140, w: 220, h: 90, color: TIP_COLOR, label: "4. ÷n, √", labelSize: 20 },
          ],
        },
        {
          label: "5. ✍️ எழுதித் தீர்ப்போம்",
          say: "இப்போது நீங்கள் தீர்க்க வேண்டும். இந்த தரவுத் தொகுப்புகளுக்கு திட்ட விலகலை உங்கள் நோட்டுப் புத்தகத்தில் கணக்கிடுங்கள்.",
          ops: [
            { type: "text", value: "✍️ எழுதித் தீர்ப்போம் - மேலும் எடுத்துக்காட்டுகள்", x: 80, y: 50, color: PRACTICE_COLOR, size: 22 },
            { type: "box", x: 80, y: 130, w: 500, h: 110, color: PRACTICE_COLOR, label: "1. 3,5,7,9,11 இன் திட்ட விலகல் σ=?", labelSize: 20 },
            { type: "box", x: 80, y: 260, w: 500, h: 110, color: PRACTICE_COLOR, label: "2. 10,10,10,10 இன் திட்ட விலகல் σ=?", labelSize: 20 },
            { type: "text", value: "விடை: 1) σ=√8≈2.83   2) σ=0 (அனைத்தும் சமம்)", x: 80, y: 390, color: "#64748b", size: 18 },
          ],
        },
      ],
      questions: [
        { id: "8.1i-q1", prompt: "திட்ட விலகல் என்றால் என்ன?", options: ["தரவுகள் சராசரியிலிருந்து எவ்வளவு பரவியுள்ளன என்பதன் அளவு", "தரவுகளின் கூடுதல்", "தரவுகளின் எண்ணிக்கை"], correctIndex: 0, explanation: "திட்ட விலகல் தரவுகளின் பரவலை அளக்கிறது." },
        { id: "8.1i-q2", prompt: "2,4,6,8,10 தரவுகளின் சராசரி x̄?", options: ["6", "5", "8"], correctIndex: 0, explanation: "(2+4+6+8+10)/5 = 30/5 = 6." },
        { id: "8.1i-q3", prompt: "வேறுபாடு (variance) என்றால் என்ன?", options: ["திட்ட விலகலின் வர்க்கம்", "சராசரியின் வர்க்கம்", "தரவுகளின் கூடுதல்"], correctIndex: 0, explanation: "variance = σ²." },
        { id: "8.1i-q4", prompt: "அனைத்து தரவுகளும் சமமாக இருந்தால் திட்ட விலகல் என்ன ஆகும்?", options: ["0", "1", "முடிவிலி"], correctIndex: 0, explanation: "விலகல் இல்லாததால் σ=0 ஆகும்." },
      ],
    },
    {
      topicId: "8.2",
      title: "நிகழ்தகவு",
      scenes: [
        {
          label: "1. நிகழ்தகவு என்றால் என்ன",
          say: "ஒரு நிகழ்வு நடக்கும் வாய்ப்பை அளவிடுவது நிகழ்தகவு (probability). P(E) = சாதகமான விளைவுகளின் எண்ணிக்கை / மொத்த விளைவுகளின் எண்ணிக்கை. 0 ≤ P(E) ≤ 1.",
          ops: [
            { type: "text", value: "நிகழ்தகவு (Probability)", x: 80, y: 60, color: "#df4da8", size: 28 },
            { type: "box", x: 150, y: 140, w: 600, h: 110, color: "#39247f", label: "P(E) = சாதக விளைவுகள் / மொத்த விளைவுகள்", labelSize: 20 },
            { type: "text", value: "0 ≤ P(E) ≤ 1", x: 80, y: 290, color: "#64748b", size: 26 },
          ],
        },
        {
          label: "2. பகடை உதாரணம்",
          say: "ஒரு பகடையை உருட்டும்போது இரட்டை எண் வரும் நிகழ்தகவு காண்போம். சாதகமான விளைவுகள் = {2,4,6} = 3. மொத்த விளைவுகள் = {1,2,3,4,5,6} = 6. P = 3/6 = 1/2.",
          ops: [
            { type: "text", value: "உதாரணம்: பகடையில் இரட்டை எண்", x: 80, y: 60, color: "#df4da8", size: 26 },
            { type: "box", x: 80, y: 140, w: 500, h: 110, color: "#188e69", label: "சாதகம்={2,4,6}=3, மொத்தம்=6 ⇒ P=3/6=1/2", labelSize: 18 },
          ],
        },
        {
          label: "3. நடக்காத நிகழ்வு",
          say: "P(நிகழாதது) = 1 - P(E). ஒரு நிகழ்வு நிச்சயம் நடக்குமானால் P=1. ஒருபோதும் நடக்காததாக இருந்தால் P=0.",
          ops: [
            { type: "text", value: "நடக்காத நிகழ்வு", x: 80, y: 60, color: "#df4da8", size: 28 },
            { type: "box", x: 80, y: 140, w: 500, h: 110, color: "#39247f", label: "P(நிகழாதது) = 1 - P(E)", labelSize: 26 },
            { type: "text", value: "P(நிச்சயம்)=1,  P(ஒருபோதும் இல்லை)=0", x: 80, y: 290, color: "#64748b", size: 22 },
          ],
        },
        {
          label: "4. 💡 நிகழ்தகவைக் கணக்கிடும் உத்தி",
          say: "எப்போதும் முதலில் மொத்த விளைவுகளின் பட்டியலை (sample space) முழுமையாக எழுதுங்கள். பின் கேள்வி கேட்பதற்குப் பொருந்தும் சாதகமான விளைவுகளை அதில் அடிக்கோடிட்டு எண்ணுங்கள். தவறான எண்ணிக்கை வருவதைத் தவிர்க்க இது உதவும்.",
          ops: [
            { type: "text", value: "💡 உத்தி: முழு மொத்த விளைவுகளையும் முதலில் எழுது", x: 80, y: 60, color: TIP_COLOR, size: 20 },
            { type: "box", x: 80, y: 140, w: 500, h: 110, color: TIP_COLOR, label: "மொத்த விளைவுகள் எழுது → சாதகமானவற்றை அடிக்கோடிடு → எண்ணு", labelSize: 16 },
          ],
        },
        {
          label: "5. ✍️ எழுதித் தீர்ப்போம்",
          say: "இப்போது நீங்கள் தீர்க்க வேண்டும். இந்த இரு நிகழ்தகவு வினாக்களையும் மொத்த விளைவுகளை முதலில் எழுதி உங்கள் நோட்டுப் புத்தகத்தில் தீர்க்கவும்.",
          ops: [
            { type: "text", value: "✍️ எழுதித் தீர்ப்போம் - மேலும் எடுத்துக்காட்டுகள்", x: 80, y: 50, color: PRACTICE_COLOR, size: 22 },
            { type: "box", x: 80, y: 130, w: 500, h: 110, color: PRACTICE_COLOR, label: "1. பகடையில் 4-க்கு மேல் வரும் நிகழ்தகவு?", labelSize: 20 },
            { type: "box", x: 80, y: 260, w: 500, h: 110, color: PRACTICE_COLOR, label: "2. ஒரு நாணயத்தை 2 முறை சுண்டும்போது 2 தலை வரும் நிகழ்தகவு?", labelSize: 16 },
            { type: "text", value: "விடை: 1) P=2/6=1/3   2) P=1/4", x: 80, y: 390, color: "#64748b", size: 20 },
          ],
        },
      ],
      questions: [
        { id: "8.2i-q1", prompt: "P(E) என்பது எவ்வாறு கணக்கிடப்படுகிறது?", options: ["சாதக விளைவுகள் / மொத்த விளைவுகள்", "மொத்த விளைவுகள் / சாதக விளைவுகள்", "சாதக விளைவுகள் × மொத்த விளைவுகள்"], correctIndex: 0, explanation: "நிகழ்தகவு = சாதகமான விளைவுகள் / மொத்த விளைவுகள்." },
        { id: "8.2i-q2", prompt: "பகடையில் இரட்டை எண் வரும் நிகழ்தகவு?", options: ["1/2", "1/3", "1/6"], correctIndex: 0, explanation: "P={2,4,6}/6 = 3/6 = 1/2." },
        { id: "8.2i-q3", prompt: "P(E) எப்போதும் எந்த வரம்பில் இருக்கும்?", options: ["0 முதல் 1 வரை", "0 முதல் 10 வரை", "-1 முதல் 1 வரை"], correctIndex: 0, explanation: "நிகழ்தகவு எப்போதும் 0 ≤ P(E) ≤ 1 வரம்பில் இருக்கும்." },
        { id: "8.2i-q4", prompt: "ஒரு நிகழ்வு ஒருபோதும் நடக்காதது எனில் P(E)?", options: ["0", "1", "0.5"], correctIndex: 0, explanation: "நடக்காத நிகழ்வுக்கு நிகழ்தகவு 0." },
      ],
    },
  ],
};
