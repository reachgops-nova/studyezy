import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting StudyEzy Database Seeding...');

  // 1. Clean up old seed data to prevent duplicate keys
  await prisma.conceptMastery.deleteMany({});
  await prisma.reasoningLog.deleteMany({});
  await prisma.concept.deleteMany({});
  await prisma.unit.deleteMany({});
  await prisma.subject.deleteMany({});

  // 2. Seed Subjects
  const english = await prisma.subject.create({
    data: {
      id: 'english-cambridge-stage5',
      name: 'Cambridge English',
      grade: 'Stage 5',
      available: true,
    },
  });

  console.log('✅ Subject seeded: Cambridge English');

  // 3. Seed Units
  const unit1 = await prisma.unit.create({
    data: {
      id: 'english-u1',
      subjectId: english.id,
      title: 'Unit 1: Fiction: Stories from different cultures',
      unitKey: 'fiction-fables',
      sequence: 1,
    },
  });

  const unit2 = await prisma.unit.create({
    data: {
      id: 'english-u2',
      subjectId: english.id,
      title: 'Unit 2: Non-fiction: Biography',
      unitKey: 'nonfiction-biography',
      sequence: 2,
    },
  });

  const unit4 = await prisma.unit.create({
    data: {
      id: 'english-u4',
      subjectId: english.id,
      title: 'Unit 4: Non-fiction: Information and explanation texts',
      unitKey: 'nonfiction-explanation',
      sequence: 4,
    },
  });

  console.log('✅ Units seeded: Unit 1, Unit 2, Unit 4');

  // 4. Seed Concepts with physical page numbers, scripts, and widget connections
  await prisma.concept.createMany({
    data: [
      // UNIT 1: FICTION
      {
        id: '1.2',
        unitId: unit1.id,
        title: 'Implicit Meaning (Jo\'s Face)',
        pageNumber: 5,
        sequence: 1,
        introScript: 'Fables are amazing stories that teach us deep lessons, but writers don\'t always tell us everything! Sometimes they "show" us how characters feel through actions. This is called implicit meaning. Let\'s watch Jo on the screen—how does her face change when we say she winked or grinned?',
        widgetId: 'jo-wink',
        reviewInterval: 14,
      },
      {
        id: '1.7',
        unitId: unit1.id,
        title: 'Fact vs. Opinion',
        pageNumber: 10,
        sequence: 2,
        introScript: 'Today, we are going to learn how to weigh our words! A fact is something we can prove true or false with real evidence. An opinion is how someone personally thinks or feels about something. Let\'s play with Ezy\'s custom Balance Scale to see which words sink down like heavy facts, and which ones float like opinion bubbles!',
        widgetId: '1.7',
        reviewInterval: 7,
      },
      {
        id: '1.9',
        unitId: unit1.id,
        title: 'Sentence Types & Connectors',
        pageNumber: 15,
        sequence: 3,
        introScript: 'To build exciting stories, we need to snap our ideas together! Today we are building a Sentence Train. By using conjunctions like "and," "but," and "because," we can connect short carriages into giant compound and complex sentences. Ready to spin our train wheels?',
        widgetId: '1.9',
        reviewInterval: 14,
      },

      // UNIT 2: BIOGRAPHY
      {
        id: '2.1',
        unitId: unit2.id,
        title: 'Features of a Biography',
        pageNumber: 26,
        sequence: 1,
        introScript: 'A biography is a true record of an extraordinary person\'s life, written by someone else! Today, we are exploring the life of Poorna Malavath, the youngest girl to climb Mount Everest. Let\'s scan her record to find direct quotes and key dates!',
        widgetId: 'biography-scan',
        reviewInterval: 7,
      },
      {
        id: '2.2',
        unitId: unit2.id,
        title: 'Chronological Timelines',
        pageNumber: 29,
        sequence: 2,
        introScript: 'Biographies must tell a life story in the order that it happened. This is called chronological order! We use time connectives like "next," "afterwards," and "eventually" to guide readers. Let\'s help Usain Bolt arrange his historic running records along his running track timeline!',
        widgetId: 'bolt-timeline',
        reviewInterval: 14,
      },
      {
        id: '2.5',
        unitId: unit2.id,
        title: 'Prefixes & Suffixes',
        pageNumber: 38,
        sequence: 3,
        introScript: 'Gears can change how machines spin, and prefixes can change what words mean! By adding a prefix like "un-" or "dis-" to a root word, we can reverse its meaning. Let\'s mesh our prefix gears together to build opposites!',
        widgetId: 'prefix-suffix-machine',
        reviewInterval: 14,
      },

      // UNIT 4: EXPLANATION TEXTS
      {
        id: '4.1',
        unitId: unit4.id,
        title: 'Explanation Texts ("Our Watery World")',
        pageNumber: 61,
        sequence: 1,
        introScript: 'Welcome to our Science Corner! Today we are looking at explanation texts to understand "Our Watery World". We will join Droppy the Raindrop to see how oceans recycle rain through evaporation, condensation, and precipitation. Watch Droppy float up as vapor!',
        widgetId: 'droppy-water-cycle',
        reviewInterval: 21,
      }
    ],
  });

  console.log('✅ Concepts and Pedagogical Scripts seeded successfully!');
  console.log('🌱 Seed complete! Run "npx prisma db seed" to sync your active DB rows.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
