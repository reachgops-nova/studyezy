import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * TN Samacheer Kalvi Std 10 Maths (Tamil medium), Unit 3 (இயற்கணிதம் -
 * Algebra): 3.1 linear system of equations, 3.2 quadratic equations.
 * Added 2026-10-26.
 */
export const TAMILNADU_10_MATH_3: InkUnit = {
  unitKey: "tamilnadustateboard-10-math-3",
  title: "இயற்கணிதம் (Algebra)",
  badge: "10 ஆம் வகுப்பு · இயல் 3",
  languageCode: "ta-IN",

  topics: [
    {
      topicId: "3.1",
      title: "இரு மாறி கொண்ட நேரிய சமன்பாடுகள்",
      scenes: [
        {
          label: "1. இரு சமன்பாடுகள், இரு தெரியாதவை",
          say: "2x + 3y = 13, x - y = -1 எனும் இரு சமன்பாடுகளை ஒரே நேரத்தில் தீர்த்து x, y மதிப்புகளைக் காண வேண்டும். நீக்கல் முறையைப் பயன்படுத்துவோம்.",
          ops: [
            { type: "text", value: "இரு மாறி கொண்ட நேரிய சமன்பாடுகள்", x: 80, y: 70, color: "#df4da8", size: 28 },
            { type: "box", x: 80, y: 150, w: 400, h: 100, color: "#39247f", label: "2x + 3y = 13", labelSize: 30 },
            { type: "box", x: 80, y: 270, w: 400, h: 100, color: "#39247f", label: "x - y = -1", labelSize: 30 },
          ],
        },
        {
          label: "2. நீக்கல் முறையில் தீர்த்தல்",
          say: "இரண்டாம் சமன்பாட்டிலிருந்து x = y - 1. இதை முதல் சமன்பாட்டில் பிரதியிடுவோம்: 2(y-1) + 3y = 13 ⇒ 2y - 2 + 3y = 13 ⇒ 5y = 15 ⇒ y = 3. பின் x = 3 - 1 = 2.",
          ops: [
            { type: "text", value: "நீக்கல் முறை", x: 80, y: 60, color: "#df4da8", size: 28 },
            { type: "box", x: 80, y: 140, w: 600, h: 110, color: "#188e69", label: "x = y-1 ஐப் பிரதியிட: 2(y-1)+3y=13 ⇒ y=3", labelSize: 20 },
            { type: "box", x: 80, y: 270, w: 400, h: 90, color: "#188e69", label: "x = y - 1 = 3 - 1 = 2", labelSize: 24 },
            { type: "text", value: "விடை: x=2, y=3", x: 80, y: 390, color: "#39247f", size: 26 },
          ],
        },
        {
          label: "3. 💡 எந்த முறையைத் தேர்வு செய்வது",
          say: "ஒரு மாறியின் கெழு எளிதாக 1 அல்லது -1 ஆக இருந்தால் (இங்கு x-y=-1), பிரதியிடும் முறை (substitution) வேகமானது. இல்லையெனில் இரு சமன்பாடுகளையும் தக்க எண்ணால் பெருக்கி கூட்டல்/கழித்தல் செய்யும் நீக்கல் முறையைப் பயன்படுத்துங்கள்.",
          ops: [
            { type: "text", value: "💡 உத்தி: கெழு 1/-1 இருந்தால் பிரதியிடல் வேகம்", x: 80, y: 60, color: TIP_COLOR, size: 22 },
            { type: "box", x: 80, y: 140, w: 500, h: 110, color: TIP_COLOR, label: "x - y = -1 ⇒ x = y - 1 (உடனே பிரதியிடலாம்)", labelSize: 18 },
          ],
        },
        {
          label: "4. ✍️ எழுதித் தீர்ப்போம்",
          say: "இப்போது நீங்கள் தீர்க்க வேண்டும். இந்த இரு சமன்பாட்டு இணைகளையும் உங்கள் நோட்டுப் புத்தகத்தில் தீர்த்து x, y மதிப்புகளைக் காணுங்கள்.",
          ops: [
            { type: "text", value: "✍️ எழுதித் தீர்ப்போம் - மேலும் எடுத்துக்காட்டுகள்", x: 80, y: 50, color: PRACTICE_COLOR, size: 22 },
            { type: "box", x: 80, y: 130, w: 500, h: 110, color: PRACTICE_COLOR, label: "1. x+y=7, x-y=1 ⇒ x,y=?", labelSize: 22 },
            { type: "box", x: 80, y: 260, w: 500, h: 110, color: PRACTICE_COLOR, label: "2. 3x+2y=12, x-y=1 ⇒ x,y=?", labelSize: 20 },
            { type: "text", value: "விடை: 1) x=4,y=3   2) x=2.8,y=1.8", x: 80, y: 390, color: "#64748b", size: 20 },
          ],
        },
      ],
      questions: [
        { id: "3.1i-q1", prompt: "2x+3y=13, x-y=-1 தொகுப்பில் x மதிப்பு?", options: ["2", "3", "5"], correctIndex: 0, explanation: "தீர்த்ததில் x=2, y=3 கிடைக்கிறது." },
        { id: "3.1i-q2", prompt: "2x+3y=13, x-y=-1 தொகுப்பில் y மதிப்பு?", options: ["3", "2", "1"], correctIndex: 0, explanation: "5y=15 ⇒ y=3." },
        { id: "3.1i-q3", prompt: "x-y=-1 என்பதிலிருந்து x-ஐ y-வில் எப்படி எழுதலாம்?", options: ["x = y - 1", "x = y + 1", "x = -y - 1"], correctIndex: 0, explanation: "x - y = -1 ⇒ x = y - 1." },
        { id: "3.1i-q4", prompt: "x+y=7, x-y=1 தொகுப்பில் x மதிப்பு?", options: ["4", "3", "5"], correctIndex: 0, explanation: "இரு சமன்பாடுகளையும் கூட்டினால் 2x=8 ⇒ x=4." },
      ],
    },
    {
      topicId: "3.2",
      title: "இருபடிச் சமன்பாடுகள்",
      scenes: [
        {
          label: "1. இருபடிச் சமன்பாடு என்றால் என்ன",
          say: "ax² + bx + c = 0 (a≠0) வடிவில் உள்ள சமன்பாடு இருபடிச் சமன்பாடு. x²-5x+6=0 ஒரு எடுத்துக்காட்டு. இதன் மூலங்களைக் காரணிப்படுத்தல் முறையால் காணலாம்.",
          ops: [
            { type: "text", value: "இருபடிச் சமன்பாடு: ax² + bx + c = 0", x: 80, y: 70, color: "#df4da8", size: 28 },
            { type: "box", x: 200, y: 150, w: 500, h: 110, color: "#39247f", label: "x² - 5x + 6 = 0", labelSize: 32 },
          ],
        },
        {
          label: "2. காரணிப்படுத்தல் முறை",
          say: "x²-5x+6-ஐ காரணிகளாகப் பிரிப்போம். -2 மற்றும் -3 கூட்டினால் -5, பெருக்கினால் 6 கிடைக்கிறது. எனவே x²-5x+6 = (x-2)(x-3). ஒவ்வொரு காரணியையும் பூஜ்ஜியமாக்கினால் x=2 அல்லது x=3.",
          ops: [
            { type: "text", value: "காரணிப்படுத்தல் முறை", x: 80, y: 60, color: "#df4da8", size: 28 },
            { type: "box", x: 80, y: 140, w: 500, h: 100, color: "#188e69", label: "x²-5x+6 = (x-2)(x-3)", labelSize: 26 },
            { type: "text", value: "(x-2)=0 ⇒ x=2   அல்லது   (x-3)=0 ⇒ x=3", x: 80, y: 280, color: "#39247f", size: 24 },
          ],
        },
        {
          label: "3. சூத்திர முறை",
          say: "காரணிப்படுத்த முடியாதபோது சூத்திர முறையைப் பயன்படுத்துவோம்: x = [-b ± √(b²-4ac)] / 2a. x²-5x+6=0-இல் a=1,b=-5,c=6. x = [5 ± √(25-24)]/2 = [5±1]/2 ⇒ x=3 அல்லது x=2.",
          ops: [
            { type: "text", value: "சூத்திர முறை", x: 80, y: 60, color: "#df4da8", size: 28 },
            { type: "box", x: 150, y: 140, w: 600, h: 110, color: "#188e69", label: "x = [-b ± √(b²-4ac)] / 2a", labelSize: 28 },
            { type: "text", value: "a=1, b=-5, c=6: x = [5±1]/2 ⇒ x=3,2", x: 80, y: 290, color: "#39247f", size: 22 },
          ],
        },
        {
          label: "4. 💡 பேரிசி (discriminant) வைத்து மூலங்களை அறிதல்",
          say: "D = b²-4ac என்ற பேரிசியைக் கணக்கிட்டால், தீர்க்காமலேயே மூலங்களின் தன்மையை அறியலாம். D>0 எனில் 2 வெவ்வேறு மெய் மூலங்கள், D=0 எனில் சம மூலங்கள், D<0 எனில் மெய் மூலங்கள் இல்லை.",
          ops: [
            { type: "text", value: "💡 உத்தி: D = b²-4ac மூலங்களின் தன்மையைச் சொல்லும்", x: 80, y: 50, color: TIP_COLOR, size: 20 },
            { type: "box", x: 80, y: 130, w: 300, h: 90, color: TIP_COLOR, label: "D>0: 2 மெய் மூலங்கள்", labelSize: 18 },
            { type: "box", x: 400, y: 130, w: 300, h: 90, color: TIP_COLOR, label: "D=0: சம மூலங்கள்", labelSize: 18 },
            { type: "box", x: 720, y: 130, w: 300, h: 90, color: TIP_COLOR, label: "D<0: மெய் மூலம் இல்லை", labelSize: 16 },
          ],
        },
        {
          label: "5. ✍️ எழுதித் தீர்ப்போம்",
          say: "இப்போது நீங்கள் தீர்க்க வேண்டும். இந்த இரு இருபடிச் சமன்பாடுகளையும் காரணிப்படுத்தல் அல்லது சூத்திர முறையால் உங்கள் நோட்டுப் புத்தகத்தில் தீர்க்கவும்.",
          ops: [
            { type: "text", value: "✍️ எழுதித் தீர்ப்போம் - மேலும் எடுத்துக்காட்டுகள்", x: 80, y: 50, color: PRACTICE_COLOR, size: 22 },
            { type: "box", x: 80, y: 130, w: 480, h: 100, color: PRACTICE_COLOR, label: "1. x² - 7x + 12 = 0 ⇒ x=?", labelSize: 22 },
            { type: "box", x: 620, y: 130, w: 420, h: 100, color: PRACTICE_COLOR, label: "2. x² + 2x - 15 = 0 ⇒ x=?", labelSize: 22 },
            { type: "text", value: "விடை: 1) x=3,4   2) x=3,-5", x: 80, y: 260, color: "#64748b", size: 22 },
          ],
        },
      ],
      questions: [
        { id: "3.2i-q1", prompt: "x²-5x+6=0-இன் மூலங்கள்?", options: ["x=2, x=3", "x=1, x=6", "x=-2, x=-3"], correctIndex: 0, explanation: "(x-2)(x-3)=0 ⇒ x=2 அல்லது x=3." },
        { id: "3.2i-q2", prompt: "D = b²-4ac = 0 எனில் மூலங்கள் எப்படி இருக்கும்?", options: ["சமமாக இருக்கும்", "மெய் மூலங்கள் இருக்காது", "2 வெவ்வேறு மூலங்கள்"], correctIndex: 0, explanation: "D=0 எனில் இரு மூலங்களும் சமமாக இருக்கும்." },
        { id: "3.2i-q3", prompt: "சூத்திர முறையின் சூத்திரம் என்ன?", options: ["x = [-b ± √(b²-4ac)] / 2a", "x = -b/2a", "x = b²-4ac"], correctIndex: 0, explanation: "இதுவே இருபடிச் சமன்பாட்டின் பொது சூத்திரம்." },
        { id: "3.2i-q4", prompt: "x²-7x+12=0-இன் மூலங்கள்?", options: ["x=3, x=4", "x=2, x=6", "x=1, x=12"], correctIndex: 0, explanation: "(x-3)(x-4)=0 ⇒ x=3 அல்லது x=4." },
      ],
    },
  ],
};
