import type { InkUnit } from "./types";

/**
 * Ink-board treatment of Cambridge Tamil Unit 1 (அன்னைத் தமிழே! - Mother
 * Tamil), same real Samacheer Kalvi content already vetted and used in the
 * card-based lib/boardUnits/cambridge-4-tamil-1.ts (the full poem by நா.
 * காமராசன், the word-joining/புணர்ச்சி grammar point). Added 2026-10-23 per
 * real user direction: "can we create a white board setup for UNIT 1 and
 * UNIT 5" - lib/unitRouting.ts's resolveUnitHref() prefers an ink board
 * over the card-based Board when both exist for the same unitKey, so this
 * swaps JUST Unit 1 (and Unit 5) to the new whiteboard style while Units
 * 2, 3, 4, 6, 7 keep their existing card-based Board untouched.
 *
 * Shares the same DB Unit/Concept rows (conceptKey "1.1"/"1.2") as the
 * card-based board - RRT quick-check/test results land in the exact same
 * ConceptMastery rows either way, not a parallel tracking system.
 */
export const CAMBRIDGE_4_TAMIL_1_INK: InkUnit = {
  unitKey: "cambridge-4-tamil-1",
  title: "அன்னைத் தமிழே! (Mother Tamil)",
  badge: "Stage 4 · இயல் 1",
  languageCode: "ta-IN",

  topics: [
    {
      topicId: "1.1",
      title: "பாடல் பொருள்",
      scenes: [
        {
          label: "1. முழுப் பாடல்",
          say: "அன்னைத் தமிழே! இப்பாடலை முழுவதும் படிப்போம். இது நா. காமராசன் அவர்கள் இயற்றிய பாடல். அன்னைத் தமிழே - என் ஆவி கலந்தவளே! என்னை வளர்ப்பவளே! என்னில் வளர்பவளே! உன்னைப் புகழ்வதற்கே உலகில் பிறப்பெடுத்தேன். சொல்லில் விளையாடச் சொல்லித் தந்தவளே! சொல்லில் உனது புகழ் சொல்ல முடியலையே!",
          ops: [
            { type: "text", value: "அன்னைத் தமிழே! (முழுப் பாடல்)", x: 80, y: 70, color: "#df4da8", size: 34 },
            { type: "text", value: "அன்னைத் தமிழே - என் ஆவி கலந்தவளே!", x: 80, y: 150, color: "#39247f", size: 30 },
            { type: "text", value: "என்னை வளர்ப்பவளே! என்னில் வளர்பவளே!", x: 80, y: 210, color: "#39247f", size: 30 },
            { type: "text", value: "உன்னைப் புகழ்வதற்கே உலகில் பிறப்பெடுத்தேன்", x: 80, y: 270, color: "#39247f", size: 30 },
            { type: "text", value: "சொல்லில் விளையாடச் சொல்லித் தந்தவளே!", x: 80, y: 330, color: "#39247f", size: 30 },
            { type: "text", value: "சொல்லில் உனது புகழ் சொல்ல முடியலையே!", x: 80, y: 390, color: "#39247f", size: 30 },
            { type: "text", value: "— நா. காமராசன்", x: 80, y: 450, color: "#188e69", size: 26 },
          ],
        },
        {
          label: "2. சொல்லும் பொருளும்",
          say: "ஆவி என்றால் உயிர். என்னில் என்றால் எனக்குள். பிறப்பெடுத்தேன் என்றால் பிறந்தேன். இந்த மூன்று சொற்களையும் நினைவில் வைத்துக்கொள்ளுங்கள்.",
          ops: [
            { type: "text", value: "சொல்லும் பொருளும்", x: 80, y: 60, color: "#df4da8", size: 30 },
            { type: "box", x: 80, y: 130, w: 350, h: 110, color: "#39247f", label: "ஆவி", labelSize: 34 },
            { type: "text", value: "= உயிர்", x: 460, y: 190, color: "#188e69", size: 28 },
            { type: "box", x: 80, y: 260, w: 350, h: 110, color: "#39247f", label: "என்னில்", labelSize: 34 },
            { type: "text", value: "= எனக்குள்", x: 460, y: 320, color: "#188e69", size: 28 },
            { type: "box", x: 80, y: 390, w: 350, h: 110, color: "#39247f", label: "பிறப்பெடுத்தேன்", labelSize: 26 },
            { type: "text", value: "= பிறந்தேன்", x: 460, y: 450, color: "#188e69", size: 28 },
          ],
        },
        {
          label: "3. பாடலின் கருத்து",
          say: "இப்பாடலில் கவிஞர் தமிழை ஒரு தாயாகப் போற்றுகிறார் - தன்னை வளர்த்தவள், தன்னுடன் வளர்பவள். தமிழ் சொற்களைக் கற்றுத் தந்த அதே தமிழினால், தமிழின் முழுப் புகழையும் சொல்ல முடியவில்லை என்று கவிஞர் வருந்துகிறார்.",
          ops: [
            { type: "text", value: "பாடலின் மையக் கருத்து", x: 80, y: 70, color: "#df4da8", size: 32 },
            { type: "box", x: 80, y: 150, w: 1100, h: 100, color: "#188e69", label: "தமிழ் = ஓர் அன்னை (தாய்) - தன்னை வளர்த்தவள்", labelSize: 26 },
            { type: "box", x: 80, y: 280, w: 1100, h: 100, color: "#39247f", label: "தமிழே சொல் இணைத்து பேசக் கற்றுத் தந்தது", labelSize: 26 },
            { type: "box", x: 80, y: 410, w: 1100, h: 110, color: "#dc2626", label: "ஆனாலும் தமிழின் முழுப் புகழை சொல்ல முடியவில்லை என வருந்துகிறார்", labelSize: 24 },
          ],
        },
      ],
      questions: [
        { id: "1.1i-q1", prompt: "'அன்னைத் தமிழே' பாடலின் ஆசிரியர் யார்?", options: ["நா. காமராசன்", "பாரதியார்", "கண்ணதாசன்"], correctIndex: 0, explanation: "இப்பாடலை இயற்றியவர் நா. காமராசன் ஆவார்." },
        { id: "1.1i-q2", prompt: "'ஆவி' என்ற சொல்லின் பொருள் என்ன?", options: ["உயிர்", "நீர்", "காற்று"], correctIndex: 0, explanation: "ஆவி என்றால் உயிர் என்று பொருள்." },
        { id: "1.1i-q3", prompt: "கவிஞர் தமிழை யாராக உருவகப்படுத்துகிறார்?", options: ["ஒரு அன்னையாக (தாயாக)", "ஒரு தோழியாக", "ஒரு ஆசிரியையாக"], correctIndex: 0, explanation: "பாடல் முழுவதும் தமிழை ஒரு தாயாக உருவகப்படுத்துகிறது." },
        { id: "1.1i-q4", prompt: "'பிறப்பெடுத்தேன்' என்றால் என்ன பொருள்?", options: ["பிறந்தேன்", "வளர்ந்தேன்", "இறந்தேன்"], correctIndex: 0, explanation: "பிறப்பெடுத்தேன் = பிறந்தேன்." },
      ],
    },
    {
      topicId: "1.2",
      title: "சொல் இணைத்தல்",
      scenes: [
        {
          label: "1. அன்னை + தமிழே",
          say: "இரு தனிச் சொற்கள் இணையும்போது சிறு மாற்றம் ஏற்படும். அன்னை + தமிழே இணைந்தால் அன்னைத்தமிழே ஆகும் - 'த' என்ற எழுத்து புதிதாகச் சேர்கிறது.",
          ops: [
            { type: "text", value: "சொல் இணைத்தல் (புணர்ச்சி)", x: 80, y: 70, color: "#df4da8", size: 32 },
            { type: "box", x: 100, y: 180, w: 280, h: 110, color: "#39247f", label: "அன்னை", labelSize: 32 },
            { type: "text", value: "+", x: 420, y: 250, color: "#64748b", size: 40 },
            { type: "box", x: 480, y: 180, w: 280, h: 110, color: "#39247f", label: "தமிழே", labelSize: 32 },
            { type: "arrow", x1: 400, y1: 350, x2: 400, y2: 420, color: "#188e69" },
            { type: "box", x: 100, y: 440, w: 660, h: 110, color: "#188e69", label: "அன்னைத்தமிழே", labelSize: 36 },
          ],
        },
        {
          label: "2. இன்னும் இரு எடுத்துக்காட்டுகள்",
          say: "பிறப்பு + எடுத்தேன் இணைந்தால் பிறப்பெடுத்தேன் ஆகும். சொல்லி + தந்தவளே இணைந்தால் சொல்லித்தந்தவளே ஆகும்.",
          ops: [
            { type: "text", value: "இன்னும் இரு எடுத்துக்காட்டுகள்", x: 80, y: 60, color: "#df4da8", size: 30 },
            { type: "box", x: 80, y: 130, w: 260, h: 90, color: "#39247f", label: "பிறப்பு", labelSize: 26 },
            { type: "text", value: "+", x: 350, y: 185, color: "#64748b", size: 30 },
            { type: "box", x: 390, y: 130, w: 260, h: 90, color: "#39247f", label: "எடுத்தேன்", labelSize: 24 },
            { type: "text", value: "=", x: 660, y: 185, color: "#64748b", size: 30 },
            { type: "box", x: 700, y: 130, w: 350, h: 90, color: "#188e69", label: "பிறப்பெடுத்தேன்", labelSize: 26 },
            { type: "box", x: 80, y: 280, w: 260, h: 90, color: "#39247f", label: "சொல்லி", labelSize: 26 },
            { type: "text", value: "+", x: 350, y: 335, color: "#64748b", size: 30 },
            { type: "box", x: 390, y: 280, w: 280, h: 90, color: "#39247f", label: "தந்தவளே", labelSize: 24 },
            { type: "text", value: "=", x: 680, y: 335, color: "#64748b", size: 30 },
            { type: "box", x: 720, y: 280, w: 380, h: 90, color: "#188e69", label: "சொல்லித்தந்தவளே", labelSize: 24 },
          ],
        },
        {
          label: "3. புதிய சொல்லில் முயற்சி",
          say: "இப்போது பாடத்தில் நேரடியாகப் படிக்காத புதிய சொல்லைப் பார்ப்போம். வாங்கி + வந்தான் என்பதை இணைத்தால்? வாங்கி என்ற சொல் அப்படியே இணைந்து வாங்கிவந்தான் ஆகிறது.",
          ops: [
            { type: "text", value: "புதிய சொல்லில் முயற்சி செய்வோம்", x: 80, y: 70, color: "#df4da8", size: 30 },
            { type: "box", x: 100, y: 180, w: 280, h: 110, color: "#39247f", label: "வாங்கி", labelSize: 32 },
            { type: "text", value: "+", x: 420, y: 250, color: "#64748b", size: 40 },
            { type: "box", x: 480, y: 180, w: 280, h: 110, color: "#39247f", label: "வந்தான்", labelSize: 32 },
            { type: "arrow", x1: 400, y1: 350, x2: 400, y2: 420, color: "#188e69" },
            { type: "box", x: 100, y: 440, w: 660, h: 110, color: "#188e69", label: "வாங்கிவந்தான்", labelSize: 36 },
          ],
        },
      ],
      questions: [
        { id: "1.2i-q1", prompt: "'அன்னை + தமிழே' இணைந்தால் என்னவாகும்?", options: ["அன்னைத்தமிழே", "அன்னைதமிழே", "அன்னதமிழே"], correctIndex: 0, explanation: "அன்னை + தமிழே = அன்னைத்தமிழே." },
        { id: "1.2i-q2", prompt: "'சொல்லித்தந்தவளே' எனும் சொல்லைப் பிரித்தால்?", options: ["சொல்லி + தந்தவளே", "சொல் + லித்தந்தவளே", "சொல்லித் + தவளே"], correctIndex: 0, explanation: "சொல்லி + தந்தவளே = சொல்லித்தந்தவளே." },
        { id: "1.2i-q3", prompt: "'பிறப்பு + எடுத்தேன்' இணைந்தால்?", options: ["பிறப்பெடுத்தேன்", "பிறப்புஎடுத்தேன்", "பிறஎடுத்தேன்"], correctIndex: 0, explanation: "பிறப்பு + எடுத்தேன் = பிறப்பெடுத்தேன்." },
        { id: "1.2i-q4", prompt: "'வாங்கி + வந்தான்' இணைந்தால்?", options: ["வாங்கிவந்தான்", "வாங்கவந்தான்", "வாங்கியவந்தான்"], correctIndex: 0, explanation: "மூலச் சொல் 'வாங்கி' அப்படியே இணைந்து வாங்கிவந்தான் ஆகிறது." },
      ],
    },
  ],
};
