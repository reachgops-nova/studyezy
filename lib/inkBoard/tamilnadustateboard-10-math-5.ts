import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * TN Samacheer Kalvi Std 10 Maths (Tamil medium), Unit 5 (ஆயத்தொலை
 * வடிவியல் - Coordinate Geometry): 5.1 distance & section formula, 5.2
 * slope & equation of a line. Added 2026-10-26.
 */
export const TAMILNADU_10_MATH_5: InkUnit = {
  unitKey: "tamilnadustateboard-10-math-5",
  title: "ஆயத்தொலை வடிவியல் (Coordinate Geometry)",
  badge: "10 ஆம் வகுப்பு · இயல் 5",
  languageCode: "ta-IN",

  topics: [
    {
      topicId: "5.1",
      title: "தூரமும் பிரிவுப்புள்ளியும்",
      scenes: [
        {
          label: "1. தூர சூத்திரம்",
          say: "இரு புள்ளிகள் (x1,y1), (x2,y2)-க்கு இடையேயான தூரம் d = √[(x2-x1)² + (y2-y1)²]. இது பிதாகரஸ் தேற்றத்தின் நேரடி பயன்பாடு.",
          ops: [
            { type: "text", value: "தூர சூத்திரம்", x: 80, y: 60, color: "#df4da8", size: 30 },
            { type: "box", x: 150, y: 140, w: 600, h: 110, color: "#39247f", label: "d = √[(x2-x1)² + (y2-y1)²]", labelSize: 28 },
          ],
        },
        {
          label: "2. தூரம் காணும் உதாரணம்",
          say: "(2,3), (5,7) இடையேயான தூரம் காண்போம். d = √[(5-2)² + (7-3)²] = √[9+16] = √25 = 5.",
          ops: [
            { type: "axes", id: "ax1", x: 100, y: 100, width: 400, height: 350, xRange: { min: 0, max: 7 }, yRange: { min: 0, max: 8 }, xLabel: "x", yLabel: "y", color: "#64748b" },
            { type: "point", axesId: "ax1", valueX: 2, valueY: 3, color: "#39247f", label: "(2,3)" },
            { type: "point", axesId: "ax1", valueX: 5, valueY: 7, color: "#188e69", label: "(5,7)" },
            { type: "text", value: "d = √[(5-2)²+(7-3)²] = √25 = 5", x: 600, y: 250, color: "#188e69", size: 24 },
          ],
        },
        {
          label: "3. பிரிவுப்புள்ளி சூத்திரம்",
          say: "ஒரு கோட்டுத்துண்டை m:n விகிதத்தில் பிரிக்கும் புள்ளியின் ஆயத்தொலைகள் = ((mx2+nx1)/(m+n), (my2+ny1)/(m+n)). m=n=1 எனில் (நடுப்புள்ளி) = ((x1+x2)/2, (y1+y2)/2).",
          ops: [
            { type: "text", value: "பிரிவுப்புள்ளி சூத்திரம்", x: 80, y: 60, color: "#df4da8", size: 26 },
            { type: "box", x: 80, y: 140, w: 600, h: 110, color: "#39247f", label: "((mx2+nx1)/(m+n), (my2+ny1)/(m+n))", labelSize: 20 },
            { type: "text", value: "நடுப்புள்ளி (m=n=1): ((x1+x2)/2, (y1+y2)/2)", x: 80, y: 290, color: "#188e69", size: 22 },
          ],
        },
        {
          label: "4. 💡 தூர சூத்திரத்தை நினைவில் வைக்க",
          say: "தூர சூத்திரம் பிதாகரஸ் தேற்றமே - x வித்தியாசம் ஒரு பக்கம், y வித்தியாசம் மற்றொரு பக்கம், தூரமே கர்ணம். 'வித்தியாசங்களின் வர்க்கங்களைக் கூட்டி வர்க்கமூலம் எடு' என்பதே உத்தி.",
          ops: [
            { type: "text", value: "💡 உத்தி: தூரம் = கர்ணம், x/y வித்தியாசங்கள் = பக்கங்கள்", x: 80, y: 60, color: TIP_COLOR, size: 18 },
            { type: "box", x: 80, y: 140, w: 500, h: 110, color: TIP_COLOR, label: "(Δx)² + (Δy)² = d²  (பிதாகரஸ்!)", labelSize: 22 },
          ],
        },
        {
          label: "5. ✍️ எழுதித் தீர்ப்போம்",
          say: "இப்போது நீங்கள் தீர்க்க வேண்டும். இந்த இரு புள்ளி இணைகளுக்கும் தூரத்தை உங்கள் நோட்டுப் புத்தகத்தில் கணக்கிடுங்கள்.",
          ops: [
            { type: "text", value: "✍️ எழுதித் தீர்ப்போம் - மேலும் எடுத்துக்காட்டுகள்", x: 80, y: 50, color: PRACTICE_COLOR, size: 22 },
            { type: "box", x: 80, y: 130, w: 450, h: 100, color: PRACTICE_COLOR, label: "1. (1,1), (4,5) இடையே தூரம்?", labelSize: 22 },
            { type: "box", x: 580, y: 130, w: 450, h: 100, color: PRACTICE_COLOR, label: "2. (0,0), (6,8) இடையே தூரம்?", labelSize: 22 },
            { type: "text", value: "விடை: 1) 5   2) 10", x: 80, y: 260, color: "#64748b", size: 22 },
          ],
        },
      ],
      questions: [
        { id: "5.1i-q1", prompt: "(2,3), (5,7) இடையேயான தூரம்?", options: ["5", "7", "4"], correctIndex: 0, explanation: "d=√[(5-2)²+(7-3)²]=√25=5." },
        { id: "5.1i-q2", prompt: "நடுப்புள்ளி சூத்திரம் என்ன?", options: ["((x1+x2)/2, (y1+y2)/2)", "(x1+x2, y1+y2)", "((x1-x2)/2, (y1-y2)/2)"], correctIndex: 0, explanation: "நடுப்புள்ளி m=n=1 ஆன பிரிவுப்புள்ளி சூத்திரத்தின் தனிவழக்கு." },
        { id: "5.1i-q3", prompt: "தூர சூத்திரம் எந்தத் தேற்றத்தை அடிப்படையாகக் கொண்டது?", options: ["பிதாகரஸ் தேற்றம்", "தேல்ஸ் தேற்றம்", "வட்டத்தொடு தேற்றம்"], correctIndex: 0, explanation: "x,y வித்தியாசங்களின் வர்க்கங்களைக் கூட்டி வர்க்கமூலம் எடுப்பது பிதாகரஸ் தேற்றமே." },
        { id: "5.1i-q4", prompt: "(1,1), (4,5) இடையேயான தூரம்?", options: ["5", "4", "6"], correctIndex: 0, explanation: "d=√[(4-1)²+(5-1)²]=√[9+16]=5." },
      ],
    },
    {
      topicId: "5.2",
      title: "சாய்வும் நேர்கோட்டுச் சமன்பாடும்",
      scenes: [
        {
          label: "1. சாய்வு (slope)",
          say: "ஒரு நேர்கோட்டின் சாய்வு m = (y2-y1)/(x2-x1). (1,2), (3,6) வழியாகச் செல்லும் கோட்டின் சாய்வு m = (6-2)/(3-1) = 4/2 = 2.",
          ops: [
            { type: "text", value: "சாய்வு: m = (y2-y1)/(x2-x1)", x: 80, y: 60, color: "#df4da8", size: 28 },
            { type: "axes", id: "ax2", x: 100, y: 120, width: 400, height: 320, xRange: { min: 0, max: 5 }, yRange: { min: 0, max: 8 }, xLabel: "x", yLabel: "y", color: "#64748b" },
            { type: "point", axesId: "ax2", valueX: 1, valueY: 2, color: "#39247f", label: "(1,2)" },
            { type: "point", axesId: "ax2", valueX: 3, valueY: 6, color: "#188e69", label: "(3,6)" },
            { type: "curve", axesId: "ax2", points: [{ x: 1, y: 2 }, { x: 3, y: 6 }], color: "#188e69" },
            { type: "text", value: "m = (6-2)/(3-1) = 2", x: 600, y: 250, color: "#188e69", size: 26 },
          ],
        },
        {
          label: "2. கோட்டின் சமன்பாடு",
          say: "சாய்வு-வெட்டுத்துண்டு வடிவம் y = mx + c. ஒரு புள்ளி (x1,y1) வழியாகச் செல்லும், சாய்வு m உள்ள கோட்டின் சமன்பாடு y - y1 = m(x - x1). (1,2) வழியாக m=2 கோடு: y-2=2(x-1) ⇒ y=2x.",
          ops: [
            { type: "text", value: "கோட்டின் சமன்பாடு", x: 80, y: 60, color: "#df4da8", size: 28 },
            { type: "box", x: 80, y: 140, w: 500, h: 100, color: "#39247f", label: "y - y1 = m(x - x1)", labelSize: 28 },
            { type: "text", value: "(1,2), m=2: y-2=2(x-1) ⇒ y=2x", x: 80, y: 280, color: "#188e69", size: 24 },
          ],
        },
        {
          label: "3. 💡 இணையான, செங்குத்துக் கோடுகள்",
          say: "இணையான கோடுகளுக்கு சாய்வுகள் சமம் (m1=m2). செங்குத்துக் கோடுகளுக்கு சாய்வுகளின் பெருக்கற்பலன் -1 (m1×m2=-1). இதை 'இணை = சமம், செங்குத்து = எதிர்மாறு பெருக்கல் -1' என நினைவில் வையுங்கள்.",
          ops: [
            { type: "text", value: "💡 உத்தி: இணை = m சமம், செங்குத்து = m1×m2=-1", x: 80, y: 60, color: TIP_COLOR, size: 20 },
            { type: "box", x: 80, y: 140, w: 450, h: 100, color: TIP_COLOR, label: "இணையானவை: m1 = m2", labelSize: 24 },
            { type: "box", x: 580, y: 140, w: 450, h: 100, color: TIP_COLOR, label: "செங்குத்தானவை: m1×m2 = -1", labelSize: 22 },
          ],
        },
        {
          label: "4. ✍️ எழுதித் தீர்ப்போம்",
          say: "இப்போது நீங்கள் தீர்க்க வேண்டும். இந்த இரு கேள்விகளுக்கும் சாய்வையும் கோட்டின் சமன்பாட்டையும் உங்கள் நோட்டுப் புத்தகத்தில் காணுங்கள்.",
          ops: [
            { type: "text", value: "✍️ எழுதித் தீர்ப்போம் - மேலும் எடுத்துக்காட்டுகள்", x: 80, y: 50, color: PRACTICE_COLOR, size: 22 },
            { type: "box", x: 80, y: 130, w: 500, h: 100, color: PRACTICE_COLOR, label: "1. (2,3),(4,9) சாய்வு m=?", labelSize: 24 },
            { type: "box", x: 80, y: 250, w: 500, h: 100, color: PRACTICE_COLOR, label: "2. (0,1) வழி m=3 கோட்டின் சமன்பாடு?", labelSize: 18 },
            { type: "text", value: "விடை: 1) m=3   2) y=3x+1", x: 80, y: 370, color: "#64748b", size: 22 },
          ],
        },
      ],
      questions: [
        { id: "5.2i-q1", prompt: "(1,2), (3,6) வழியாகச் செல்லும் கோட்டின் சாய்வு?", options: ["2", "4", "1"], correctIndex: 0, explanation: "m=(6-2)/(3-1)=2." },
        { id: "5.2i-q2", prompt: "இணையான கோடுகளுக்கு என்ன உண்மை?", options: ["சாய்வுகள் சமம்", "சாய்வுகளின் பெருக்கல் -1", "சாய்வுகள் எப்போதும் 0"], correctIndex: 0, explanation: "இணையான கோடுகளின் சாய்வுகள் எப்போதும் சமம்." },
        { id: "5.2i-q3", prompt: "செங்குத்துக் கோடுகளுக்கு m1×m2 எவ்வளவு?", options: ["-1", "0", "1"], correctIndex: 0, explanation: "செங்குத்துக் கோடுகளின் சாய்வுகளின் பெருக்கற்பலன் எப்போதும் -1." },
        { id: "5.2i-q4", prompt: "(2,3),(4,9) வழியாகச் செல்லும் கோட்டின் சாய்வு?", options: ["3", "2", "6"], correctIndex: 0, explanation: "m=(9-3)/(4-2)=6/2=3." },
      ],
    },
  ],
};
