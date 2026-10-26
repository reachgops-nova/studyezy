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

    {
      topicId: "பயிற்சி 3.1",
      title: "📘 பயிற்சி 3.1 - முழுத் தீர்வுகள் (3 மாறிச் சமன்பாடுகள்)",
      scenes: [
        {
          label: "1(i). மூன்று மாறிச் சமன்பாடுகள்",
          say: "x+y+z=5, 2x-y+z=9, x-2y+3z=16. நீக்கல் முறையில் தீர்த்தால் z=4, y=-1, x=2 கிடைக்கிறது.",
          ops: [
            { type: "text", value: "வினா 1(i): x+y+z=5, 2x-y+z=9, x-2y+3z=16", x: 80, y: 50, color: "#df4da8", size: 18 },
            { type: "box", x: 80, y: 120, w: 600, h: 100, color: "#188e69", label: "x=2, y=-1, z=4", labelSize: 30 },
          ],
        },
        {
          label: "1(ii),(iii). பின்னச் சமன்பாடுகள்",
          say: "(ii) a=1/x,b=1/y,c=1/z எனப் பிரதியிட்டால் a=2,b=3,c=4 ⇒ x=1/2,y=1/3,z=1/4. (iii) பொதுமதிப்பு k எனக்கொண்டு தீர்த்தால் k=55 ⇒ x=35,y=30,z=25.",
          ops: [
            { type: "text", value: "வினா 1(ii): x=1/2, y=1/3, z=1/4", x: 80, y: 50, color: "#df4da8", size: 22 },
            { type: "box", x: 80, y: 120, w: 500, h: 100, color: "#188e69", label: "வினா 1(iii): x=35, y=30, z=25", labelSize: 22 },
          ],
        },
        {
          label: "2. வினா 2: தீர்வுகளின் தன்மை",
          say: "(i) இரு சமன்பாடுகளும் ஒரே உறவைத் தருவதால் - எண்ணிலா தீர்வுகள். (ii) இரு சமன்பாடுகள் முரண்படுகின்றன - தீர்வே இல்லை. (iii) k=6 எனக் கண்டு தனித்த தீர்வு x=3,y=9,z=15 கிடைக்கிறது.",
          ops: [
            { type: "text", value: "வினா 2: தீர்வுகளின் தன்மை", x: 80, y: 50, color: "#df4da8", size: 26 },
            { type: "box", x: 80, y: 120, w: 320, h: 90, color: "#39247f", label: "(i) எண்ணிலா தீர்வுகள்", labelSize: 16 },
            { type: "box", x: 430, y: 120, w: 280, h: 90, color: "#dc2626", label: "(ii) தீர்வே இல்லை", labelSize: 18 },
            { type: "box", x: 740, y: 120, w: 350, h: 90, color: "#188e69", label: "(iii) x=3,y=9,z=15", labelSize: 18 },
          ],
        },
        {
          label: "3. வினா 3: மூவரின் வயது",
          say: "தாத்தா+தந்தை+வாணி=159. g/2+f/3+v/4=65. g-4=4(v-4). தீர்த்தால் v=24, g=84, f=51.",
          ops: [
            { type: "text", value: "வினா 3: மூவரின் தற்போதைய வயது", x: 80, y: 50, color: "#df4da8", size: 24 },
            { type: "box", x: 80, y: 120, w: 300, h: 90, color: "#39247f", label: "தாத்தா = 84", labelSize: 22 },
            { type: "box", x: 420, y: 120, w: 300, h: 90, color: "#188e69", label: "தந்தை = 51", labelSize: 22 },
            { type: "box", x: 760, y: 120, w: 300, h: 90, color: "#dc2626", label: "வாணி = 24", labelSize: 22 },
          ],
        },
        {
          label: "4,5. வினா 4,5",
          say: "4. a+b+c=11, c=2b+a, 95c-40b-499a=46. தீர்த்தால் a=1,b=3,c=7 ⇒ மூவிலக்க எண்=137 (731=5×137+46 ✓). 5. x+y+z=12, 5x+10y+20z=105, x-y=4. தீர்த்தால் x=7,y=3,z=2 (₹5×7, ₹10×3, ₹20×2).",
          ops: [
            { type: "text", value: "வினா 4: மூவிலக்க எண் = 137", x: 80, y: 50, color: "#df4da8", size: 24 },
            { type: "box", x: 80, y: 120, w: 600, h: 100, color: "#188e69", label: "வினா 5: 7×₹5, 3×₹10, 2×₹20 நோட்டுகள்", labelSize: 20 },
          ],
        },
      ],
      questions: [
        { id: "ex3.1-q1", prompt: "x+y+z=5, 2x-y+z=9, x-2y+3z=16 தொகுப்பில் x?", options: ["2", "3", "4"], correctIndex: 0, explanation: "நீக்கல் முறையில் தீர்த்தால் x=2." },
        { id: "ex3.1-q2", prompt: "(y+z)/4=(z+x)/3=(x+y)/2, x+y+z=27 எனில் x?", options: ["3", "9", "15"], correctIndex: 0, explanation: "k=6 எனக் கண்டு x=27-24=3." },
        { id: "ex3.1-q3", prompt: "₹5,10,20 நோட்டுகள் மொத்தம் 12, மதிப்பு ₹105, முதல் இரண்டின் எண்ணிக்கை மாற்றினால் ₹20 அதிகரிக்கும் எனில் ₹5 நோட்டுகள்?", options: ["7", "5", "3"], correctIndex: 0, explanation: "x-y=4, 3x+2y=27 தீர்த்தால் x=7." },
        { id: "ex3.1-q4", prompt: "இரு சமன்பாடுகள் முரண்படும்போது தீர்வு எப்படி இருக்கும்?", options: ["தீர்வே இல்லை", "தனித்த தீர்வு", "எண்ணிலா தீர்வுகள்"], correctIndex: 0, explanation: "முரண்பாடான சமன்பாடுகளுக்குத் தீர்வு இருக்காது." },
      ],
    },

    {
      topicId: "பயிற்சி 3.2",
      title: "📘 பயிற்சி 3.2 - முழுத் தீர்வுகள் (பல்லுறுப்புக்கோவை GCD/LCM)",
      scenes: [
        {
          label: "1. வினா 1: பல்லுறுப்புக்கோவை GCD",
          say: "ஒவ்வொரு ஜோடியையும் காரணிப்படுத்தி பொது காரணிகளை எடுக்க வேண்டும். (i) x⁴+3x³-x-3=(x+3)(x-1)(x²+x+1), x³+x²-5x+3=(x-1)²(x+3) ⇒ GCD=(x+3)(x-1). (ii) x⁴-1=(x-1)(x+1)(x²+1), x³-11x²+x-11=(x-11)(x²+1) ⇒ GCD=(x²+1).",
          ops: [
            { type: "text", value: "வினா 1: காரணிப்படுத்தி பொது காரணி எடு", x: 80, y: 50, color: "#df4da8", size: 22 },
            { type: "box", x: 80, y: 120, w: 500, h: 90, color: "#39247f", label: "(i) GCD = (x+3)(x-1)", labelSize: 20 },
            { type: "box", x: 620, y: 120, w: 400, h: 90, color: "#188e69", label: "(ii) GCD = (x²+1)", labelSize: 20 },
          ],
        },
        {
          label: "1(iii),(iv). தொடர்ச்சி",
          say: "(iii) 3x⁴+6x³-12x²-24x=3x(x+2)²(x-2), 4x⁴+14x³+8x²-8x=2x(x+2)²(2x-1) ⇒ GCD=x(x+2)². (iv) 3x³+3x²+3x+3=3(x+1)(x²+1), 6x³+12x²+6x+12=6(x+2)(x²+1) ⇒ GCD=3(x²+1).",
          ops: [
            { type: "box", x: 80, y: 60, w: 500, h: 90, color: "#dc2626", label: "(iii) GCD = x(x+2)²", labelSize: 20 },
            { type: "box", x: 620, y: 60, w: 400, h: 90, color: "#64748b", label: "(iv) GCD = 3(x²+1)", labelSize: 20 },
          ],
        },
        {
          label: "2. வினா 2: ஆறு LCM கணக்குகள்",
          say: "(i) 4x²y,8x³y²: LCM=8x³y². (ii) 9a³b²,12a²b²c: LCM=36a³b²c. (iii) 16m,12m²n²,8n²: LCM=48m²n². (iv) (p-1)(p-2),(p-2)(p+2): LCM=(p-1)(p-2)(p+2). (v) (2x+1)(x-3),4(x-3)(x+3): LCM=4(2x+1)(x-3)(x+3). (vi) LCM=8x²(2x-3y)³(4x²+6xy+9y²).",
          ops: [
            { type: "text", value: "வினா 2: LCM கணக்குகள்", x: 80, y: 50, color: "#df4da8", size: 24 },
            { type: "box", x: 80, y: 120, w: 300, h: 80, color: "#39247f", label: "(i) 8x³y²", labelSize: 20 },
            { type: "box", x: 400, y: 120, w: 300, h: 80, color: "#188e69", label: "(ii) 36a³b²c", labelSize: 18 },
            { type: "box", x: 720, y: 120, w: 300, h: 80, color: "#dc2626", label: "(iii) 48m²n²", labelSize: 18 },
            { type: "text", value: "(iv) (p-1)(p-2)(p+2)  (v) 4(2x+1)(x-3)(x+3)", x: 80, y: 230, color: "#39247f", size: 16 },
          ],
        },
      ],
      questions: [
        { id: "ex3.2-q1", prompt: "x⁴-1, x³-11x²+x-11-ன் GCD?", options: ["x²+1", "x-1", "x+1"], correctIndex: 0, explanation: "இரு கோவைகளிலும் பொதுவான காரணி (x²+1)." },
        { id: "ex3.2-q2", prompt: "4x²y, 8x³y²-ன் LCM?", options: ["8x³y²", "4x²y", "32x⁵y³"], correctIndex: 0, explanation: "அதிக அடுக்கு கொண்ட காரணிகளை எடுத்தால் 8x³y²." },
        { id: "ex3.2-q3", prompt: "p²-3p+2, p²-4-ன் LCM?", options: ["(p-1)(p-2)(p+2)", "(p-1)(p-2)", "(p-2)(p+2)"], correctIndex: 0, explanation: "(p-1)(p-2) மற்றும் (p-2)(p+2)-ன் LCM = (p-1)(p-2)(p+2)." },
        { id: "ex3.2-q4", prompt: "f(x)×g(x) எதற்குச் சமம்?", options: ["GCD × LCM", "GCD + LCM", "GCD - LCM"], correctIndex: 0, explanation: "f(x)×g(x) = மீ.சி.ம[f,g] × மீ.பொ.வ[f,g]." },
      ],
    },

    {
      topicId: "பயிற்சி 3.3",
      title: "📘 பயிற்சி 3.3 - முழுத் தீர்வுகள் (GCD-LCM தொடர்பு)",
      scenes: [
        {
          label: "1. வினா 1: GCD, LCM மற்றும் சரிபார்ப்பு",
          say: "(i) 21x²y,35xy²: GCD=7xy, LCM=105x²y². (ii) (x³-1)(x+1),(x³+1): GCD=(x+1), LCM=(x²-1)(x⁴+x²+1). (iii) x²y+xy², x²+xy: GCD=x(x+y), LCM=xy(x+y). எல்லாவற்றிலும் f×g=GCD×LCM சரிபார்க்கப்பட்டது.",
          ops: [
            { type: "text", value: "வினா 1: மூன்று ஜோடிகளுக்கும் GCD, LCM", x: 80, y: 50, color: "#df4da8", size: 22 },
            { type: "box", x: 80, y: 120, w: 320, h: 90, color: "#39247f", label: "(i) GCD=7xy, LCM=105x²y²", labelSize: 15 },
            { type: "box", x: 430, y: 120, w: 320, h: 90, color: "#188e69", label: "(ii) GCD=(x+1)", labelSize: 18 },
            { type: "box", x: 780, y: 120, w: 320, h: 90, color: "#dc2626", label: "(iii) GCD=x(x+y)", labelSize: 16 },
          ],
        },
        {
          label: "2,3. வினா 2,3: GCD காண்க",
          say: "2(i). a²+4a-12=(a+6)(a-2), a²-5a+6=(a-2)(a-3) ⇒ GCD=(a-2). 2(ii). GCD=(x-3a). 3(i). 12x³(x-1), 8x²(x-1)(x-2) ⇒ GCD=4x²(x-1). 3(ii). GCD=(x²-xy+y²).",
          ops: [
            { type: "text", value: "வினா 2: GCD=(a-2), (x-3a)", x: 80, y: 50, color: "#df4da8", size: 22 },
            { type: "box", x: 80, y: 120, w: 450, h: 90, color: "#188e69", label: "வினா 3(i): GCD = 4x²(x-1)", labelSize: 18 },
            { type: "box", x: 580, y: 120, w: 450, h: 90, color: "#dc2626", label: "வினா 3(ii): GCD = (x²-xy+y²)", labelSize: 16 },
          ],
        },
        {
          label: "4. வினா 4: அட்டவணை நிரப்புக",
          say: "f×g=GCD×LCM பயன்படுத்தி விடுபட்டதைக் காணலாம். (i) p=a²-12a+35, GCD=a-7, LCM கொடுக்கப்பட்டுள்ளது ⇒ q(a)=(a³-10a²+11a+70)/(a-5)=a²-5a-14. (ii) q கொடுக்கப்பட்டுள்ளது ⇒ p(x)=(x²-y²)(x²+xy+y²).",
          ops: [
            { type: "text", value: "வினா 4: p×q=GCD×LCM பயன்படுத்தி நிரப்புக", x: 80, y: 50, color: "#df4da8", size: 20 },
            { type: "box", x: 80, y: 120, w: 500, h: 90, color: "#188e69", label: "(i) q(a) = a² - 5a - 14", labelSize: 20 },
            { type: "box", x: 620, y: 120, w: 450, h: 90, color: "#dc2626", label: "(ii) p(x) = (x²-y²)(x²+xy+y²)", labelSize: 16 },
          ],
        },
      ],
      questions: [
        { id: "ex3.3-q1", prompt: "21x²y, 35xy²-ன் GCD?", options: ["7xy", "105x²y²", "7x"], correctIndex: 0, explanation: "பொது காரணி 7xy." },
        { id: "ex3.3-q2", prompt: "a²+4a-12, a²-5a+6-ன் GCD?", options: ["a-2", "a+6", "a-3"], correctIndex: 0, explanation: "(a+6)(a-2) மற்றும் (a-2)(a-3)-ன் பொது காரணி (a-2)." },
        { id: "ex3.3-q3", prompt: "GCD×LCM = p(x)×q(x) என்பதைப் பயன்படுத்தி என்ன காணலாம்?", options: ["விடுபட்ட p(x) அல்லது q(x)", "எப்போதும் GCD மட்டும்", "ஒன்றும் இல்லை"], correctIndex: 0, explanation: "இந்த உறவைப் பயன்படுத்தி ஏதேனும் ஒரு கோவை தெரிந்தால் மற்றதைக் காணலாம்." },
        { id: "ex3.3-q4", prompt: "x²y+xy², x²+xy-ன் GCD?", options: ["x(x+y)", "xy(x+y)", "x+y"], correctIndex: 0, explanation: "xy(x+y) மற்றும் x(x+y)-ன் பொது காரணி x(x+y)." },
      ],
    },

    {
      topicId: "பயிற்சி 3.4",
      title: "📘 பயிற்சி 3.4 - முழுத் தீர்வுகள் (விகிதமுறு கோவைகள்)",
      scenes: [
        {
          label: "1. வினா 1: எளிய வடிவிற்குச் சுருக்குக",
          say: "(i) (x²-1)/(x²+x)=(x-1)(x+1)/[x(x+1)]=(x-1)/x. (ii) (x²-11x+18)/(x²-4x+4)=(x-2)(x-9)/(x-2)²=(x-9)/(x-2). (iii) (9x²+81x)/(x³+8x²-9x)=9x(x+9)/[x(x+9)(x-1)]=9/(x-1). (iv) =(p+5)/[2p(p-4)].",
          ops: [
            { type: "text", value: "வினா 1: எளிய வடிவிற்குச் சுருக்குக", x: 80, y: 50, color: "#df4da8", size: 22 },
            { type: "box", x: 80, y: 120, w: 280, h: 80, color: "#39247f", label: "(i) (x-1)/x", labelSize: 20 },
            { type: "box", x: 380, y: 120, w: 300, h: 80, color: "#188e69", label: "(ii) (x-9)/(x-2)", labelSize: 18 },
            { type: "box", x: 700, y: 120, w: 280, h: 80, color: "#dc2626", label: "(iii) 9/(x-1)", labelSize: 20 },
            { type: "text", value: "(iv) (p+5) / [2p(p-4)]", x: 80, y: 230, color: "#39247f", size: 22 },
          ],
        },
        {
          label: "2. வினா 2: விலக்கப்பட்ட மதிப்புகள்",
          say: "கோவை வரையறுக்க இயலாத மதிப்புகள் = வகுத்தி பூஜ்ஜியமாகும் x மதிப்புகள். (i) y²-25=0⇒y=±5. (ii) t²-5t+6=0⇒t=2,3. (iii) x²+x-2=0⇒x=-2,1. (iv) x³+x²-6x=0⇒x=0,-3,2.",
          ops: [
            { type: "text", value: "வினா 2: விலக்கப்பட்ட மதிப்புகள் (வகுத்தி = 0)", x: 80, y: 50, color: "#df4da8", size: 20 },
            { type: "box", x: 80, y: 120, w: 240, h: 80, color: "#39247f", label: "(i) y=±5", labelSize: 22 },
            { type: "box", x: 350, y: 120, w: 240, h: 80, color: "#188e69", label: "(ii) t=2,3", labelSize: 22 },
            { type: "box", x: 620, y: 120, w: 240, h: 80, color: "#dc2626", label: "(iii) x=-2,1", labelSize: 20 },
            { type: "box", x: 890, y: 120, w: 240, h: 80, color: "#64748b", label: "(iv) x=0,-3,2", labelSize: 18 },
          ],
        },
      ],
      questions: [
        { id: "ex3.4-q1", prompt: "(x²-1)/(x²+x) எளிய வடிவு?", options: ["(x-1)/x", "x-1", "(x+1)/x"], correctIndex: 0, explanation: "(x-1)(x+1)/[x(x+1)]=(x-1)/x." },
        { id: "ex3.4-q2", prompt: "y/(y²-25)-க்கு விலக்கப்பட்ட மதிப்புகள்?", options: ["y=5,-5", "y=0", "y=25"], correctIndex: 0, explanation: "y²-25=0 ⇒ y=±5." },
        { id: "ex3.4-q3", prompt: "(9x²+81x)/(x³+8x²-9x) எளிய வடிவு?", options: ["9/(x-1)", "9x/(x-1)", "1/(x-1)"], correctIndex: 0, explanation: "9x(x+9)/[x(x+9)(x-1)]=9/(x-1)." },
        { id: "ex3.4-q4", prompt: "ஒரு விகிதமுறு கோவையில் வகுத்தி பூஜ்ஜியமாகும் x மதிப்புகள் எவ்வாறு அழைக்கப்படும்?", options: ["விலக்கப்பட்ட மதிப்புகள்", "தீர்வுகள்", "சார்பகம்"], correctIndex: 0, explanation: "வகுத்தி பூஜ்ஜியமாகும் மதிப்புகள் கோவைக்கு வரையறுக்கப்படாதவை - விலக்கப்பட்ட மதிப்புகள்." },
      ],
    },

    {
      topicId: "பயிற்சி 3.5",
      title: "📘 பயிற்சி 3.5 - முழுத் தீர்வுகள் (பெருக்கலும் வகுத்தலும்)",
      scenes: [
        {
          label: "1. வினா 1: மூன்று பெருக்கல்கள்",
          say: "(i) (4x²y/2z²)×(6xz³/20y⁴)=24x³yz³/40y⁴z²=3x³z/(5y³). (ii) காரணிப்படுத்தி ரத்துசெய்தால் =(p+4). (iii) =30t³(t-2)/[40t(t-2)]=3t²/4.",
          ops: [
            { type: "text", value: "வினா 1: பெருக்கல் - சுருக்குக", x: 80, y: 50, color: "#df4da8", size: 24 },
            { type: "box", x: 80, y: 120, w: 300, h: 90, color: "#39247f", label: "(i) 3x³z/(5y³)", labelSize: 22 },
            { type: "box", x: 420, y: 120, w: 280, h: 90, color: "#188e69", label: "(ii) p+4", labelSize: 24 },
            { type: "box", x: 740, y: 120, w: 280, h: 90, color: "#dc2626", label: "(iii) 3t²/4", labelSize: 24 },
          ],
        },
        {
          label: "2. வினா 2: இரு பெருக்கல்கள்",
          say: "(i) [(x+4)/(3x+4y)]×[(9x²-16y²)/(2x²+3x-20)]: காரணிகளை ரத்துசெய்தால் =(3x-4y)/(2x-5). (ii) [(x³-y³)/(3x²+9xy+6y²)]×[(x²+2xy+y²)/(x²-y²)] = (x²+xy+y²)/[3(x+2y)].",
          ops: [
            { type: "box", x: 80, y: 60, w: 500, h: 90, color: "#39247f", label: "(i) (3x-4y)/(2x-5)", labelSize: 22 },
            { type: "box", x: 620, y: 60, w: 450, h: 90, color: "#188e69", label: "(ii) (x²+xy+y²)/[3(x+2y)]", labelSize: 18 },
          ],
        },
        {
          label: "3. வினா 3: நான்கு வகுத்தல்கள்",
          say: "வகுத்தலை தலைகீழாக்கிப் பெருக்கி காரணிகளை ரத்துசெய்ய வேண்டும். (i) -5. (ii) (b-4)/(b+2). (iii) 3y/(x-3). (iv) 4(2t-1)/3.",
          ops: [
            { type: "text", value: "வினா 3: வகுத்தல் - தலைகீழாக்கிப் பெருக்கு", x: 80, y: 50, color: "#df4da8", size: 20 },
            { type: "box", x: 80, y: 120, w: 240, h: 80, color: "#39247f", label: "(i) -5", labelSize: 24 },
            { type: "box", x: 350, y: 120, w: 280, h: 80, color: "#188e69", label: "(ii) (b-4)/(b+2)", labelSize: 18 },
            { type: "box", x: 660, y: 120, w: 240, h: 80, color: "#dc2626", label: "(iii) 3y/(x-3)", labelSize: 18 },
            { type: "box", x: 930, y: 120, w: 250, h: 80, color: "#64748b", label: "(iv) 4(2t-1)/3", labelSize: 16 },
          ],
        },
        {
          label: "4,5. வினா 4,5",
          say: "4. x=(a+4)/[3(a+1)], y=(a+4)/[2(a+1)] எனக் காரணிப்படுத்தலாம். x/y=2/3 ⇒ x²y⁻²=(x/y)²=4/9. 5. p(x)=(x-7)(x+2). p(x)/q(x)=(x-7)/(x+2) ⇒ q(x)=(x+2)².",
          ops: [
            { type: "text", value: "வினா 4: x²y⁻² = 4/9", x: 80, y: 50, color: "#df4da8", size: 24 },
            { type: "box", x: 80, y: 120, w: 500, h: 100, color: "#188e69", label: "வினா 5: q(x) = (x+2)²", labelSize: 26 },
          ],
        },
      ],
      questions: [
        { id: "ex3.5-q1", prompt: "[(p²-10p+21)/(p-7)]×[(p²+p-12)/(p-3)²] எளிய வடிவு?", options: ["p+4", "p-4", "(p+4)/(p-3)"], correctIndex: 0, explanation: "காரணிகள் ரத்தாகி (p+4) கிடைக்கிறது." },
        { id: "ex3.5-q2", prompt: "x=(a+4)/[3(a+1)], y=(a+4)/[2(a+1)] எனில் x²y⁻²?", options: ["4/9", "9/4", "2/3"], correctIndex: 0, explanation: "x/y=2/3 ⇒ (x/y)²=4/9." },
        { id: "ex3.5-q3", prompt: "p(x)=(x-7)(x+2), p(x)/q(x)=(x-7)/(x+2) எனில் q(x)?", options: ["(x+2)²", "(x-7)²", "x+2"], correctIndex: 0, explanation: "q(x)=p(x)×(x+2)/(x-7)=(x+2)²." },
        { id: "ex3.5-q4", prompt: "விகிதமுறு கோவையை வகுக்க என்ன செய்ய வேண்டும்?", options: ["இரண்டாம் கோவையைத் தலைகீழாக்கிப் பெருக்க வேண்டும்", "நேரடியாக வகுக்க வேண்டும்", "கூட்ட வேண்டும்"], correctIndex: 0, explanation: "a/b ÷ c/d = a/b × d/c." },
      ],
    },

    {
      topicId: "பயிற்சி 3.6",
      title: "📘 பயிற்சி 3.6 - முழுத் தீர்வுகள் (கூட்டலும் கழித்தலும்)",
      scenes: [
        {
          label: "1. வினா 1: மூன்று கூட்டல்கள்",
          say: "(i) x(x+1)/(x-2)+x(1-x)/(x-2)=[x²+x+x-x²]/(x-2)=2x/(x-2). (ii) =[2x²+2x-7]/[(x+3)(x-2)]. (iii) x³/(x-y)+y³/(y-x)=(x³-y³)/(x-y)=x²+xy+y².",
          ops: [
            { type: "text", value: "வினா 1: கூட்டுக", x: 80, y: 50, color: "#df4da8", size: 26 },
            { type: "box", x: 80, y: 120, w: 280, h: 90, color: "#39247f", label: "(i) 2x/(x-2)", labelSize: 22 },
            { type: "box", x: 400, y: 120, w: 350, h: 90, color: "#188e69", label: "(ii) (2x²+2x-7)/[(x+3)(x-2)]", labelSize: 15 },
            { type: "box", x: 790, y: 120, w: 300, h: 90, color: "#dc2626", label: "(iii) x²+xy+y²", labelSize: 20 },
          ],
        },
        {
          label: "2,3,4. வினா 2,3,4",
          say: "2(i). =(2x-4)/(x-4)=2(x-2)/(x-4). 2(ii). =-(x-1)/(x+1). 3. =(2x³+1)/(x²+2)². 4. x³+8=(x+2)(x²-2x+4), x²+6x+8=(x+2)(x+4). முதல் கோவை=(x+4)/(x²-2x+4). கழிக்கப்பட்ட கோவை=(x+1)/(x²-2x+4).",
          ops: [
            { type: "box", x: 80, y: 60, w: 450, h: 90, color: "#39247f", label: "வினா 2: (i) 2(x-2)/(x-4)  (ii) -(x-1)/(x+1)", labelSize: 15 },
            { type: "box", x: 580, y: 60, w: 450, h: 90, color: "#188e69", label: "வினா 4: (x+1)/(x²-2x+4)", labelSize: 18 },
          ],
        },
        {
          label: "5. வினா 5: A,B கொண்ட கோவை",
          say: "1/(A-B) - 2B/(A²-B²) = [(A+B)-2B]/(A²-B²) = (A-B)/[(A-B)(A+B)] = 1/(A+B) - இந்த எளிய அடையாளத்தைப் பயன்படுத்தினால் கணக்கு வேகமாகும். A+B=2(4x²+1)/(4x²-1) ⇒ விடை=(4x²-1)/[2(4x²+1)].",
          ops: [
            { type: "text", value: "💡 1/(A-B) - 2B/(A²-B²) = 1/(A+B)", x: 80, y: 50, color: TIP_COLOR, size: 24 },
            { type: "box", x: 80, y: 130, w: 600, h: 100, color: "#188e69", label: "விடை = (4x²-1) / [2(4x²+1)]", labelSize: 24 },
          ],
        },
        {
          label: "6. வினா 6: நிரூபணம்",
          say: "(A+B)²+(A-B)²=2A²+2B² (அடையாளம்). A÷B=x (A,B-ஐப் பிரதியிட்டால்). எனவே LHS=2(A²+B²)/x. A²+B²=(x²+1)/(x+1)². LHS=2(x²+1)/[x(x+1)²]=RHS - நிரூபிக்கப்பட்டது.",
          ops: [
            { type: "text", value: "வினா 6: (A+B)²+(A-B)² = 2A²+2B² அடையாளம் பயன்படுத்தி நிரூபிக்க", x: 80, y: 50, color: "#df4da8", size: 16 },
            { type: "box", x: 80, y: 130, w: 600, h: 100, color: "#188e69", label: "2(A²+B²)/x = 2(x²+1)/[x(x+1)²] ✓", labelSize: 20 },
          ],
        },
        {
          label: "7,8. வினா 7,8: வேலை, விலை கணக்குகள்",
          say: "7. பாரி 4 மணி, யுவன் 6 மணி. இணைந்து: 1/(1/4+1/6)=1/(5/12)=12/5=2.4 மணி நேரம். 8. ஆப்பிள் விலை=2×வாழைப்பழ விலை. ஆப்பிள் எடை=900/p, வாழை எடை=600/p. மொத்தம்=1500/p=50⇒p=30. ஆப்பிள்=30கிகி, வாழை=20கிகி.",
          ops: [
            { type: "text", value: "வினா 7: இணைந்து 2.4 மணி நேரத்தில் முடிக்கலாம்", x: 80, y: 50, color: "#df4da8", size: 22 },
            { type: "box", x: 80, y: 120, w: 500, h: 100, color: "#188e69", label: "வினா 8: ஆப்பிள்=30கிகி, வாழைப்பழம்=20கிகி", labelSize: 20 },
          ],
        },
      ],
      questions: [
        { id: "ex3.6-q1", prompt: "x³/(x-y) + y³/(y-x) எளிய வடிவு?", options: ["x²+xy+y²", "x²-xy+y²", "x+y"], correctIndex: 0, explanation: "(x³-y³)/(x-y)=x²+xy+y²." },
        { id: "ex3.6-q2", prompt: "பாரி 4 மணி நேரத்தில், யுவன் 6 மணி நேரத்தில் ஒரு வேலையை முடிப்பர் எனில் இணைந்து எவ்வளவு நேரம்?", options: ["2.4 மணி நேரம்", "5 மணி நேரம்", "10 மணி நேரம்"], correctIndex: 0, explanation: "1/(1/4+1/6)=12/5=2.4 மணி நேரம்." },
        { id: "ex3.6-q3", prompt: "1/(A-B) - 2B/(A²-B²) எளிய வடிவு?", options: ["1/(A+B)", "1/(A-B)", "2/(A+B)"], correctIndex: 0, explanation: "பொதுத் தொகுதியெடுத்து எளிமைப்படுத்தினால் 1/(A+B) கிடைக்கும்." },
        { id: "ex3.6-q4", prompt: "இனியா 50கிகி பழங்கள் வாங்கினார், ஆப்பிள் விலை வாழையைவிட இருமடங்கு, ஆப்பிள் செலவு ₹1800, வாழை ₹600 எனில் ஆப்பிள் எடை?", options: ["30 கிகி", "20 கிகி", "25 கிகி"], correctIndex: 0, explanation: "p=30 எனக் கண்டு ஆப்பிள் எடை=900/30=30கிகி." },
      ],
    },

    {
      topicId: "பயிற்சி 3.7",
      title: "📘 பயிற்சி 3.7 - முழுத் தீர்வுகள் (வர்க்கமூலம் - காரணி முறை)",
      scenes: [
        {
          label: "1. வினா 1: மூன்று வர்க்கமூலங்கள்",
          say: "(i) 400x⁴y¹²z¹⁶/100x⁸y⁴z⁴=4y⁸z¹²/x⁴ ⇒ வர்க்கமூலம்=2y⁴z⁶/x². (ii) எண் (√7x+√2)², பகுதி (x-1/4)² ⇒ வர்க்கமூலம்=|√7x+√2|/|x-1/4|. (iii) =11(a+b)⁴(x+y)⁴/[9(a-b)⁶].",
          ops: [
            { type: "text", value: "வினா 1: வர்க்கமூலம் காண்க", x: 80, y: 50, color: "#df4da8", size: 24 },
            { type: "box", x: 80, y: 120, w: 350, h: 90, color: "#39247f", label: "(i) 2y⁴z⁶/x²", labelSize: 22 },
            { type: "box", x: 460, y: 120, w: 400, h: 90, color: "#188e69", label: "(ii) |√7x+√2|/|x-1/4|", labelSize: 16 },
            { type: "text", value: "(iii) 11(a+b)⁴(x+y)⁴ / [9(a-b)⁶]", x: 80, y: 240, color: "#39247f", size: 20 },
          ],
        },
        {
          label: "2. வினா 2: காரணிப்படுத்தி வர்க்கமூலம்",
          say: "(i) 4x²+20x+25=(2x+5)² ⇒ வர்க்கமூலம்=|2x+5|. (ii) 9x²-24xy+30xz-40yz+25z²+16y²=(3x-4y+5z)² ⇒ வர்க்கமூலம்=|3x-4y+5z|. (iii) ஒவ்வொரு காரணியையும் காரணிப்படுத்தி ஒரே காரணிகள் மீண்டும் வருவதைக் காண்க.",
          ops: [
            { type: "box", x: 80, y: 60, w: 400, h: 90, color: "#39247f", label: "(i) |2x+5|", labelSize: 24 },
            { type: "box", x: 520, y: 60, w: 500, h: 90, color: "#188e69", label: "(ii) |3x-4y+5z|", labelSize: 22 },
          ],
        },
        {
          label: "2(iii),(iv). தொடர்ச்சி",
          say: "(iii) 4x²-9x+2=(4x-1)(x-2), 7x²-13x-2=(7x+1)(x-2), 28x²-3x-1=(7x+1)(4x-1). பெருக்கற்பலன்=[(4x-1)(x-2)(7x+1)]² ⇒ வர்க்கமூலம்=|(4x-1)(x-2)(7x+1)|. (iv) ஒவ்வொன்றையும் காரணிப்படுத்தி பெருக்கினால் [(3x+2)(4x+3)(x+2)]²/36 ⇒ வர்க்கமூலம்=|(3x+2)(4x+3)(x+2)|/6.",
          ops: [
            { type: "box", x: 80, y: 60, w: 550, h: 90, color: "#dc2626", label: "(iii) |(4x-1)(x-2)(7x+1)|", labelSize: 18 },
            { type: "box", x: 680, y: 60, w: 450, h: 90, color: "#64748b", label: "(iv) |(3x+2)(4x+3)(x+2)|/6", labelSize: 16 },
          ],
        },
      ],
      questions: [
        { id: "ex3.7-q1", prompt: "4x²+20x+25-ன் வர்க்கமூலம்?", options: ["|2x+5|", "2x+5", "4x+5"], correctIndex: 0, explanation: "4x²+20x+25=(2x+5)²." },
        { id: "ex3.7-q2", prompt: "9x²-24xy+30xz-40yz+25z²+16y²-ன் வர்க்கமூலம்?", options: ["|3x-4y+5z|", "|3x+4y+5z|", "|3x-4y-5z|"], correctIndex: 0, explanation: "இது (3x-4y+5z)²-ன் விரிவு." },
        { id: "ex3.7-q3", prompt: "வர்க்கமூலம் காணும் முன் எதைச் சரிபார்க்க வேண்டும்?", options: ["மாறியின் படி ஏறு/இறங்கு வரிசையில் உள்ளதா", "கோவை எப்போதும் நேர்மறையா", "ஒன்றும் தேவையில்லை"], correctIndex: 0, explanation: "கோவையின் படி ஏறு அல்லது இறங்கு வரிசையில் இருப்பதை உறுதிப்படுத்த வேண்டும்." },
        { id: "ex3.7-q4", prompt: "400x⁴y¹²z¹⁶/100x⁸y⁴z⁴-ன் வர்க்கமூலம்?", options: ["2y⁴z⁶/x²", "4y⁸z¹²/x⁴", "2y⁶z⁸/x²"], correctIndex: 0, explanation: "முதலில் 4y⁸z¹²/x⁴ ஆகச் சுருக்கி, பின் வர்க்கமூலம் எடுக்க 2y⁴z⁶/x²." },
      ],
    },

    {
      topicId: "பயிற்சி 3.8",
      title: "📘 பயிற்சி 3.8 - முழுத் தீர்வுகள் (வர்க்கமூலம் - வகுத்தல் முறை)",
      scenes: [
        {
          label: "1. வினா 1: வகுத்தல் முறையில் வர்க்கமூலம்",
          say: "வர்க்கமூலம் ax²+px+q வடிவில் இருக்கும் என வைத்து (ax²+px+q)²-ஐ விரித்து கெழுக்களை ஒப்பிட்டுத் தீர்க்கலாம் - இது வகுத்தல் முறையின் விளைவுக்குச் சமமான வேகமான வழி. (i) (x²-6x+3)²=x⁴-12x³+42x²-36x+9 ⇒ வர்க்கமூலம்=|x²-6x+3|. (ii) =|2x²-7x-3|.",
          ops: [
            { type: "text", value: "வினா 1: ax²+px+q என வைத்துத் தீர்க்க", x: 80, y: 50, color: "#df4da8", size: 22 },
            { type: "box", x: 80, y: 120, w: 450, h: 90, color: "#39247f", label: "(i) |x²-6x+3|", labelSize: 22 },
            { type: "box", x: 580, y: 120, w: 450, h: 90, color: "#188e69", label: "(ii) |2x²-7x-3|", labelSize: 22 },
          ],
        },
        {
          label: "1(iii),(iv). தொடர்ச்சி",
          say: "(iii) 16x⁴+8x²+1=(4x²+1)² ⇒ வர்க்கமூலம்=|4x²+1|. (iv) 121x⁴-198x³-183x²+216x+144=(11x²-9x-12)² ⇒ வர்க்கமூலம்=|11x²-9x-12|.",
          ops: [
            { type: "box", x: 80, y: 60, w: 450, h: 90, color: "#dc2626", label: "(iii) |4x²+1|", labelSize: 24 },
            { type: "box", x: 580, y: 60, w: 450, h: 90, color: "#64748b", label: "(iv) |11x²-9x-12|", labelSize: 20 },
          ],
        },
        {
          label: "2. வினா 2: முழுவர்க்கமாக a,b காண",
          say: "(i) 4x⁴-12x³+37x²+bx+a. வேர்=2x²-3x+q (2p=-12⇒p=-3). p²+4q=37⇒q=7. 2pq=b=-42. q²=a=49. (ii) ax⁴+bx³+361x²+220x+100. q=10,p=11 (2pq=220). k=12 (p²+2kq=361). a=144,b=264.",
          ops: [
            { type: "box", x: 80, y: 60, w: 500, h: 100, color: "#188e69", label: "(i) a=49, b=-42", labelSize: 26 },
            { type: "box", x: 620, y: 60, w: 450, h: 100, color: "#dc2626", label: "(ii) a=144, b=264", labelSize: 24 },
          ],
        },
        {
          label: "3. வினா 3: முழுவர்க்கமாக m,n காண",
          say: "(i) 36x⁴-60x³+61x²-mx+n. வேர்=6x²-5x+3 (12p=-60⇒p=-5, p²+12q=61⇒q=3). m=30 (2pq=-30=-m), n=9 (q²). (ii) x⁴-8x³+mx²+nx+16. வேர்=x²-4x+4 (q=4). m=24, n=-32.",
          ops: [
            { type: "box", x: 80, y: 60, w: 450, h: 100, color: "#188e69", label: "(i) m=30, n=9", labelSize: 26 },
            { type: "box", x: 580, y: 60, w: 450, h: 100, color: "#dc2626", label: "(ii) m=24, n=-32", labelSize: 24 },
          ],
        },
      ],
      questions: [
        { id: "ex3.8-q1", prompt: "x⁴-12x³+42x²-36x+9-ன் வர்க்கமூலம்?", options: ["|x²-6x+3|", "|x²+6x+3|", "|x²-6x-3|"], correctIndex: 0, explanation: "(x²-6x+3)² விரித்தால் கொடுக்கப்பட்ட கோவை கிடைக்கும்." },
        { id: "ex3.8-q2", prompt: "16x⁴+8x²+1-ன் வர்க்கமூலம்?", options: ["|4x²+1|", "|2x²+1|", "|4x²-1|"], correctIndex: 0, explanation: "16x⁴+8x²+1=(4x²+1)²." },
        { id: "ex3.8-q3", prompt: "ax²+px+q என்ற வடிவை வைத்துத் தீர்க்கும் முறையின் நன்மை என்ன?", options: ["நீண்ட வகுத்தல் இன்றி விரைவாகத் தீர்க்கலாம்", "எப்போதும் தவறான விடை தரும்", "பயன்படாது"], correctIndex: 0, explanation: "கெழுக்களை ஒப்பிட்டு நேரடியாகத் தீர்க்கலாம் - வகுத்தல் முறையை விட வேகமானது." },
        { id: "ex3.8-q4", prompt: "x⁴-8x³+mx²+nx+16 முழுவர்க்கமாக இருக்க m?", options: ["24", "16", "8"], correctIndex: 0, explanation: "வேர்=x²-4x+4 எனக் கண்டால் m=p²+2q=16+8=24." },
      ],
    },

    {
      topicId: "பயிற்சி 3.9",
      title: "📘 பயிற்சி 3.9 - முழுத் தீர்வுகள் (மூலங்களின் கூடுதல்/பெருக்கல்)",
      scenes: [
        {
          label: "1. வினா 1: சமன்பாடு அமைக்க",
          say: "x²-(கூடுதல்)x+(பெருக்கல்)=0 என்ற பொது வடிவம் பயன்படுத்துவோம். (i) -9,20: x²+9x+20=0. (ii) 5/3,4: 3x²-5x+12=0. (iii) -3/2,-1: 2x²+3x-2=0.",
          ops: [
            { type: "text", value: "வினா 1: x² - (கூடுதல்)x + (பெருக்கல்) = 0", x: 80, y: 50, color: "#df4da8", size: 20 },
            { type: "box", x: 80, y: 120, w: 300, h: 90, color: "#39247f", label: "(i) x²+9x+20=0", labelSize: 20 },
            { type: "box", x: 420, y: 120, w: 300, h: 90, color: "#188e69", label: "(ii) 3x²-5x+12=0", labelSize: 18 },
            { type: "box", x: 760, y: 120, w: 300, h: 90, color: "#dc2626", label: "(iii) 2x²+3x-2=0", labelSize: 18 },
          ],
        },
        {
          label: "2. வினா 2: கூடுதலும் பெருக்கலும் காண்க",
          say: "sum=-b/a, product=c/a பயன்படுத்துவோம். (i) x²+3x-28=0: கூடுதல்=-3,பெருக்கல்=-28. (ii) x²+3x=0: கூடுதல்=-3,பெருக்கல்=0. (iii) 3a²+a-10=0: கூடுதல்=-1/3,பெருக்கல்=-10/3. (iv) 3y²-y-4=0: கூடுதல்=1/3,பெருக்கல்=-4/3.",
          ops: [
            { type: "text", value: "வினா 2: கூடுதல் = -b/a, பெருக்கல் = c/a", x: 80, y: 50, color: "#df4da8", size: 20 },
            { type: "box", x: 80, y: 120, w: 500, h: 90, color: "#39247f", label: "(i) -3, -28   (ii) -3, 0", labelSize: 20 },
            { type: "box", x: 620, y: 120, w: 450, h: 90, color: "#188e69", label: "(iv) 1/3, -4/3", labelSize: 20 },
          ],
        },
      ],
      questions: [
        { id: "ex3.9-q1", prompt: "மூலங்களின் கூடுதல் -9, பெருக்கல் 20 எனில் சமன்பாடு?", options: ["x²+9x+20=0", "x²-9x+20=0", "x²+9x-20=0"], correctIndex: 0, explanation: "x²-(கூடுதல்)x+(பெருக்கல்)=x²+9x+20=0." },
        { id: "ex3.9-q2", prompt: "x²+3x-28=0-ன் மூலங்களின் பெருக்கல்?", options: ["-28", "28", "-3"], correctIndex: 0, explanation: "பெருக்கல்=c/a=-28/1=-28." },
        { id: "ex3.9-q3", prompt: "3y²-y-4=0-ன் மூலங்களின் கூடுதல்?", options: ["1/3", "-1/3", "4/3"], correctIndex: 0, explanation: "கூடுதல்=-b/a=-(-1)/3=1/3." },
        { id: "ex3.9-q4", prompt: "x²+3x=0-ன் மூலங்களின் பெருக்கல்?", options: ["0", "3", "-3"], correctIndex: 0, explanation: "c=0 என்பதால் பெருக்கல்=c/a=0." },
      ],
    },

    {
      topicId: "பயிற்சி 3.10",
      title: "📘 பயிற்சி 3.10 - முழுத் தீர்வுகள் (காரணிப்படுத்தல் முறை)",
      scenes: [
        {
          label: "1(i)-(iii). வினா 1(i)-(iii)",
          say: "(i) 4x²-7x-2=0: 4x²-8x+x-2=0 ⇒ (4x+1)(x-2)=0 ⇒ x=-1/4,2. (ii) 2p²-5p-18=0 ⇒ (2p-9)(p+2)=0 ⇒ p=9/2,-2. (iii) a(a-7)=18 ⇒ a²-7a-18=0 ⇒ (a-9)(a+2)=0 ⇒ a=9,-2.",
          ops: [
            { type: "text", value: "வினா 1: காரணிப்படுத்தல் முறையில் தீர்க்க", x: 80, y: 50, color: "#df4da8", size: 22 },
            { type: "box", x: 80, y: 120, w: 300, h: 90, color: "#39247f", label: "(i) x=-1/4, 2", labelSize: 22 },
            { type: "box", x: 420, y: 120, w: 300, h: 90, color: "#188e69", label: "(ii) p=9/2, -2", labelSize: 20 },
            { type: "box", x: 760, y: 120, w: 300, h: 90, color: "#dc2626", label: "(iii) a=9, -2", labelSize: 22 },
          ],
        },
        {
          label: "1(iv),(v). தொடர்ச்சி",
          say: "(iv) √2x²+7x+5√2=0 ⇒ (x+√2)(√2x+5)=0 ⇒ x=-√2, -5√2/2. (v) 2x²-x+1/8=0 ⇒ ×8: 16x²-8x+1=0 ⇒ (4x-1)²=0 ⇒ x=1/4 (இரட்டை வேர்).",
          ops: [
            { type: "box", x: 80, y: 60, w: 500, h: 90, color: "#39247f", label: "(iv) x=-√2, -5√2/2", labelSize: 20 },
            { type: "box", x: 620, y: 60, w: 400, h: 90, color: "#188e69", label: "(v) x=1/4 (இரட்டை வேர்)", labelSize: 18 },
          ],
        },
        {
          label: "2. வினா 2: கையுந்து போட்டிகள்",
          say: "G(n)=(n²-n)/2=15 ⇒ n²-n-30=0 ⇒ (n-6)(n+5)=0 ⇒ n=6 (மிகை மதிப்பு மட்டும் எடுக்க வேண்டும்).",
          ops: [
            { type: "text", value: "வினா 2: (n²-n)/2 = 15", x: 80, y: 50, color: "#df4da8", size: 26 },
            { type: "box", x: 80, y: 120, w: 500, h: 100, color: "#188e69", label: "n = 6 அணிகள்", labelSize: 30 },
          ],
        },
      ],
      questions: [
        { id: "ex3.10-q1", prompt: "4x²-7x-2=0-ன் மூலங்கள்?", options: ["-1/4, 2", "1/4, -2", "-1/4, -2"], correctIndex: 0, explanation: "(4x+1)(x-2)=0 ⇒ x=-1/4 அல்லது 2." },
        { id: "ex3.10-q2", prompt: "2x²-x+1/8=0-ன் மூலங்கள்?", options: ["x=1/4 (இரட்டை வேர்)", "x=1/2, 1/4", "x=-1/4"], correctIndex: 0, explanation: "16x²-8x+1=(4x-1)²=0 ⇒ இரட்டை வேர் x=1/4." },
        { id: "ex3.10-q3", prompt: "n அணிகள் கொண்ட போட்டியில் G(n)=(n²-n)/2=15 எனில் n?", options: ["6", "5", "7"], correctIndex: 0, explanation: "(n-6)(n+5)=0 ⇒ n=6 (மிகை மதிப்பு)." },
        { id: "ex3.10-q4", prompt: "a(a-7)=18 சமன்பாட்டின் மூலங்கள்?", options: ["9, -2", "9, 2", "-9, 2"], correctIndex: 0, explanation: "a²-7a-18=0 ⇒ (a-9)(a+2)=0 ⇒ a=9,-2." },
      ],
    },

    {
      topicId: "பயிற்சி 3.11",
      title: "📘 பயிற்சி 3.11 - முழுத் தீர்வுகள் (வர்க்கப்பூர்த்தி & சூத்திர முறை)",
      scenes: [
        {
          label: "1. வினா 1: வர்க்கப்பூர்த்தி முறை",
          say: "(i) 9x²-12x+4=0 ⇒ ÷9: x²-4x/3+4/9=0 ⇒ (x-2/3)²=0 ⇒ x=2/3 (இரட்டை வேர்). (ii) (5x+7)/(x-1)=3x+2 ⇒ 3x²-6x-9=0 ⇒ x²-2x-3=0 ⇒ (x-1)²=4 ⇒ x=3,-1.",
          ops: [
            { type: "text", value: "வினா 1: வர்க்கப்பூர்த்தி முறையில் தீர்க்க", x: 80, y: 50, color: "#df4da8", size: 20 },
            { type: "box", x: 80, y: 120, w: 450, h: 90, color: "#39247f", label: "(i) x=2/3 (இரட்டை வேர்)", labelSize: 18 },
            { type: "box", x: 580, y: 120, w: 450, h: 90, color: "#188e69", label: "(ii) x=3, -1", labelSize: 22 },
          ],
        },
        {
          label: "2. வினா 2: சூத்திர முறை",
          say: "x=[-b±√(b²-4ac)]/2a பயன்படுத்துவோம். (i) 2x²-5x+2=0: D=9 ⇒ x=2,1/2. (ii) √2f²-6f+3√2=0: D=12 ⇒ f=(3√2±√6)/2. (iii) 3y²-20y-23=0: D=676 ⇒ y=23/3,-1. (iv) 36y²-12ay+(a²-b²)=0: D=144b² ⇒ y=(a±b)/6.",
          ops: [
            { type: "text", value: "வினா 2: சூத்திர முறை", x: 80, y: 50, color: "#df4da8", size: 24 },
            { type: "box", x: 80, y: 120, w: 280, h: 80, color: "#39247f", label: "(i) x=2,1/2", labelSize: 20 },
            { type: "box", x: 390, y: 120, w: 300, h: 80, color: "#188e69", label: "(iii) y=23/3,-1", labelSize: 18 },
            { type: "box", x: 720, y: 120, w: 300, h: 80, color: "#dc2626", label: "(iv) y=(a±b)/6", labelSize: 18 },
          ],
        },
        {
          label: "3. வினா 3: பந்தின் தூரம்",
          say: "d=t²-0.75t=11.25 ⇒ 4t²-3t-45=0. D=9+720=729=27². t=(3±27)/8 ⇒ t=3.75 (எதிர்மறை நேரம் நிராகரிக்கப்படும்).",
          ops: [
            { type: "text", value: "வினா 3: t² - 0.75t = 11.25", x: 80, y: 50, color: "#df4da8", size: 26 },
            { type: "box", x: 80, y: 120, w: 500, h: 100, color: "#188e69", label: "t = 3.75 வினாடிகள்", labelSize: 28 },
          ],
        },
      ],
      questions: [
        { id: "ex3.11-q1", prompt: "9x²-12x+4=0-ன் மூலங்கள்?", options: ["x=2/3 (இரட்டை வேர்)", "x=4/3,1/3", "x=3/2"], correctIndex: 0, explanation: "(x-2/3)²=0 ⇒ இரட்டை வேர் x=2/3." },
        { id: "ex3.11-q2", prompt: "2x²-5x+2=0-ன் மூலங்கள்?", options: ["2, 1/2", "1, 2", "5, 2"], correctIndex: 0, explanation: "D=9, x=(5±3)/4 ⇒ x=2,1/2." },
        { id: "ex3.11-q3", prompt: "d=t²-0.75t=11.25 எனில் t?", options: ["3.75", "3", "4.5"], correctIndex: 0, explanation: "4t²-3t-45=0, D=729 ⇒ t=(3+27)/8=3.75." },
        { id: "ex3.11-q4", prompt: "3y²-20y-23=0-ன் மூலங்கள்?", options: ["23/3, -1", "-23/3, 1", "23, -3"], correctIndex: 0, explanation: "D=676=26² ⇒ y=(20±26)/6 ⇒ y=23/3 அல்லது -1." },
      ],
    },

    {
      topicId: "பயிற்சி 3.12",
      title: "📘 பயிற்சி 3.12 - முழுத் தீர்வுகள் (நடைமுறைக் கணக்குகள்)",
      scenes: [
        {
          label: "1,2,3. வினா 1,2,3",
          say: "1. x-1/x=24/5 ⇒ 5x²-24x-5=0 ⇒ x=5 அல்லது -1/5. 2. 4w²+56w-285=0 ⇒ w=(-14+√481)/2≈3.97மீ. 3. 90/v-90/(v+15)=0.5 ⇒ v²+15v-2700=0 ⇒ v=45கி.மீ/மணி.",
          ops: [
            { type: "text", value: "வினா 1: x=5 அல்லது -1/5", x: 80, y: 50, color: "#df4da8", size: 22 },
            { type: "box", x: 80, y: 120, w: 400, h: 90, color: "#39247f", label: "வினா 2: w ≈ 3.97 மீ", labelSize: 20 },
            { type: "box", x: 520, y: 120, w: 400, h: 90, color: "#188e69", label: "வினா 3: வேகம் = 45 கி.மீ/மணி", labelSize: 18 },
          ],
        },
        {
          label: "4,5. வினா 4,5",
          say: "4. 2y²+15y-350=0 ⇒ y=10. சகோதரியின் வயது=10, பெண்ணின் வயது=20. 5. PQ=20(விட்டம்), QR-PR வித்தியாசம்=4, PR²+QR²=400 (அரைவட்டக் கோணம் 90°). தீர்த்தால் QR=12,PR=16.",
          ops: [
            { type: "box", x: 80, y: 60, w: 450, h: 100, color: "#39247f", label: "வினா 4: பெண்=20, சகோதரி=10 வயது", labelSize: 18 },
            { type: "box", x: 580, y: 60, w: 450, h: 100, color: "#188e69", label: "வினா 5: 16மீ, 12மீ இருகதவுகளிலிருந்து", labelSize: 16 },
          ],
        },
        {
          label: "6,7. வினா 6,7",
          say: "6. x+16x²/9+2=2x² ⇒ 2x²-9x-18=0 ⇒ x=6. மொத்த தேனீக்கள்=2x²=72. 7. சம ஒலிக்கு 4/d1²=9/d2², d1+d2=70 ⇒ d1=28மீ, d2=42மீ.",
          ops: [
            { type: "text", value: "வினா 6: மொத்த தேனீக்கள் = 72", x: 80, y: 50, color: "#df4da8", size: 24 },
            { type: "box", x: 80, y: 120, w: 500, h: 100, color: "#188e69", label: "வினா 7: 28மீ மற்றும் 42மீ தொலைவில்", labelSize: 20 },
          ],
        },
        {
          label: "8,9. வினா 8,9",
          say: "8. 3s²+4(100-s²)=364 ⇒ s²=36 ⇒ s=6மீ. பாதை அகலம்=(10-6)/2=2மீ. 9. a+b=31, a²+b²=625 ⇒ ab=168. t²-31t+168=0 ⇒ t=24,7. சிறிய பக்கம்=7செ.மீ.",
          ops: [
            { type: "box", x: 80, y: 60, w: 450, h: 90, color: "#39247f", label: "வினா 8: பாதை அகலம் = 2 மீ", labelSize: 22 },
            { type: "box", x: 580, y: 60, w: 450, h: 90, color: "#188e69", label: "வினா 9: சிறிய பக்கம் = 7 செ.மீ", labelSize: 20 },
          ],
        },
      ],
      questions: [
        { id: "ex3.12-q1", prompt: "ஓர் எண்ணும் அதன் தலைகீழியும் வித்தியாசம் 24/5 எனில் எண்?", options: ["5", "4", "6"], correctIndex: 0, explanation: "5x²-24x-5=0 ⇒ x=5 அல்லது -1/5." },
        { id: "ex3.12-q2", prompt: "பேருந்து வேகம் 15கி.மீ அதிகரித்தால் 90கி.மீ பயணநேரம் 30நிமிடம் குறையும் எனில் அசல் வேகம்?", options: ["45 கி.மீ/மணி", "30 கி.மீ/மணி", "60 கி.மீ/மணி"], correctIndex: 0, explanation: "v²+15v-2700=0 ⇒ v=45." },
        { id: "ex3.12-q3", prompt: "செங்கோண முக்கோணத்தின் கர்ணம் 25செ.மீ, சுற்றளவு 56செ.மீ எனில் சிறிய பக்கம்?", options: ["7 செ.மீ", "24 செ.மீ", "17 செ.மீ"], correctIndex: 0, explanation: "a+b=31, ab=168 ⇒ பக்கங்கள் 24,7 - சிறியது 7." },
        { id: "ex3.12-q4", prompt: "ஒரு பெண்ணின் வயது சகோதரியைவிட இருமடங்கு, 5 ஆண்டுகள் பின் பெருக்கல் 375 எனில் சகோதரியின் தற்போதைய வயது?", options: ["10", "15", "20"], correctIndex: 0, explanation: "2y²+15y-350=0 ⇒ y=10." },
      ],
    },

    {
      topicId: "பயிற்சி 3.13",
      title: "📘 பயிற்சி 3.13 - முழுத் தீர்வுகள் (மூலங்களின் தன்மை)",
      scenes: [
        {
          label: "1. வினா 1: தன்மையைக் கூறுக (Δ=b²-4ac)",
          say: "(i) 15x²+11x+2=0: Δ=1>0, முழுவர்க்கம் ⇒ மெய் & விகிதமுறு. (ii) x²-x-1=0: Δ=5>0, முழுவர்க்கமல்ல ⇒ மெய் & விகிதமுறா. (iii) √2t²-3t+3√2=0: Δ=-15<0 ⇒ மெய் மூலம் இல்லை. (iv),(v): Δ=0 ⇒ மெய் & சமம்.",
          ops: [
            { type: "text", value: "வினா 1: Δ = b² - 4ac கணக்கிடு", x: 80, y: 50, color: "#df4da8", size: 22 },
            { type: "box", x: 80, y: 120, w: 300, h: 90, color: "#39247f", label: "(i) Δ=1>0 விகிதமுறு", labelSize: 16 },
            { type: "box", x: 420, y: 120, w: 300, h: 90, color: "#188e69", label: "(ii) Δ=5>0 விகிதமுறா", labelSize: 16 },
            { type: "box", x: 760, y: 120, w: 300, h: 90, color: "#dc2626", label: "(iii) Δ=-15<0 மூலமில்லை", labelSize: 15 },
          ],
        },
        {
          label: "2. வினா 2: மெய்&சமம் ஆக k காண",
          say: "Δ=0 எனக்கொண்டு தீர்ப்போம். (i) (5k-6)x²+2kx+1=0: 4k²-4(5k-6)=0 ⇒ k²-5k+6=0 ⇒ k=2,3. (ii) kx²+(6k+2)x+16=0: 36k²-40k+4=0 ⇒ 9k²-10k+1=0 ⇒ k=1/9,1.",
          ops: [
            { type: "box", x: 80, y: 60, w: 450, h: 90, color: "#39247f", label: "(i) k = 2, 3", labelSize: 26 },
            { type: "box", x: 580, y: 60, w: 450, h: 90, color: "#188e69", label: "(ii) k = 1/9, 1", labelSize: 24 },
          ],
        },
        {
          label: "3,4,5. வினா 3,4,5: நிரூபணங்கள்",
          say: "3. கெழுக்களின் கூடுதல்=0 என்பதால் x=1 எப்போதும் மூலம். மூலங்கள் சமம் என்பதால் பெருக்கல்=1 ⇒ (c-a)/(a-b)=1 ⇒ 2a=b+c - b,a,c AP ஆகும். 4. Δ=72(a²+b²)>0 (a≠b) ⇒ மெய் & சமமில்லை. 5. Δ=0-ஐ விரித்தால் a(a³+b³+c³-3abc)=0 ⇒ a=0 அல்லது a³+b³+c³=3abc.",
          ops: [
            { type: "text", value: "வினா 3,4,5: Δ=0 அல்லது Δ>0 என விரித்துக் காரணிப்படுத்துதல்", x: 80, y: 50, color: "#df4da8", size: 16 },
            { type: "box", x: 80, y: 130, w: 1000, h: 110, color: "#188e69", label: "3. 2a=b+c  4. Δ=72(a²+b²)>0  5. a=0 அல்லது a³+b³+c³=3abc", labelSize: 16 },
          ],
        },
      ],
      questions: [
        { id: "ex3.13-q1", prompt: "15x²+11x+2=0-ன் மூலங்களின் தன்மை?", options: ["மெய் மற்றும் விகிதமுறு", "மெய் மூலம் இல்லை", "மெய் மற்றும் சமம்"], correctIndex: 0, explanation: "Δ=121-120=1>0 மற்றும் முழுவர்க்கம் ⇒ விகிதமுறு மூலங்கள்." },
        { id: "ex3.13-q2", prompt: "Δ=0 எனில் மூலங்கள் எப்படி இருக்கும்?", options: ["மெய் மற்றும் சமம்", "மெய் மற்றும் சமமில்லை", "மெய் மூலம் இல்லை"], correctIndex: 0, explanation: "Δ=0 எனில் இரு மூலங்களும் சமமாக இருக்கும்." },
        { id: "ex3.13-q3", prompt: "(5k-6)x²+2kx+1=0 மூலங்கள் சமமாக இருக்க k?", options: ["2, 3", "1, 2", "3, 4"], correctIndex: 0, explanation: "k²-5k+6=0 ⇒ (k-2)(k-3)=0." },
        { id: "ex3.13-q4", prompt: "√2t²-3t+3√2=0-ன் Δ?", options: ["-15 (மூலமில்லை)", "9 (மெய் மூலங்கள்)", "0 (சமம்)"], correctIndex: 0, explanation: "Δ=9-24=-15<0." },
      ],
    },

    {
      topicId: "பயிற்சி 3.14",
      title: "📘 பயிற்சி 3.14 - முழுத் தீர்வுகள் (மூலங்கள்-கெழுக்கள் தொடர்பு)",
      scenes: [
        {
          label: "1. வினா 1: α+β, αβ வாயிலாக மாற்றுக",
          say: "(i) α/3β+β/3α=[(α+β)²-2αβ]/(3αβ). (ii) 1/(α²β)+1/(β²α)=(α+β)/(αβ)². (iii) (3α-1)(3β-1)=9αβ-3(α+β)+1. (iv) (α+3)/β+(β+3)/α=[(α+β)²-2αβ+3(α+β)]/(αβ).",
          ops: [
            { type: "text", value: "வினா 1: α²+β²=(α+β)²-2αβ பயன்படுத்து", x: 80, y: 50, color: "#df4da8", size: 20 },
            { type: "box", x: 80, y: 130, w: 1000, h: 90, color: "#188e69", label: "ஒவ்வொரு கோவையையும் α+β, αβ வடிவில் மாற்றுக", labelSize: 18 },
          ],
        },
        {
          label: "2. வினா 2: 2x²-7x+5=0 (α+β=7/2, αβ=5/2)",
          say: "(i) 1/α+1/β=(α+β)/αβ=7/5. (ii) α/β+β/α=[(α+β)²-2αβ]/αβ=(29/4)/(5/2)=29/10. (iii) (α+2)/(β+2)+(β+2)/(α+2)=13/6.",
          ops: [
            { type: "box", x: 80, y: 60, w: 300, h: 90, color: "#39247f", label: "(i) 7/5", labelSize: 26 },
            { type: "box", x: 420, y: 60, w: 300, h: 90, color: "#188e69", label: "(ii) 29/10", labelSize: 24 },
            { type: "box", x: 760, y: 60, w: 300, h: 90, color: "#dc2626", label: "(iii) 13/6", labelSize: 24 },
          ],
        },
        {
          label: "3. வினா 3: புதிய சமன்பாடுகள் அமைக்க",
          say: "x²+6x-4=0, α+β=-6, αβ=-4. (i) α²,β² வேர்களாக: x²-44x+16=0. (ii) 2/α,2/β வேர்களாக: x²-3x-1=0. (iii) α²β,β²α வேர்களாக: x²-24x-64=0.",
          ops: [
            { type: "box", x: 80, y: 60, w: 320, h: 90, color: "#39247f", label: "(i) x²-44x+16=0", labelSize: 18 },
            { type: "box", x: 430, y: 60, w: 300, h: 90, color: "#188e69", label: "(ii) x²-3x-1=0", labelSize: 20 },
            { type: "box", x: 760, y: 60, w: 320, h: 90, color: "#dc2626", label: "(iii) x²-24x-64=0", labelSize: 18 },
          ],
        },
        {
          label: "4,5,6. வினா 4,5,6",
          say: "4. (β-α)²=(α+β)²-4αβ ⇒ 169/49=a²/49-8/7 ⇒ a²=225 ⇒ a=±15. 5. வேர்கள் r,2r: r²=16⇒r=±4 ⇒ a=±24. 6. வேர்கள் r,r²: r³=27⇒r=3, கூடுதல்=12=-k/3 ⇒ k=-36.",
          ops: [
            { type: "box", x: 80, y: 60, w: 300, h: 90, color: "#39247f", label: "4. a = ±15", labelSize: 24 },
            { type: "box", x: 420, y: 60, w: 300, h: 90, color: "#188e69", label: "5. a = ±24", labelSize: 24 },
            { type: "box", x: 760, y: 60, w: 300, h: 90, color: "#dc2626", label: "6. k = -36", labelSize: 24 },
          ],
        },
      ],
      questions: [
        { id: "ex3.14-q1", prompt: "2x²-7x+5=0, α+β=7/2,αβ=5/2 எனில் 1/α+1/β?", options: ["7/5", "5/7", "2/7"], correctIndex: 0, explanation: "(α+β)/(αβ)=(7/2)/(5/2)=7/5." },
        { id: "ex3.14-q2", prompt: "x²+6x-4=0-ன் மூலங்கள் α,β எனில், α²,β² மூலங்களாகக் கொண்ட சமன்பாடு?", options: ["x²-44x+16=0", "x²-36x+16=0", "x²-44x-16=0"], correctIndex: 0, explanation: "α²+β²=44, α²β²=16." },
        { id: "ex3.14-q3", prompt: "7x²+ax+2=0-ன் மூலங்கள் β-α=-13/7 எனில் a?", options: ["±15", "±13", "±7"], correctIndex: 0, explanation: "(β-α)²=(α+β)²-4αβ தீர்த்தால் a²=225 ⇒ a=±15." },
        { id: "ex3.14-q4", prompt: "3x²+kx+81=0-ல் ஒரு மூலம் மற்றதின் வர்க்கம் எனில் k?", options: ["-36", "36", "-27"], correctIndex: 0, explanation: "r³=27⇒r=3, கூடுதல்=12=-k/3 ⇒ k=-36." },
      ],
    },

    {
      topicId: "பயிற்சி 3.15",
      title: "📘 பயிற்சி 3.15 - முழுத் தீர்வுகள் (மாறுபாட்டு வரைபடங்கள்)",
      scenes: [
        {
          label: "1,2. வினா 1,2: தள்ளுபடி & xy=24",
          say: "1. தள்ளுபடி=0.5×விலை. (i) தள்ளுபடி 3250 ⇒ விலை=3250/0.5=₹6500. (ii) விலை 2500 ⇒ தள்ளுபடி=1250. 2. xy=24 (நேர்மாறு பெருக்கல்). (i) x=3⇒y=8. (ii) y=6⇒x=4.",
          ops: [
            { type: "text", value: "வினா 1: விலை = தள்ளுபடி / 0.5", x: 80, y: 50, color: "#df4da8", size: 20 },
            { type: "box", x: 80, y: 120, w: 450, h: 90, color: "#39247f", label: "(i) விலை=₹6500  (ii) தள்ளுபடி=₹1250", labelSize: 16 },
            { type: "box", x: 580, y: 120, w: 450, h: 90, color: "#188e69", label: "வினா 2: (i) y=8   (ii) x=4", labelSize: 20 },
          ],
        },
        {
          label: "3,4. வினா 3,4",
          say: "3. y=x/2 (சாய்வு 1/2). (i) x=9⇒y=4.5. (ii) y=7.5⇒x=15. 4. குழாய்கள்×நேரம்=90 (நேர்மாறு பெருக்கல்). (i) 5 குழாய்கள்⇒நேரம்=18நிமிடம். (ii) 9நிமிடம்⇒குழாய்கள்=10.",
          ops: [
            { type: "box", x: 80, y: 60, w: 450, h: 90, color: "#39247f", label: "வினா 3: (i) y=4.5  (ii) x=15", labelSize: 20 },
            { type: "box", x: 580, y: 60, w: 450, h: 90, color: "#188e69", label: "வினா 4: (i) 18நிமிடம் (ii) 10குழாய்", labelSize: 16 },
          ],
        },
        {
          label: "5,6. வினா 5,6",
          say: "5. பங்கேற்பாளர்×தொகை=360 (நேர்மாறு பெருக்கல்). 12 பங்கேற்பாளர்⇒தொகை=₹30. 6. கட்டணம்/நேரம்=15 (நேரடி மாறுபாடு, y=15x). (i) x=6⇒y=₹90. (ii) y=150⇒x=10மணி.",
          ops: [
            { type: "text", value: "வினா 5: 12 பேருக்கு தலா ₹30", x: 80, y: 50, color: "#df4da8", size: 22 },
            { type: "box", x: 80, y: 120, w: 500, h: 100, color: "#188e69", label: "வினா 6: நேரடி மாறுபாடு y=15x; (i) ₹90 (ii) 10மணி", labelSize: 16 },
          ],
        },
      ],
      questions: [
        { id: "ex3.15-q1", prompt: "xy=24-ல் x=3 எனில் y?", options: ["8", "6", "4"], correctIndex: 0, explanation: "y=24/3=8." },
        { id: "ex3.15-q2", prompt: "y=x/2-ல் x=9 எனில் y?", options: ["4.5", "18", "4"], correctIndex: 0, explanation: "y=9/2=4.5." },
        { id: "ex3.15-q3", prompt: "குழாய்கள்×நேரம்=90 எனில் 9 குழாய்கள் தொட்டியை நிரப்ப எவ்வளவு நேரம்?", options: ["10 நிமிடம்", "9 நிமிடம்", "18 நிமிடம்"], correctIndex: 0, explanation: "90/9=10 நிமிடம்." },
        { id: "ex3.15-q4", prompt: "வாகன நிறுத்த கட்டணம் y=15x (நேரடி மாறுபாடு) எனில் x=6 மணிக்கு y?", options: ["₹90", "₹60", "₹120"], correctIndex: 0, explanation: "y=15×6=90." },
      ],
    },

    {
      topicId: "பயிற்சி 3.16",
      title: "📘 பயிற்சி 3.16 - முழுத் தீர்வுகள் (பரவளைய வரைபடங்கள்)",
      scenes: [
        {
          label: "1. வினா 1: மூலங்களின் தன்மை (வரைபடம்)",
          say: "Δ மதிப்பைப் பொறுத்து பரவளையம் x-அச்சை எப்படி சந்திக்கும் எனக் காணலாம். (i),(iv),(vi): Δ>0 ⇒ 2 புள்ளிகளில் வெட்டும். (ii),(v): Δ=0 ⇒ ஒரு புள்ளியில் தொடும். (iii): Δ<0 ⇒ x-அச்சைத் தொடாது.",
          ops: [
            { type: "text", value: "வினா 1: பரவளையமும் x-அச்சும்", x: 80, y: 50, color: "#df4da8", size: 24 },
            { type: "box", x: 80, y: 120, w: 350, h: 90, color: "#188e69", label: "(i),(iv),(vi): 2 புள்ளிகள்", labelSize: 18 },
            { type: "box", x: 450, y: 120, w: 300, h: 90, color: TIP_COLOR, label: "(ii),(v): 1 புள்ளி (தொடும்)", labelSize: 16 },
            { type: "box", x: 770, y: 120, w: 300, h: 90, color: "#dc2626", label: "(iii): சந்திக்காது", labelSize: 18 },
          ],
        },
        {
          label: "2-4. வினா 2,3,4: வரைபடத்துடன் தொடர்புடைய கோடு",
          say: "ஒவ்வொரு கணக்கிலும் கொடுக்கப்பட்ட பரவளையத்தின் சமன்பாட்டிலிருந்து தேவையான சமன்பாட்டைக் கழித்து ஒரு நேர்க்கோடு பெறுவோம், அதை பரவளையத்துடன் வெட்டும் புள்ளிகளே மூலங்கள். 2. x²-x-12=0 ⇒ x=4,-3. 3. x²+1=0 ⇒ மெய் மூலம் இல்லை (கோடு பரவளையத்தைத் தொடாது). 4. x²+2x+1=0 ⇒ x=-1 (இரட்டை வேர்).",
          ops: [
            { type: "box", x: 80, y: 60, w: 320, h: 90, color: "#39247f", label: "வினா 2: x=4, -3", labelSize: 22 },
            { type: "box", x: 430, y: 60, w: 320, h: 90, color: "#dc2626", label: "வினா 3: மெய் மூலம் இல்லை", labelSize: 16 },
            { type: "box", x: 780, y: 60, w: 280, h: 90, color: "#188e69", label: "வினா 4: x=-1", labelSize: 22 },
          ],
        },
        {
          label: "5-8. வினா 5,6,7,8",
          say: "5. y=x²+3x-4 நேரடியாகவே x²+3x-4=0 ⇒ x=-4,1. 6. x²-5x-14=0 ⇒ x=7,-2 (y=8 கோட்டுடன் வெட்டும் புள்ளிகள்). 7. 2x²-4x-6=0 ⇒ x²-2x-3=0 ⇒ x=3,-1. 8. x²-x-6=0 ⇒ x=3,-2.",
          ops: [
            { type: "box", x: 80, y: 60, w: 250, h: 80, color: "#39247f", label: "5. x=-4,1", labelSize: 20 },
            { type: "box", x: 350, y: 60, w: 250, h: 80, color: "#188e69", label: "6. x=7,-2", labelSize: 20 },
            { type: "box", x: 620, y: 60, w: 250, h: 80, color: "#dc2626", label: "7. x=3,-1", labelSize: 20 },
            { type: "box", x: 890, y: 60, w: 250, h: 80, color: "#64748b", label: "8. x=3,-2", labelSize: 20 },
          ],
        },
      ],
      questions: [
        { id: "ex3.16-q1", prompt: "x²-4x+4=0-ன் வரைபடம் x-அச்சுடன் எவ்வாறு தொடர்பு கொள்ளும்?", options: ["ஒரு புள்ளியில் தொடும்", "இரு புள்ளிகளில் வெட்டும்", "சந்திக்காது"], correctIndex: 0, explanation: "Δ=0 என்பதால் பரவளையம் x-அச்சைத் தொடும் (x=2)." },
        { id: "ex3.16-q2", prompt: "x²+x+7=0-ன் வரைபடம் x-அச்சுடன் எவ்வாறு தொடர்பு கொள்ளும்?", options: ["சந்திக்காது", "ஒரு புள்ளியில் தொடும்", "இரு புள்ளிகளில் வெட்டும்"], correctIndex: 0, explanation: "Δ=1-28=-27<0 ⇒ மெய் மூலம் இல்லை." },
        { id: "ex3.16-q3", prompt: "y=x²+3x-4 பயன்படுத்தி x²+3x-4=0 தீர்த்தால்?", options: ["x=-4,1", "x=4,-1", "x=-4,-1"], correctIndex: 0, explanation: "(x+4)(x-1)=0 ⇒ x=-4,1." },
        { id: "ex3.16-q4", prompt: "y=(x-1)(x+3) பயன்படுத்தி x²-x-6=0 தீர்த்தால்?", options: ["x=3,-2", "x=-3,2", "x=1,-3"], correctIndex: 0, explanation: "(x-3)(x+2)=0 ⇒ x=3,-2." },
      ],
    },
  ],
};
