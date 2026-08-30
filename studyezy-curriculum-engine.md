# StudyEzy Curriculum Engine: Master Architecture Blueprint
This master document outlines the complete technical, database, and pedagogical architecture to implement StudyEzy's automated curriculum loading, spaced-repetition testing, interactive coaching, and graduated visual scaffolds.

---

## 1. The Spaced-Repetition Feedback Loop ("The Memory Engine")

To move students away from rote memorization and help lower-performing students retain concepts long-term, StudyEzy implements a **Dynamic Retest & Brush-up Cadence**. Instead of static calendars, the engine dynamically updates a student's `ConceptMastery` card based on two metrics:
1. **The Performance Score** (from Progression Tests or Micro-Checks)
2. **The Cognitive Diagnostic Classification** (from the post-test voice *Reasoning Interview*)

```
             ┌────────────────────────────────────────────────────────┐
             │                Progression Test Attempt                │
             └──────────────────────────┬─────────────────────────────┘
                                        ▼
             ┌────────────────────────────────────────────────────────┐
             │         Voice Reasoning Interview (Claude/Groq)        │
             │   Classifies error: CONCEPTUAL, CARELESS, or MISREAD   │
             └──────────────────────────┬─────────────────────────────┘
                                        ▼
             ┌────────────────────────────────────────────────────────┐
             │                Curriculum Engine Logic                 │
             │  Updates interval, next_retest_date, and planner priority│
             └──────────────────────────┬─────────────────────────────┘
                                        ▼
  ┌─────────────────────────────────────┼─────────────────────────────────────┐
  ▼ (Score < 60% OR Conceptual)         ▼ (Score 60-85% OR Careless/Misread)  ▼ (Score ≥ 85% & Correct)
┌───────────────────────────┐         ┌───────────────────────────┐         ┌───────────────────────────┐
│     Needs Reteach         │         │      Needs Brush-Up       │         │        Mastered           │
│  - Interval: Reset to 1d  │         │  - Interval: Capped at 4d │         │  - Interval: Multiplied   │
│  - Planner Priority: HIGH │         │  - Planner Priority: MED  │         │  - Planner Priority: LOW  │
└───────────────────────────┘         └───────────────────────────┘         └───────────────────────────┘
```

### The Retest & Review Algorithm
When a progression test is completed, the student's mastery record is updated according to this logic:

```typescript
interface MasteryInput {
  currentIntervalDays: number;
  score: number; // 0 to 100
  reasoningClassification?: 'correct_reasoning' | 'conceptual_gap' | 'careless_slip' | 'misread_question';
}

function calculateNextReview(input: MasteryInput): { nextIntervalDays: number; priority: 'HIGH' | 'MED' | 'LOW' } {
  const { currentIntervalDays, score, reasoningClassification } = input;

  // Case 1: Critical Conceptual Gap (High Priority Reteach)
  if (score < 60 || reasoningClassification === 'conceptual_gap') {
    return {
      nextIntervalDays: 1, // Retest tomorrow after an active interactive lesson
      priority: 'HIGH'
    };
  }

  // Case 2: Careless Slip or Minor Misunderstanding (Medium Priority Brush-up)
  if ((score >= 60 && score < 85) || reasoningClassification === 'careless_slip' || reasoningClassification === 'misread_question') {
    return {
      nextIntervalDays: Math.max(3, Math.min(currentIntervalDays, 4)), // Retest within 3-4 days
      priority: 'MED'
    };
  }

  // Case 3: Concept Mastered (Spaced Repetition Progression)
  // Double the review interval (up to 30 days) to lock into long-term memory
  const nextInterval = currentIntervalDays === 0 ? 7 : Math.min(currentIntervalDays * 2, 30);
  return {
    nextIntervalDays: nextInterval,
    priority: 'LOW'
  };
}
```

---

## 2. Dynamic Database Schema (`schema.prisma` Upgrades)

To support active tracking of spaced-repetition intervals, workbook assignment completions, and cumulative terminal tests, upgrade the database schema with these models:

```prisma
// Extend current User / Profile schemas to house telemetry
model StudentProfile {
  id                    String           @id @default(uuid())
  name                  String
  assignedStageId       String?          // Override Grade/Stage
  schoolName            String?          
  preferredLanguage     String           @default("en")
  masteries             ConceptMastery[]
  attempts              TestAttempt[]
  reasoningLogs         ReasoningLog[]
  worksheets            WorksheetCompletion[]
}

model ConceptMastery {
  id                    String           @id @default(uuid())
  studentProfileId      String
  conceptId             String
  intervalDays          Int              @default(0) // Spaced repetition interval
  priority              String           @default("HIGH") // HIGH (reteach), MED (brush-up), LOW (mastered)
  lastScore             Float
  attemptsCount         Int              @default(1)
  lastTestedAt          DateTime         @default(now())
  nextRetestAt          DateTime         // Trigger date for spaced repetition
  
  studentProfile        StudentProfile   @relation(fields: [studentProfileId], references: [id], onDelete: Cascade)
  concept               Concept          @relation(fields: [conceptId], references: [id], onDelete: Cascade)

  @@unique([studentProfileId, conceptId])
}

model ReasoningLog {
  id                    String           @id @default(uuid())
  studentProfileId      String
  conceptId             String
  questionId            String
  studentVoiceResponse  String           // Transcribed verbal reasoning
  classification        String           // conceptual_gap | careless_slip | misread_question | correct_reasoning
  coachingFeedback      String           // Claude's simple helpful tip
  createdAt             DateTime         @default(now())

  studentProfile        StudentProfile   @relation(fields: [studentProfileId], references: [id], onDelete: Cascade)
  concept               Concept          @relation(fields: [conceptId], references: [id], onDelete: Cascade)
}

model WorksheetCompletion {
  id                    String           @id @default(uuid())
  studentProfileId      String
  unitId                String
  score                 Float
  completedAt           DateTime         @default(now())

  studentProfile        StudentProfile   @relation(fields: [studentProfileId], references: [id], onDelete: Cascade)
}
```

---

## 3. The 3-Tier Integrated Content & Assessment Pack Model
Our content is split into three unified phases, transforming curriculum textbook chapters into an active pipeline:

```
  ┌──────────────────────────────────────────────────────────────────┐
  │ 1. IN-UNIT MICRO-CHECKS (Taught Immediately After Concept)        │
  │    - 2-3 short, highly visual questions                          │
  │    - Provides interactive immediate hints if the student misses  │
  └────────────────────────────────┬─────────────────────────────────┘
                                   │ (Unlocked upon completion)
                                   ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │ 2. UNIT PROGRESSION TESTS (Formal Retest at End of Unit)          │
  │    - Comprehensive exam of all unit concepts                     │
  │    - Adaptive tiers: Easy, Moderate, Tough                       │
  └────────────────────────────────┬─────────────────────────────────┘
                                   │ (After mastering 2+ Units)
                                   ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │ 3. CUMULATIVE TERMINAL TESTS (Spaced Long-Term Check)            │
  │    - Gathers past concepts from completed units                  │
  │    - Mixes fables, biographies, and grammar in one paper          │
  └──────────────────────────────────────────────────────────────────┘
```

### JSON Format Specification for Content Compilation (seed.ts compatible)
Below is the definitive data template representing how any textbook unit is parsed, stored, and loaded offline into PostgreSQL. It includes **Unit 1 Concept 1.2 (Implicit Meaning)**, a corresponding **Workbook Practice**, and a **Progression Test**:

```json
{
  "unitId": "cambridge-s5-eng-u1",
  "unitName": "Unit 1: Stories from different cultures (Fables)",
  "concepts": [
    {
      "id": "concept-1.2-implicit",
      "name": "Implicit Meaning (Clue Detective)",
      "definition": "Implicit meaning is a hidden message inside a sentence. The writer doesn't tell us directly; they leave small clues for us to find, like a wink or a grin.",
      "checkpoints": [
        {
          "title": "What is Implicit Meaning?",
          "text": "Sometimes, writers leave secret clues in sentences. Instead of saying 'He was angry', they might write: 'He slammed the door and stomped away'. Tapping those clues is how we read between the lines!",
          "illustrationSvg": "clue-detective-intro"
        }
      ],
      "microCheck": {
        "questions": [
          {
            "id": "mc-1",
            "type": "text_highlight",
            "text": "Jo winked at Charlie and grinned as she placed the chewing gum on the teacher's chair.",
            "interactiveTargets": ["winked", "grinned"],
            "hints": {
              "winked": "A wink means sharing a secret or a trick! Why is she winking?",
              "grinned": "A grin is a wide, cheeky smile. She's definitely planning something mischievous!"
            },
            "correctExplanation": "Awesome! Tapping 'winked' and 'grinned' proves Jo is playing a cheeky, sneaky joke. The writer didn't say it directly, but left clues!"
          }
        ]
      },
      "workbookAssignment": {
        "title": "Worksheet 1: Read Between the Lines!",
        "questions": [
          {
            "id": "wb-1",
            "questionText": "Read this line: 'Hyena trotted out the door, humming a happy tune with a full belly.' What is the implicit meaning here?",
            "choices": [
              {"id": "a", "text": "Hyena is very hungry and looking for food."},
              {"id": "b", "text": "Hyena has successfully eaten a big meal and is feeling great!", "isCorrect": true},
              {"id": "c", "text": "Hyena is angry because he got into a fight."}
            ]
          }
        ]
      },
      "progressionTest": {
        "easy": {
          "questions": [
            {
              "id": "pt-easy-1",
              "questionText": "If a character is 'trembling with a cold sweat,' how do they feel?",
              "choices": [
                {"id": "a", "text": "Happy and excited."},
                {"id": "b", "text": "Scared or cold.", "isCorrect": true},
                {"id": "c", "text": "Lazy and sleepy."}
              ]
            }
          ]
        },
        "tough": {
          "questions": [
            {
              "id": "pt-tough-1",
              "questionText": "Read page 8 of your textbook: 'Hyena was on the fence: if he could get a flame from Cockerel, then he could light the fire...'. What does the idiom 'on the fence' mean implicitly here?",
              "choices": [
                {"id": "a", "text": "Hyena is physically sitting on top of a wooden garden fence."},
                {"id": "b", "text": "Hyena is undecided or trapped between two choices, unsure how to act.", "isCorrect": true},
                {"id": "c", "text": "Hyena is hiding from Cockerel."}
              ]
            }
          ]
        }
      }
    }
  ]
}
```

---

## 4. Graduated Visual Scaffold Guidelines
To keep StudyEzy highly engaging as students grow older, we scale our interface, interactive layouts, and illustrations across 4 specific age groups:

| School Tier | Grade Band | UI layout Structure | Illustration Style | Voice / Interaction Speed |
| :--- | :--- | :--- | :--- | :--- |
| **Lower Primary** | K - Grade 2 | **Full-Screen Tactile Canvas**<br>No chatbars or complex text lines. Buttons are large and physical. | **Cartoon Mascot Animations**<br>Bright, animated vectors of Ezy reacting directly to touch. | Very slow (*0.75x*), high inflection, playful sound effect triggers. |
| **Upper Primary** | Grades 3 - 5 | **Split-Screen Interactive Desk**<br>Physical book on the left (page flips); interactive game board on the right. | **Storybook Concept SVGs**<br>High-contrast, illustrative line drawings (e.g., *Droppy’s water droplet*). | Gentle pace (*0.85x*), encouraging character coaching with bilingual bridges. |
| **Secondary** | Grades 6 - 9 | **Tabbed Study Workspace**<br>Side-by-side text analyzer, interactive graphing calculators, and mock-test papers. | **Technical Diagrams / Mindmaps**<br>Structured infographics, detailed charts, and concept-connection models. | Normal speech (*1.0x*), focus on structure, exam timing, and methodology. |
| **Higher / College** | Grades 10+ | **Split Research Desk**<br>Dense source text / PDF library on the left; markdown workspace and code sandbox on the right. | **Data-driven Visualizations**<br>Mathematical plots, active coordinate grids, and flowable process architectures. | Human conversational, analytical, providing logic critiques rather than basic praise. |

---

## 5. Automated Next.js Server-Side Edge-TTS Endpoint

To bypass mobile browser regional language voice-pack limitations, implement this edge-optimised server-side Text-to-Speech router (`app/api/tts/route.ts`). It generates crisp, natural audio streams directly on your Railway server:

```typescript
import { NextResponse } from 'next/server';
import { MsEdgeTTS } from 'edge-tts-api'; // Edge TTS engine wrapper

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  const lang = searchParams.get('lang') || 'en';

  if (!text) {
    return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
  }

  // Set highly authentic Indian Regional voices based on selected profile language
  let voice = 'en-IN-NeerjaExpressiveNeural'; // Default crisp Indian English accent
  if (lang === 'hi') voice = 'hi-IN-MadhurNeural';
  if (lang === 'ta') voice = 'ta-IN-ValluvarNeural';
  if (lang === 'te') voice = 'te-IN-MohanNeural';
  if (lang === 'kn') voice = 'kn-IN-GaganNeural';

  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, 'audio-24khz-48kbitrate-mono-mp3');
    
    // Generate high-quality MP3 buffer
    const audioStream = await tts.getAudioStream(text);

    return new NextResponse(audioStream, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Edge-TTS Generation Failed:', error);
    return NextResponse.json({ error: 'TTS Synthesis failed' }, { status: 500 });
  }
}
```

This ensures StudyEzy works **flawlessly, with beautiful regional voices, on every mobile phone or tablet on Earth**, with absolutely zero native browser voice dependencies!
