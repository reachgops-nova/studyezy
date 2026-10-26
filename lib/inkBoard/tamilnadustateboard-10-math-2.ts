import type { InkUnit } from "./types";
import { TIP_COLOR, PRACTICE_COLOR } from "./types";

/**
 * TN Samacheer Kalvi Std 10 Maths (Tamil medium), Unit 2 (எண்களும்
 * தொடர்களும் - Numbers and Sequences): 2.1 Euclid's division algorithm &
 * GCD, 2.2 Arithmetic Progressions, 2.3 Geometric Progressions. Added
 * 2026-10-26, continuing the pilot (Unit 1) pattern.
 *
 * Real direction 2026-10-26: "complete tamilmedium math for 10th full
 * units .. ask them to write and solve more examples" - every topic
 * below ends with a sky-blue (PRACTICE_COLOR) scene giving 2-3 more
 * problems of the same kind to write and solve before the worked
 * solution is shown, per the new standing house style in types.ts.
 */
export const TAMILNADU_10_MATH_2: InkUnit = {
  unitKey: "tamilnadustateboard-10-math-2",
  title: "எண்களும் தொடர்களும் (Numbers and Sequences)",
  badge: "10 ஆம் வகுப்பு · இயல் 2",
  languageCode: "ta-IN",

  topics: [
    {
      topicId: "2.1",
      title: "வகுத்தறி வழிமுறையும் மீ.பொ.வ காண்பதும்",
      scenes: [
        {
          label: "1. யூக்லிட் வகுத்தறி வழிமுறை",
          say: "இரு நேர்ம முழு எண்கள் a, b (a பெரியது) க்கு, a-வை b-ஆல் வகுத்தால் a = bq + r என எழுதலாம். இங்கு q ஈவு, r மீதி, 0 ≤ r < b. இதுவே யூக்லிட் வகுத்தறி வழிமுறை.",
          ops: [
            { type: "text", value: "யூக்லிட் வகுத்தறி வழிமுறை", x: 80, y: 70, color: "#df4da8", size: 32 },
            { type: "box", x: 200, y: 150, w: 600, h: 120, color: "#39247f", label: "a = bq + r   (0 ≤ r < b)", labelSize: 32 },
            { type: "text", value: "a = பெரிய எண், b = சிறிய எண், q = ஈவு, r = மீதி", x: 80, y: 320, color: "#64748b", size: 22 },
          ],
        },
        {
          label: "2. மீ.பொ.வ காணும் முறை",
          say: "மீ.பொ.வ(455, 42) காண்போம். 455 = 42×10 + 35. பின் 42 = 35×1 + 7. பின் 35 = 7×5 + 0. மீதி பூஜ்ஜியமான கட்டத்தில் வகுத்தி 7-ஆக இருப்பதால், மீ.பொ.வ = 7.",
          ops: [
            { type: "text", value: "மீ.பொ.வ(455, 42) காண்போம்", x: 80, y: 60, color: "#df4da8", size: 28 },
            { type: "box", x: 80, y: 130, w: 500, h: 80, color: "#188e69", label: "455 = 42×10 + 35", labelSize: 24 },
            { type: "box", x: 80, y: 220, w: 500, h: 80, color: "#188e69", label: "42 = 35×1 + 7", labelSize: 24 },
            { type: "box", x: 80, y: 310, w: 500, h: 80, color: "#188e69", label: "35 = 7×5 + 0", labelSize: 24 },
            { type: "text", value: "மீதி 0 ஆன கட்டத்தின் வகுத்தி = மீ.பொ.வ = 7", x: 80, y: 430, color: "#39247f", size: 26 },
          ],
        },
        {
          label: "3. 💡 வேகமாக நினைவில் வைக்க",
          say: "மீ.பொ.வ காணும் வழிமுறையை 'பெரிய எண்ணை சிறிய எண்ணால் வகு, மீதியால் மீண்டும் வகு' எனும் ஒரே வாக்கியமாக நினைவில் வையுங்கள். மீதி பூஜ்ஜியமான கணத்தில் நிறுத்து - கடைசி வகுத்தியே விடை.",
          ops: [
            { type: "text", value: "💡 உத்தி: 'பெரிய ÷ சிறிய, பின் மீதியால் மீண்டும் ÷'", x: 80, y: 50, color: TIP_COLOR, size: 20 },
            { type: "box", x: 80, y: 130, w: 500, h: 110, color: TIP_COLOR, label: "மீதி = 0 ஆகும் வரை தொடர்ந்து வகு", labelSize: 22 },
            { type: "text", value: "கடைசி வகுத்தியே மீ.பொ.வ!", x: 80, y: 280, color: "#39247f", size: 24 },
          ],
        },
        {
          label: "4. ✍️ எழுதித் தீர்ப்போம்",
          say: "இப்போது நீங்கள் தீர்க்க வேண்டும். உங்கள் நோட்டுப் புத்தகத்தில் இந்த இரு இணைகளுக்கும் யூக்லிட் வழிமுறையைப் பயன்படுத்தி மீ.பொ.வ காணுங்கள். பின் விடையைச் சரிபார்க்கவும்.",
          ops: [
            { type: "text", value: "✍️ எழுதித் தீர்ப்போம் - மேலும் எடுத்துக்காட்டுகள்", x: 80, y: 50, color: PRACTICE_COLOR, size: 22 },
            { type: "box", x: 80, y: 130, w: 480, h: 100, color: PRACTICE_COLOR, label: "1. மீ.பொ.வ(96, 72) = ?", labelSize: 24 },
            { type: "box", x: 620, y: 130, w: 420, h: 100, color: PRACTICE_COLOR, label: "2. மீ.பொ.வ(867, 255) = ?", labelSize: 22 },
            { type: "text", value: "விடை: 1) 24   2) 51 - உங்கள் படிகளுடன் ஒப்பிடுங்கள்!", x: 80, y: 280, color: "#64748b", size: 22 },
          ],
        },
      ],
      questions: [
        { id: "2.1i-q1", prompt: "யூக்லிட் வகுத்தறி வழிமுறையின்படி a = bq + r-இல் r எவ்வாறு இருக்க வேண்டும்?", options: ["0 ≤ r < b", "r > b", "r = b"], correctIndex: 0, explanation: "மீதி r எப்போதும் 0 முதல் b-க்கு கீழ் வரை இருக்க வேண்டும்." },
        { id: "2.1i-q2", prompt: "மீ.பொ.வ(455, 42) எவ்வளவு?", options: ["7", "35", "42"], correctIndex: 0, explanation: "தொடர்ந்து வகுத்து மீதி 0 ஆகும்போது வகுத்தி 7 ஆகக் கிடைக்கிறது." },
        { id: "2.1i-q3", prompt: "மீ.பொ.வ காணும் வழிமுறையில் எப்போது நிறுத்த வேண்டும்?", options: ["மீதி பூஜ்ஜியமானால்", "ஈவு பூஜ்ஜியமானால்", "ஒருபோதும் நிறுத்தக் கூடாது"], correctIndex: 0, explanation: "மீதி பூஜ்ஜியமான கட்டத்தின் வகுத்தியே மீ.பொ.வ." },
        { id: "2.1i-q4", prompt: "மீ.பொ.வ(96, 72) எவ்வளவு?", options: ["24", "12", "48"], correctIndex: 0, explanation: "96=72×1+24, 72=24×3+0 ⇒ மீ.பொ.வ=24." },
      ],
    },
    {
      topicId: "2.2",
      title: "எண்கணிதத் தொடர் (AP)",
      scenes: [
        {
          label: "1. AP என்றால் என்ன",
          say: "ஒவ்வொரு உறுப்பும் முந்தைய உறுப்புடன் ஒரு மாறா எண்ணைக் கூட்டக் கிடைத்தால் அது எண்கணிதத் தொடர் (AP). 3, 7, 11, 15,... இங்கு ஒவ்வொரு முறையும் 4 கூட்டப்படுகிறது - இதுவே பொது வித்தியாசம் d.",
          ops: [
            { type: "text", value: "எண்கணிதத் தொடர் (AP)", x: 80, y: 70, color: "#df4da8", size: 32 },
            { type: "box", x: 80, y: 150, w: 180, h: 90, color: "#39247f", label: "3", labelSize: 36 },
            { type: "box", x: 300, y: 150, w: 180, h: 90, color: "#39247f", label: "7", labelSize: 36 },
            { type: "box", x: 520, y: 150, w: 180, h: 90, color: "#39247f", label: "11", labelSize: 36 },
            { type: "box", x: 740, y: 150, w: 180, h: 90, color: "#39247f", label: "15", labelSize: 36 },
            { type: "text", value: "+4        +4        +4", x: 190, y: 270, color: "#188e69", size: 26 },
            { type: "text", value: "a = 3 (முதல் உறுப்பு), d = 4 (பொது வித்தியாசம்)", x: 80, y: 340, color: "#64748b", size: 24 },
          ],
        },
        {
          label: "2. n-ஆவது உறுப்பு",
          say: "n-ஆவது உறுப்பு tn = a + (n-1)d எனும் சூத்திரத்தால் காணலாம். 3,7,11,15,... தொடரின் 10-ஆவது உறுப்பு காண்போம். a=3, d=4, n=10. t10 = 3 + 9×4 = 39.",
          ops: [
            { type: "text", value: "n-ஆவது உறுப்பு: tn = a + (n-1)d", x: 80, y: 60, color: "#df4da8", size: 28 },
            { type: "box", x: 80, y: 140, w: 600, h: 110, color: "#188e69", label: "t10 = 3 + (10-1)×4 = 3 + 36 = 39", labelSize: 22 },
          ],
        },
        {
          label: "3. கூடுதல் சூத்திரம்",
          say: "முதல் n உறுப்புகளின் கூடுதல் Sn = n/2 [2a + (n-1)d]. 2+4+6+...+20 இன் கூடுதல் காண்போம். a=2, d=2, n=10. Sn = 10/2 [4+18] = 5×22 = 110. எளிதாக Sn = n/2(a+l) என்றும் பயன்படுத்தலாம், l = 20.",
          ops: [
            { type: "text", value: "கூடுதல்: Sn = n/2 [2a + (n-1)d]", x: 80, y: 60, color: "#df4da8", size: 26 },
            { type: "box", x: 80, y: 140, w: 600, h: 110, color: "#188e69", label: "2+4+...+20: Sn = 10/2(2+20) = 110", labelSize: 20 },
          ],
        },
        {
          label: "4. 💡 சூத்திரங்களை நினைவில் வைக்க",
          say: "tn-இல் 'n-1' இருக்கிறது, ஏனெனில் a-விலிருந்து அடுத்த உறுப்புக்குச் செல்ல ஒரு d கூட்டப்படுகிறது, n-ஆவது உறுப்புக்குப் போக (n-1) முறை d கூட்ட வேண்டும். Sn-ஐ 'சராசரி × உறுப்புகளின் எண்ணிக்கை' என நினைத்தால் Sn=n/2(a+l) எளிதில் புரியும்.",
          ops: [
            { type: "text", value: "💡 உத்தி: n-1 ஏன்? a-விலிருந்து n-ஆவதுக்குப் போக (n-1) படிகள்", x: 80, y: 50, color: TIP_COLOR, size: 18 },
            { type: "box", x: 80, y: 130, w: 500, h: 110, color: TIP_COLOR, label: "Sn = சராசரி(a, l) × n = n/2 (a+l)", labelSize: 20 },
          ],
        },
        {
          label: "5. ✍️ எழுதித் தீர்ப்போம்",
          say: "இப்போது நீங்கள் தீர்க்க வேண்டும். உங்கள் நோட்டுப் புத்தகத்தில் இந்த இரு கேள்விகளுக்கும் tn, Sn சூத்திரங்களைப் பயன்படுத்தி விடை காணுங்கள்.",
          ops: [
            { type: "text", value: "✍️ எழுதித் தீர்ப்போம் - மேலும் எடுத்துக்காட்டுகள்", x: 80, y: 50, color: PRACTICE_COLOR, size: 22 },
            { type: "box", x: 80, y: 130, w: 500, h: 100, color: PRACTICE_COLOR, label: "1. 5,9,13,17,... இன் 15-ஆவது உறுப்பு?", labelSize: 20 },
            { type: "box", x: 80, y: 250, w: 500, h: 100, color: PRACTICE_COLOR, label: "2. 1+3+5+...+(முதல் 20 ஒற்றைப்படை எண்) = ?", labelSize: 18 },
            { type: "text", value: "விடை: 1) 61   2) 400", x: 80, y: 370, color: "#64748b", size: 22 },
          ],
        },
      ],
      questions: [
        { id: "2.2i-q1", prompt: "3,7,11,15,... தொடரின் பொது வித்தியாசம் d?", options: ["4", "3", "7"], correctIndex: 0, explanation: "ஒவ்வொரு உறுப்புக்கும் இடையே வித்தியாசம் 4." },
        { id: "2.2i-q2", prompt: "3,7,11,15,... தொடரின் 10-ஆவது உறுப்பு?", options: ["39", "43", "35"], correctIndex: 0, explanation: "t10 = 3 + 9×4 = 39." },
        { id: "2.2i-q3", prompt: "2+4+6+...+20 இன் கூடுதல்?", options: ["110", "100", "120"], correctIndex: 0, explanation: "Sn = n/2(a+l) = 10/2(2+20) = 110." },
        { id: "2.2i-q4", prompt: "tn = a + (n-1)d இல் 'n-1' ஏன் பயன்படுத்தப்படுகிறது?", options: ["a-விலிருந்து n-ஆவதுக்குப் போக (n-1) படிகள் தேவை", "தவறுதலாக", "n எப்போதும் பூஜ்ஜியம்"], correctIndex: 0, explanation: "முதல் உறுப்பிலிருந்து n-ஆவது உறுப்புக்குச் செல்ல (n-1) முறை d கூட்ட வேண்டும்." },
      ],
    },
    {
      topicId: "2.3",
      title: "பெருக்குத் தொடர் (GP)",
      scenes: [
        {
          label: "1. GP என்றால் என்ன",
          say: "ஒவ்வொரு உறுப்பும் முந்தைய உறுப்பை ஒரு மாறா எண்ணால் பெருக்கக் கிடைத்தால் அது பெருக்குத் தொடர் (GP). 2, 6, 18, 54,... இங்கு ஒவ்வொரு முறையும் 3-ஆல் பெருக்கப்படுகிறது - இதுவே பொது விகிதம் r.",
          ops: [
            { type: "text", value: "பெருக்குத் தொடர் (GP)", x: 80, y: 70, color: "#df4da8", size: 32 },
            { type: "box", x: 80, y: 150, w: 180, h: 90, color: "#39247f", label: "2", labelSize: 36 },
            { type: "box", x: 300, y: 150, w: 180, h: 90, color: "#39247f", label: "6", labelSize: 36 },
            { type: "box", x: 520, y: 150, w: 180, h: 90, color: "#39247f", label: "18", labelSize: 36 },
            { type: "box", x: 740, y: 150, w: 180, h: 90, color: "#39247f", label: "54", labelSize: 36 },
            { type: "text", value: "×3        ×3        ×3", x: 190, y: 270, color: "#188e69", size: 26 },
            { type: "text", value: "a = 2 (முதல் உறுப்பு), r = 3 (பொது விகிதம்)", x: 80, y: 340, color: "#64748b", size: 24 },
          ],
        },
        {
          label: "2. n-ஆவது உறுப்பு",
          say: "n-ஆவது உறுப்பு tn = a × r^(n-1) எனும் சூத்திரத்தால் காணலாம். 2,6,18,54,... தொடரின் 6-ஆவது உறுப்பு காண்போம். a=2, r=3, n=6. t6 = 2 × 3^5 = 2×243 = 486.",
          ops: [
            { type: "text", value: "n-ஆவது உறுப்பு: tn = a × r^(n-1)", x: 80, y: 60, color: "#df4da8", size: 26 },
            { type: "box", x: 80, y: 140, w: 600, h: 110, color: "#188e69", label: "t6 = 2 × 3^5 = 2 × 243 = 486", labelSize: 22 },
          ],
        },
        {
          label: "3. கூடுதல் சூத்திரம்",
          say: "முதல் n உறுப்புகளின் கூடுதல் Sn = a(r^n - 1)/(r-1), r≠1. 2+6+18+54 (முதல் 4 உறுப்புகள்) காண்போம். a=2, r=3, n=4. Sn = 2(81-1)/(3-1) = 2×80/2 = 80.",
          ops: [
            { type: "text", value: "கூடுதல்: Sn = a(r^n - 1)/(r-1)", x: 80, y: 60, color: "#df4da8", size: 26 },
            { type: "box", x: 80, y: 140, w: 600, h: 110, color: "#188e69", label: "2+6+18+54: Sn = 2(3⁴-1)/(3-1) = 80", labelSize: 20 },
          ],
        },
        {
          label: "4. 💡 AP-யும் GP-யும் வேறுபடுத்த",
          say: "AP-யில் கூட்டுதல் (+d), GP-யில் பெருக்குதல் (×r). ஒரு தொடரைக் கண்டதும், அடுத்த உறுப்பு எப்படி வருகிறது எனப் பாருங்கள் - கூட்டினால் AP, பெருக்கினால் GP.",
          ops: [
            { type: "text", value: "💡 உத்தி: AP = +d (கூட்டல்), GP = ×r (பெருக்கல்)", x: 80, y: 60, color: TIP_COLOR, size: 22 },
            { type: "box", x: 80, y: 140, w: 450, h: 100, color: TIP_COLOR, label: "AP: 3,7,11,15 (+4 ஒவ்வொரு முறையும்)", labelSize: 18 },
            { type: "box", x: 580, y: 140, w: 450, h: 100, color: TIP_COLOR, label: "GP: 2,6,18,54 (×3 ஒவ்வொரு முறையும்)", labelSize: 18 },
          ],
        },
        {
          label: "5. ✍️ எழுதித் தீர்ப்போம்",
          say: "இப்போது நீங்கள் தீர்க்க வேண்டும். உங்கள் நோட்டுப் புத்தகத்தில் இந்த இரு கேள்விகளுக்கும் GP சூத்திரங்களைப் பயன்படுத்தி விடை காணுங்கள்.",
          ops: [
            { type: "text", value: "✍️ எழுதித் தீர்ப்போம் - மேலும் எடுத்துக்காட்டுகள்", x: 80, y: 50, color: PRACTICE_COLOR, size: 22 },
            { type: "box", x: 80, y: 130, w: 500, h: 100, color: PRACTICE_COLOR, label: "1. 5,10,20,40,... இன் 7-ஆவது உறுப்பு?", labelSize: 20 },
            { type: "box", x: 80, y: 250, w: 500, h: 100, color: PRACTICE_COLOR, label: "2. 1,3,9,27,... முதல் 5 உறுப்புகளின் கூடுதல்?", labelSize: 18 },
            { type: "text", value: "விடை: 1) 320   2) 121", x: 80, y: 370, color: "#64748b", size: 22 },
          ],
        },
      ],
      questions: [
        { id: "2.3i-q1", prompt: "2,6,18,54,... தொடரின் பொது விகிதம் r?", options: ["3", "2", "6"], correctIndex: 0, explanation: "ஒவ்வொரு உறுப்பும் முந்தையதை 3-ஆல் பெருக்கக் கிடைக்கிறது." },
        { id: "2.3i-q2", prompt: "2,6,18,54,... தொடரின் 6-ஆவது உறுப்பு?", options: ["486", "162", "324"], correctIndex: 0, explanation: "t6 = 2 × 3^5 = 486." },
        { id: "2.3i-q3", prompt: "AP-க்கும் GP-க்கும் உள்ள முக்கிய வேறுபாடு என்ன?", options: ["AP கூட்டல், GP பெருக்கல்", "இரண்டும் ஒன்றே", "AP-யில் மட்டும் n ஆவது உறுப்பு உண்டு"], correctIndex: 0, explanation: "AP-யில் ஒரு மாறா எண் கூட்டப்படும், GP-யில் பெருக்கப்படும்." },
        { id: "2.3i-q4", prompt: "2+6+18+54 (முதல் 4 உறுப்புகள்) இன் கூடுதல்?", options: ["80", "72", "90"], correctIndex: 0, explanation: "Sn = 2(3⁴-1)/(3-1) = 80." },
      ],
    },
  ],
};
