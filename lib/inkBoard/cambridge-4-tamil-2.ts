import type { InkUnit } from "./types";

/**
 * Ink-board treatment of Cambridge Tamil Unit 2 (பனைமரச் சிறப்பு - Glory of
 * the Palm Tree), real content from the unit's own DB Concept rows (2.1
 * the palm tree's 12 useful parts, 2.2 ஐம்பால் - the 5-fold gender/number
 * noun classification). Added 2026-10-25, continuing the same pairing
 * established in cambridge-4-tamil-1.ts - shares the existing DB
 * Unit/Concept rows, so RRT results land in the same ConceptMastery rows
 * the card-based board already uses.
 *
 * Every topic includes a "Tips & Tricks" scene (lib/inkBoard/types.ts's
 * TIP_COLOR convention) - a genuine, logically-grounded memory aid, never
 * a decorative gimmick.
 */
export const CAMBRIDGE_4_TAMIL_2_INK: InkUnit = {
  unitKey: "cambridge-4-tamil-2",
  title: "பனைமரச் சிறப்பு (Glory of the Palm Tree)",
  badge: "Stage 4 · இயல் 2",
  languageCode: "ta-IN",

  topics: [
    {
      topicId: "2.1",
      title: "பனைமரத்தின் உறுப்புகளும் பயன்களும்",
      scenes: [
        {
          label: "1. பனைமரம் - தமிழ்நாட்டின் மாநில மரம்",
          say: "பனைமரம் தமிழ்நாட்டின் மாநில மரம். இதற்கு பன்னிரண்டு உறுப்புகள் உள்ளன, அவை அனைத்தும் பயன்தரக்கூடியவை. வேர்ப்பகுதி, நடுமரம், பத்தை மட்டை, பச்சை மட்டை, சில்லாட்டை, சாரை ஓலை, ஓலை, குருத்தோலை, பாளைப்பீலி, பனங்காய், தூர்ப்பகுதி, உச்சிப்பகுதி என பன்னிரண்டு உறுப்புகள்.",
          ops: [
            { type: "text", value: "பனைமரம் - தமிழ்நாட்டின் மாநில மரம் 🌴", x: 80, y: 60, color: "#df4da8", size: 28 },
            { type: "text", value: "12 உறுப்புகள், அனைத்தும் பயன்தரக்கூடியவை!", x: 80, y: 130, color: "#39247f", size: 24 },
            { type: "text", value: "வேர்ப்பகுதி", x: 100, y: 200, color: "#188e69", size: 22 },
            { type: "text", value: "நடுமரம்", x: 100, y: 240, color: "#188e69", size: 22 },
            { type: "text", value: "பத்தை மட்டை", x: 100, y: 280, color: "#188e69", size: 22 },
            { type: "text", value: "பச்சை மட்டை", x: 100, y: 320, color: "#188e69", size: 22 },
            { type: "text", value: "சில்லாட்டை", x: 500, y: 200, color: "#188e69", size: 22 },
            { type: "text", value: "சாரை ஓலை", x: 500, y: 240, color: "#188e69", size: 22 },
            { type: "text", value: "ஓலை", x: 500, y: 280, color: "#188e69", size: 22 },
            { type: "text", value: "குருத்தோலை", x: 500, y: 320, color: "#188e69", size: 22 },
            { type: "text", value: "பாளைப்பீலி", x: 900, y: 200, color: "#188e69", size: 22 },
            { type: "text", value: "பனங்காய்", x: 900, y: 240, color: "#188e69", size: 22 },
            { type: "text", value: "தூர்ப்பகுதி", x: 900, y: 280, color: "#188e69", size: 22 },
            { type: "text", value: "உச்சிப்பகுதி", x: 900, y: 320, color: "#188e69", size: 22 },
          ],
        },
        {
          label: "2. பயன்தரும் பொருள்கள்",
          say: "நுங்கும் பனங்கிழங்கும் உணவாகப் பயன்படும். பனை ஓலையால் கூடை, கைவினைப் பொருள்கள், கூரை ஆகியவை செய்யலாம். பனஞ்சாறு பதநீராகவும், கற்கண்டாகவும், கருப்பட்டியாகவும் பயன்தரும். பண்டைய இலக்கியங்கள் ஓலைச்சுவடிகளில் எழுதப்பட்டன.",
          ops: [
            { type: "text", value: "பனைமரத்தின் பயன்கள்", x: 80, y: 60, color: "#df4da8", size: 30 },
            { type: "box", x: 80, y: 130, w: 500, h: 100, color: "#39247f", label: "நுங்கு, பனங்கிழங்கு", labelSize: 24 },
            { type: "text", value: "→ உணவு", x: 620, y: 180, color: "#188e69", size: 24 },
            { type: "box", x: 80, y: 250, w: 500, h: 100, color: "#39247f", label: "ஓலை", labelSize: 26 },
            { type: "text", value: "→ கூடை, கூரை, கைவினைப் பொருள்", x: 620, y: 300, color: "#188e69", size: 22 },
            { type: "box", x: 80, y: 370, w: 500, h: 100, color: "#39247f", label: "பனஞ்சாறு", labelSize: 24 },
            { type: "text", value: "→ பதநீர், கற்கண்டு, கருப்பட்டி", x: 620, y: 420, color: "#188e69", size: 22 },
            { type: "text", value: "ஓலைச்சுவடிகளில் பண்டைய இலக்கியங்கள் எழுதப்பட்டன!", x: 80, y: 500, color: "#df4da8", size: 22 },
          ],
        },
        {
          label: "3. 💡 12-ஐ நினைவில் வைக்க",
          say: "12 உறுப்புகளையும் ஒரே முறையில் மனப்பாடம் செய்ய முயலாதீர்கள். மரத்தை மூன்று மண்டலமாகப் பிரித்துப் பாருங்கள் - கீழே வேர்ப்பகுதி, நடுவில் மரமும் மட்டைகளும், மேலே ஓலையும் காயும். ஒவ்வொரு மண்டலத்திலும் என்ன இருக்கும் என்று யோசித்தால், 12-ஐயும் எளிதாக நினைவில் வைக்கலாம்.",
          ops: [
            { type: "text", value: "💡 உத்தி: மரத்தை 3 மண்டலமாகப் பிரி!", x: 80, y: 50, color: "#b8860b", size: 28 },
            { type: "box", x: 400, y: 110, w: 400, h: 90, color: "#b8860b", label: "மேலே: ஓலை, பாளை, காய்", labelSize: 22 },
            { type: "box", x: 400, y: 230, w: 400, h: 90, color: "#b8860b", label: "நடுவில்: மரம், மட்டைகள்", labelSize: 22 },
            { type: "box", x: 400, y: 350, w: 400, h: 90, color: "#b8860b", label: "கீழே: வேர்ப்பகுதி", labelSize: 22 },
            { type: "text", value: "ஒவ்வொரு மண்டலமும் நினைவில் வந்தால், 12-உம் வரும்!", x: 150, y: 500, color: "#39247f", size: 22 },
          ],
        },
      ],
      questions: [
        { id: "2.1i-q1", prompt: "பனைமரம் எந்த மாநிலத்தின் மாநில மரம்?", options: ["தமிழ்நாடு", "கேரளா", "கர்நாடகா"], correctIndex: 0, explanation: "பனைமரம் தமிழ்நாட்டின் மாநில மரம் ஆகும்." },
        { id: "2.1i-q2", prompt: "பனைமரத்திற்கு எத்தனை உறுப்புகள் உள்ளன?", options: ["12", "10", "8"], correctIndex: 0, explanation: "பனைமரம் பன்னிரண்டு உறுப்புகளை உடையது." },
        { id: "2.1i-q3", prompt: "பனைமரத்திலிருந்து கிடைக்கும் உணவுப் பொருள்கள் யாவை?", options: ["நுங்கு, பனங்கிழங்கு", "அரிசி, கோதுமை", "பால், தயிர்"], correctIndex: 0, explanation: "நுங்கும் பனங்கிழங்கும் பனைமரத்திலிருந்து கிடைக்கும் உணவுப் பொருள்கள்." },
        { id: "2.1i-q4", prompt: "பண்டைய இலக்கியங்கள் எதில் எழுதப்பட்டன?", options: ["ஓலைச்சுவடிகளில்", "காகிதத்தில்", "கல்வெட்டில் மட்டும்"], correctIndex: 0, explanation: "பண்டைய இலக்கியங்கள் பனை ஓலைகளால் ஆன ஓலைச்சுவடிகளில் எழுதப்பட்டன." },
      ],
    },
    {
      topicId: "2.2",
      title: "ஐம்பால் அறிவோம்",
      scenes: [
        {
          label: "1. ஐம்பால் என்றால் என்ன?",
          say: "திணையின் உட்பிரிவே பால். தமிழில் பால் ஐந்து வகைப்படும். உயர்திணையில் ஆண்பால், பெண்பால், பலர்பால் என மூன்று வகை. அஃறிணையில் ஒன்றன்பால், பலவின்பால் என இரண்டு வகை.",
          ops: [
            { type: "text", value: "ஐம்பால்: 5 வகைகள்", x: 80, y: 60, color: "#df4da8", size: 30 },
            { type: "box", x: 80, y: 130, w: 500, h: 220, color: "#39247f", label: "உயர்திணை (மனிதர்)", labelSize: 26 },
            { type: "text", value: "ஆண்பால் - அவன், சிறுவன்", x: 110, y: 210, color: "#188e69", size: 22 },
            { type: "text", value: "பெண்பால் - அவள், தோழி", x: 110, y: 250, color: "#188e69", size: 22 },
            { type: "text", value: "பலர்பால் - அவர்கள், மாணவர்கள்", x: 110, y: 290, color: "#188e69", size: 22 },
            { type: "box", x: 650, y: 130, w: 500, h: 150, color: "#df4da8", label: "அஃறிணை (பிற எல்லாம்)", labelSize: 24 },
            { type: "text", value: "ஒன்றன்பால் - அது, பூ, மான்", x: 680, y: 210, color: "#188e69", size: 22 },
            { type: "text", value: "பலவின்பால் - அவை, பறவைகள்", x: 680, y: 250, color: "#188e69", size: 22 },
          ],
        },
        {
          label: "2. 💡 5-ஐ 3+2 ஆகப் பிரி!",
          say: "ஐந்தையும் தனித்தனியாக மனப்பாடம் செய்ய வேண்டாம். முதலில் ஒரு எளிய கேள்வி கேட்டுக்கொள்ளுங்கள் - இது மனிதரா, இல்லையா? மனிதர் எனில் ஆண், பெண், பலர் என மூன்று தேர்வு. மனிதர் இல்லை எனில் ஒன்று, பல என இரண்டு தேர்வு மட்டுமே. இப்படி 3+2 ஆகப் பிரித்தால் எளிதாக நினைவில் வைக்கலாம்.",
          ops: [
            { type: "text", value: "💡 உத்தி: முதலில் கேள், 'மனிதரா?'", x: 80, y: 60, color: "#b8860b", size: 28 },
            { type: "box", x: 80, y: 140, w: 500, h: 110, color: "#b8860b", label: "மனிதர் → 3 தேர்வு", labelSize: 28 },
            { type: "text", value: "ஆண் / பெண் / பலர்", x: 110, y: 280, color: "#188e69", size: 24 },
            { type: "box", x: 650, y: 140, w: 500, h: 110, color: "#b8860b", label: "மனிதர் இல்லை → 2 தேர்வு", labelSize: 26 },
            { type: "text", value: "ஒன்று / பல", x: 680, y: 280, color: "#188e69", size: 24 },
            { type: "text", value: "3 + 2 = 5 பால்கள் - எளிதாக நினைவில் நிற்கும்!", x: 80, y: 400, color: "#39247f", size: 26 },
          ],
        },
      ],
      questions: [
        { id: "2.2i-q1", prompt: "'மாணவர்கள்' எந்தப் பாலைச் சேர்ந்தது?", options: ["பலர்பால்", "பலவின்பால்", "ஆண்பால்"], correctIndex: 0, explanation: "'மாணவர்கள்' பல மனிதர்களைக் குறிப்பதால் பலர்பால்." },
        { id: "2.2i-q2", prompt: "'அது' எந்தப் பாலைச் சேர்ந்தது?", options: ["ஒன்றன்பால்", "பலவின்பால்", "பெண்பால்"], correctIndex: 0, explanation: "'அது' அஃறிணையில் ஒன்றை மட்டும் குறிப்பதால் ஒன்றன்பால்." },
        { id: "2.2i-q3", prompt: "உயர்திணையில் எத்தனை பால் வகைகள் உள்ளன?", options: ["3 (ஆண், பெண், பலர்)", "2", "5"], correctIndex: 0, explanation: "உயர்திணையில் ஆண்பால், பெண்பால், பலர்பால் என மூன்று வகை." },
        { id: "2.2i-q4", prompt: "'பறவைகள்' எந்தப் பாலைச் சேர்ந்தது?", options: ["பலவின்பால்", "பலர்பால்", "ஒன்றன்பால்"], correctIndex: 0, explanation: "'பறவைகள்' அஃறிணையில் பலவற்றைக் குறிப்பதால் பலவின்பால்." },
      ],
    },
  ],
};
