import type { InkUnit } from "./types";

/**
 * Ink-board treatment of Cambridge Tamil Unit 5 (விடியும் வேளை - Dawn
 * Time), real content already vetted and stored on the unit's two DB
 * Concept rows (5.1 the dawn-walk descriptive passage, 5.2 நேரிணை/
 * எதிரிணைச் சொற்கள் - reinforcing vs. opposite word pairs). Added
 * 2026-10-23, same pairing as cambridge-4-tamil-1.ts - see that file's
 * module comment for why the unitKey matches the existing card-based
 * Board unit and what that means for routing/mastery tracking.
 *
 * Real direction 2026-10-23: "Tamil has to be read in Tamil only, English
 * only to refer" - every scene op and every `say` narration here is pure
 * Tamil; English appears only in this comment block, never in content a
 * child reads or hears.
 */
export const CAMBRIDGE_4_TAMIL_5_INK: InkUnit = {
  unitKey: "cambridge-4-tamil-5",
  title: "விடியும் வேளை (Dawn Time)",
  badge: "Stage 4 · இயல் 5",
  languageCode: "ta-IN",

  topics: [
    {
      topicId: "5.1",
      title: "வருணனை உரை",
      scenes: [
        {
          label: "1. அதிகாலைப் பயணம்",
          say: "அமுதன் அதிகாலையில் பள்ளிக்குச் செல்கிறான். வழியில் உயர்ந்த மரங்களையும், பசுமையான வயல்களையும், கொக்குகளையும், மலைகளையும், பனித்துளிகளையும், பூக்களையும் கண்டு மகிழ்கிறான்.",
          ops: [
            { type: "text", value: "அதிகாலைப் பயணம்", x: 80, y: 70, color: "#df4da8", size: 34 },
            { type: "text", value: "அமுதன் அதிகாலையில் பள்ளிக்குச் செல்கிறான்.", x: 80, y: 160, color: "#39247f", size: 28 },
            { type: "text", value: "வழியில் காண்பது:", x: 80, y: 230, color: "#64748b", size: 24 },
            { type: "text", value: "🌳 உயர்ந்த மரங்கள்", x: 120, y: 290, color: "#188e69", size: 26 },
            { type: "text", value: "🌾 பசுமையான வயல்கள்", x: 120, y: 340, color: "#188e69", size: 26 },
            { type: "text", value: "🦢 கொக்குகள்", x: 600, y: 290, color: "#188e69", size: 26 },
            { type: "text", value: "⛰️ மலைகள்", x: 600, y: 340, color: "#188e69", size: 26 },
            { type: "text", value: "💧 பனித்துளிகள்", x: 120, y: 400, color: "#188e69", size: 26 },
            { type: "text", value: "🌸 பூக்கள்", x: 600, y: 400, color: "#188e69", size: 26 },
          ],
        },
        {
          label: "2. அழகிய சொற்கள்",
          say: "இப்பாடத்தில் அழகான வருணனைச் சொற்கள் உள்ளன. பச்சைப்பசேலென்று என்றால் மிகவும் பசுமையாக. வெள்ளைவெளேரென்ற என்றால் மிகவும் வெண்மையாக. உயர்ந்தோங்கிய என்றால் மிக உயரமாக வளர்ந்த.",
          ops: [
            { type: "text", value: "வருணனைச் சொற்கள்", x: 80, y: 60, color: "#df4da8", size: 30 },
            { type: "box", x: 80, y: 130, w: 400, h: 110, color: "#39247f", label: "பச்சைப்பசேலென்று", labelSize: 22 },
            { type: "text", value: "= மிகவும் பசுமையாக (வயல்)", x: 520, y: 190, color: "#188e69", size: 24 },
            { type: "box", x: 80, y: 270, w: 400, h: 110, color: "#39247f", label: "வெள்ளைவெளேரென்ற", labelSize: 22 },
            { type: "text", value: "= மிகவும் வெண்மையாக (கொக்கு)", x: 520, y: 330, color: "#188e69", size: 24 },
            { type: "box", x: 80, y: 410, w: 400, h: 110, color: "#39247f", label: "உயர்ந்தோங்கிய", labelSize: 24 },
            { type: "text", value: "= மிக உயரமாக வளர்ந்த (மலை)", x: 520, y: 470, color: "#188e69", size: 24 },
          ],
        },
        {
          label: "3. முத்துகளும் நாய்க்குட்டியும்",
          say: "பனித்துளிகள் முத்துகள் போல் காட்சியளிக்கின்றன. அமுதன் தன் செல்ல நாய்க்குட்டியிடம் அன்புடன் பேசுகிறான் - இயற்கையும் அன்பும் இணைந்த அழகிய காட்சி.",
          ops: [
            { type: "text", value: "முத்துகளும் நாய்க்குட்டியும்", x: 80, y: 70, color: "#df4da8", size: 30 },
            { type: "box", x: 80, y: 150, w: 1100, h: 110, color: "#188e69", label: "பனித்துளிகள் → முத்துகள் போல் காட்சியளிக்கின்றன", labelSize: 26 },
            { type: "box", x: 80, y: 290, w: 1100, h: 110, color: "#df4da8", label: "அமுதன் → தன் செல்ல நாய்க்குட்டியிடம் அன்புடன் பேசுகிறான்", labelSize: 24 },
            { type: "text", value: "இயற்கையும் அன்பும் இணைந்த அழகிய காட்சி!", x: 80, y: 450, color: "#39247f", size: 26 },
          ],
        },
      ],
      questions: [
        { id: "5.1i-q1", prompt: "அமுதன் எப்போது பள்ளிக்குச் செல்கிறான்?", options: ["அதிகாலையில்", "மதியத்தில்", "மாலையில்"], correctIndex: 0, explanation: "அமுதன் அதிகாலையில் பள்ளிக்குச் செல்கிறான்." },
        { id: "5.1i-q2", prompt: "மலைகள் எவ்வாறு காட்சியளித்தன?", options: ["பச்சைப் பட்டாடை உடுத்தியது போல", "வெள்ளைப் போர்வை போர்த்தியது போல", "கருப்பு நிறமாக"], correctIndex: 0, explanation: "உயர்ந்தோங்கிய மலைகள் பச்சைப் பட்டாடை உடுத்தியது போல காட்சியளித்தன." },
        { id: "5.1i-q3", prompt: "பனித்துளிகள் எதைப் போல் காட்சியளித்தன?", options: ["முத்துகள் போல்", "வைரங்கள் போல்", "நட்சத்திரங்கள் போல்"], correctIndex: 0, explanation: "பனித்துளிகள் முத்துகள் போல் காட்சியளித்தன." },
        { id: "5.1i-q4", prompt: "அமுதன் வழியில் கண்ட உயிரினங்கள் எவை?", options: ["கொக்குகள் மற்றும் நாய்க்குட்டி", "மீன்கள் மட்டும்", "பாம்புகள் மட்டும்"], correctIndex: 0, explanation: "கொக்குகள், வண்ணத்துப்பூச்சிகள், தன் செல்ல நாய்க்குட்டி ஆகியவற்றைக் கண்டான்." },
      ],
    },
    {
      topicId: "5.2",
      title: "நேரிணை & எதிரிணைச் சொற்கள்",
      scenes: [
        {
          label: "1. நேரிணைச் சொற்கள்",
          say: "நேரிணைச் சொற்கள் என்பவை ஒரே கருத்தை வலுப்படுத்தும் இரு சொற்கள். சீரும் சிறப்பும், ஓங்கி உயர்ந்த, பேரும் புகழும் - இவை நேரிணைச் சொற்களுக்கு எடுத்துக்காட்டுகள்.",
          ops: [
            { type: "text", value: "நேரிணைச் சொற்கள்", x: 80, y: 70, color: "#df4da8", size: 32 },
            { type: "text", value: "ஒரே கருத்தை வலுப்படுத்தும் இரு சொற்கள்", x: 80, y: 140, color: "#64748b", size: 24 },
            { type: "box", x: 80, y: 210, w: 320, h: 100, color: "#188e69", label: "சீரும் சிறப்பும்", labelSize: 28 },
            { type: "box", x: 450, y: 210, w: 320, h: 100, color: "#188e69", label: "ஓங்கி உயர்ந்த", labelSize: 28 },
            { type: "box", x: 820, y: 210, w: 320, h: 100, color: "#188e69", label: "பேரும் புகழும்", labelSize: 28 },
          ],
        },
        {
          label: "2. எதிரிணைச் சொற்கள்",
          say: "எதிரிணைச் சொற்கள் என்பவை எதிரெதிர் கருத்தை வலுப்படுத்தும் இரு சொற்கள். இரவு பகல், மேடு பள்ளம், உயர்வு தாழ்வு - இவை எதிரிணைச் சொற்களுக்கு எடுத்துக்காட்டுகள்.",
          ops: [
            { type: "text", value: "எதிரிணைச் சொற்கள்", x: 80, y: 70, color: "#df4da8", size: 32 },
            { type: "text", value: "எதிரெதிர் கருத்தை வலுப்படுத்தும் இரு சொற்கள்", x: 80, y: 140, color: "#64748b", size: 24 },
            { type: "box", x: 80, y: 210, w: 320, h: 100, color: "#dc2626", label: "இரவு பகல்", labelSize: 28 },
            { type: "box", x: 450, y: 210, w: 320, h: 100, color: "#dc2626", label: "மேடு பள்ளம்", labelSize: 28 },
            { type: "box", x: 820, y: 210, w: 320, h: 100, color: "#dc2626", label: "உயர்வு தாழ்வு", labelSize: 28 },
          ],
        },
        {
          label: "3. ஒப்பிட்டுப் பார்ப்போம்",
          say: "நேரிணையும் எதிரிணையும் ஒப்பிட்டுப் பார்ப்போம். 'நலமும் வளமும்' ஒரே கருத்தை வலுப்படுத்துவதால் நேரிணைச் சொற்கள். 'இன்பம் துன்பம்' எதிரெதிர் கருத்து தருவதால் எதிரிணைச் சொற்கள்.",
          ops: [
            { type: "text", value: "ஒப்பிட்டுப் பார்ப்போம்", x: 80, y: 70, color: "#df4da8", size: 30 },
            { type: "box", x: 100, y: 150, w: 480, h: 130, color: "#188e69", label: "நலமும் வளமும்", labelSize: 30 },
            { type: "text", value: "நேரிணை - ஒரே கருத்து", x: 130, y: 310, color: "#188e69", size: 22 },
            { type: "box", x: 680, y: 150, w: 480, h: 130, color: "#dc2626", label: "இன்பம் துன்பம்", labelSize: 30 },
            { type: "text", value: "எதிரிணை - எதிரெதிர் கருத்து", x: 710, y: 310, color: "#dc2626", size: 22 },
          ],
        },
      ],
      questions: [
        { id: "5.2i-q1", prompt: "'சீரும் சிறப்பும்' எந்த வகை சொற்கள்?", options: ["நேரிணைச் சொற்கள்", "எதிரிணைச் சொற்கள்", "ஒப்பற்ற சொற்கள்"], correctIndex: 0, explanation: "ஒரே கருத்தை வலுப்படுத்துவதால் இது நேரிணைச் சொற்கள்." },
        { id: "5.2i-q2", prompt: "'இரவு பகல்' எந்த வகை சொற்கள்?", options: ["எதிரிணைச் சொற்கள்", "நேரிணைச் சொற்கள்", "இணைச் சொற்கள் இல்லை"], correctIndex: 0, explanation: "எதிரெதிர் கருத்து தருவதால் இது எதிரிணைச் சொற்கள்." },
        { id: "5.2i-q3", prompt: "நேரிணைச் சொற்கள் என்றால் என்ன?", options: ["ஒரே கருத்தை வலுப்படுத்தும் இரு சொற்கள்", "எதிரெதிர் கருத்து தரும் சொற்கள்", "பொருளற்ற சொற்கள்"], correctIndex: 0, explanation: "நேரிணைச் சொற்கள் ஒரே கருத்தை வலுப்படுத்தும்." },
        { id: "5.2i-q4", prompt: "'மேடு பள்ளம்' எந்த வகை?", options: ["எதிரிணைச் சொற்கள்", "நேரிணைச் சொற்கள்", "ஒரே சொல்"], correctIndex: 0, explanation: "மேடும் பள்ளமும் எதிரெதிர் கருத்துகள், எனவே எதிரிணைச் சொற்கள்." },
      ],
    },
  ],
};
