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
  ],
};
