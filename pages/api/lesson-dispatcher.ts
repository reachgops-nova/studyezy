import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface LessonStatePayload {
  userId: string; // Resolves to studentProfileId in telemetry-enhanced schemas
  conceptId: string;
  currentState: 'intro' | 'play_example' | 'challenge' | 'reassess' | 'complete';
  studentInput?: string;
  isCorrectSelection?: boolean;
}

// In-memory static store of pedagogical lesson scripts and properties
const CONCEPT_METADATA: Record<string, { page: number; introScript: string; title: string; reviewInterval: number }> = {
  '1.2': {
    page: 5,
    title: "Implicit Meaning (Jo's Face)",
    introScript: "Fables are amazing stories that teach us deep lessons, but writers don't always tell us everything! Sometimes they \"show\" us how characters feel through actions. This is called implicit meaning. Let's watch Jo on the screen—how does her face change when we say she winked or grinned?",
    reviewInterval: 14,
  },
  '1.7': {
    page: 10,
    title: "Fact vs. Opinion",
    introScript: "Today, we are going to learn how to weigh our words! A fact is something we can prove true or false with real evidence. An opinion is how someone personally thinks or feels about something. Let's play with Ezy's custom Balance Scale to see which words sink down like heavy facts, and which ones float like opinion bubbles!",
    reviewInterval: 7,
  },
  '1.9': {
    page: 15,
    title: "Sentence Types & Connectors",
    introScript: "To build exciting stories, we need to snap our ideas together! Today we are building a Sentence Train. By using conjunctions like \"and,\" \"but,\" and \"because,\" we can connect short carriages into giant compound and complex sentences. Ready to spin our train wheels?",
    reviewInterval: 14,
  },
  '2.1': {
    page: 26,
    title: "Features of a Biography",
    introScript: "A biography is a true record of an extraordinary person's life, written by someone else! Today, we are exploring the life of Poorna Malavath, the youngest girl to climb Mount Everest. Let's scan her record to find direct quotes and key dates!",
    reviewInterval: 7,
  },
  '2.2': {
    page: 29,
    title: "Chronological Timelines",
    introScript: "Biographies must tell a life story in the order that it happened. This is called chronological order! We use time connectives like \"next,\" \"afterwards,\" and \"eventually\" to guide readers. Let's help Usain Bolt arrange his historic running records along his running track timeline!",
    reviewInterval: 14,
  },
  '2.5': {
    page: 38,
    title: "Prefixes & Suffixes",
    introScript: "Gears can change how machines spin, and prefixes can change what words mean! By adding a prefix like \"un-\" or \"dis-\" to a root word, we can reverse its meaning. Let's mesh our prefix gears together to build opposites!",
    reviewInterval: 14,
  },
  '4.1': {
    page: 61,
    title: "Explanation Texts (\"Our Watery World\")",
    introScript: "Welcome to our Science Corner! Today we are looking at explanation texts to understand \"Our Watery World\". We will join Droppy the Raindrop to see how oceans recycle rain through evaporation, condensation, and precipitation. Watch Droppy float up as vapor!",
    reviewInterval: 21,
  }
};

/**
 * Next.js Pedagogical State Machine Route
 * Directs the voice/chat scaffolding flow step-by-step for StudyEzy.
 * Handles student paths dynamically and auto-heals relations safely on the backend!
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, conceptId, currentState, studentInput, isCorrectSelection } = req.body as LessonStatePayload;

  try {
    // 1. Fetch active concept record safely
    const concept = await prisma.concept.findUnique({
      where: { id: conceptId },
    });

    if (!concept) {
      return res.status(404).json({ error: 'Concept not found in physical database schema' });
    }

    // Resolve static details mapping
    const staticDetails = CONCEPT_METADATA[conceptId] || {
      page: 5,
      title: concept.name || "Learning Checkpoint",
      introScript: "Let's explore our textbook booklet together!",
      reviewInterval: 14,
    };

    // 2. Dispatch state logic
    switch (currentState) {
      
      // STATE A: THE INTRO HOOK (The What, How, and Why)
      case 'intro': {
        return res.status(200).json({
          nextState: 'play_example',
          ezyResponse: `${staticDetails.introScript} Does that make sense? Let's try our first live play example together on the canvas!`,
          highlightText: "implicit meaning",
          triggerWidget: false,
          showPromptInput: true,
        });
      }

      // STATE B: guided EXAMPLE PLAY (Visual interactivity)
      case 'play_example': {
        let helpBubble = `Look closely at Page ${staticDetails.page} of your textbook booklet on the left. Let's try out a simple scenario.`;
        
        if (conceptId === '1.7') {
          helpBubble = "I've loaded a test card onto our golden Balance Scale! Tapping 'The sun rises early in the morning' should weigh down our scale, because it is something we can observe and prove with a clock! Try clicking the 'Prove as Fact' button.";
        } else if (conceptId === '1.9') {
          helpBubble = "Let's couple our first clauses! 'The magpies loved the warmth' is a complete thought, and 'the wombats missed their cool burrows' is also complete. They are opposites, so we need a contrast coupler. Try snapping them together with the 'but' block!";
        } else if (conceptId === '4.1') {
          helpBubble = "Look at Droppy the droplet. Let's heat him up with sun rays. Tap 'Evaporate' and watch him turn into vapor and float into the clouds!";
        }

        return res.status(200).json({
          nextState: 'challenge',
          ezyResponse: helpBubble,
          triggerWidget: true,
          showPromptInput: false,
        });
      }

      // STATE C: ASSESSMENT CHALLENGE (Pushed willingly by student)
      case 'challenge': {
        if (isCorrectSelection) {
          const daysToAdd = staticDetails.reviewInterval;
          const nextRetestAt = new Date();
          nextRetestAt.setDate(nextRetestAt.getDate() + daysToAdd);

          // Update Prisma ConceptMastery with fallback catch blocks to handle schema variations safely
          try {
            await prisma.conceptMastery.upsert({
              where: {
                studentProfileId_conceptId: { studentProfileId: userId, conceptId }
              } as any,
              update: {
                attemptsCount: { increment: 1 },
                lastScore: 100,
                lastTestedAt: new Date(),
                nextRetestAt,
                priority: "LOW",
                intervalDays: daysToAdd
              } as any,
              create: {
                studentProfileId: userId,
                conceptId,
                attemptsCount: 1,
                lastScore: 100,
                lastTestedAt: new Date(),
                nextRetestAt,
                priority: "LOW",
                intervalDays: daysToAdd
              } as any
            });
          } catch (masteryErr) {
            // Fallback for legacy DB schema schemas
            try {
              await (prisma as any).conceptMastery.upsert({
                where: {
                  userId_conceptId: { userId, conceptId }
                },
                update: {
                  attempts: { increment: 1 },
                  successes: { increment: 1 },
                  consecutiveSuccesses: { increment: 1 },
                  nextReviewDate: nextRetestAt,
                  intervalDays: daysToAdd,
                },
                create: {
                  userId,
                  conceptId,
                  attempts: 1,
                  successes: 1,
                  consecutiveSuccesses: 1,
                  nextReviewDate: nextRetestAt,
                  intervalDays: daysToAdd,
                },
              });
            } catch (legacyMasteryErr) {
              console.log("⚠️ ConceptMastery write skipped (fallback profiles are active):", legacyMasteryErr);
            }
          }

          // Log detail to ReasoningLog safely
          try {
            await prisma.reasoningLog.create({
              data: {
                studentProfileId: userId,
                conceptId,
                questionId: "checkpoint-default",
                studentVoiceResponse: "SUCCESS",
                classification: "correct_reasoning",
                coachingFeedback: `Superb work mastering ${staticDetails.title} on Page ${staticDetails.page}!`
              } as any
            });
          } catch (logErr) {
            try {
              await (prisma as any).reasoningLog.create({
                data: {
                  userId,
                  conceptId,
                  action: 'CLASSIFICATION_SUCCESS',
                  detail: `Student successfully classified active exercise for Concept ${conceptId} Sourced from Page ${staticDetails.page}.`
                }
              });
            } catch (legacyLogErr) {
              console.log("⚠️ Skipping log insert (unmigrated table structures in workspace):", legacyLogErr);
            }
          }

          return res.status(200).json({
            nextState: 'complete',
            ezyResponse: "🎉 Amazing job! You got it 100% correct! The visual game is solved. You've earned 10 Gold Stars! Ready to mark this concept as finished and jump into our Unit Practice workbook?",
            triggerWidget: true,
            isCorrect: true,
          });
        } else {
          return res.status(200).json({
            nextState: 'reassess',
            ezyResponse: "Whoops! That didn't feel quite right. The scale is wobbling! Let's pause, look at Ezy's clue, and try another one with zero pressure.",
            triggerWidget: true,
            isCorrect: false,
          });
        }
      }

      // STATE D: ADAPTIVE MICRO-REASSESSMENT (Fallback on Error)
      case 'reassess': {
        let correctionClue = "Remember, if a statement is someone's personal feeling, taste, or a judgment word like 'kinder' or 'cooler,' it is always an opinion!";
        
        if (conceptId === '1.9') {
          correctionClue = "If we are explaining the REASON behind an action (like why the animals danced), we snap it together with 'because'!";
        }

        return res.status(200).json({
          nextState: 'challenge',
          ezyResponse: `No worries at all, let's learn together! ${correctionClue} I've reset the canvas, let's try this fresh card with our new tool clues.`,
          triggerWidget: true,
          isCorrect: null,
        });
      }

      default: {
        return res.status(200).json({
          nextState: 'intro',
          ezyResponse: "All set! Let's choose our next page-concept from the textbook checklist overview to continue our journey.",
        });
      }
    }
  } catch (error: any) {
    console.error('❌ State Machine Dispatcher Error:', error);
    return res.status(500).json({ error: 'Internal server state error' });
  }
}
