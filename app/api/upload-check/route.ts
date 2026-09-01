import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Helper: Calculate Jaccard Similarity Coefficient between two text strings
 * Splits text into unique words (tokens) and calculates intersection over union.
 */
function calculateJaccardSimilarity(textA: string, textB: string): number {
  const sanitize = (text: string) => 
    text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);

  const setA = new Set(sanitize(textA));
  const setB = new Set(sanitize(textB));

  if (setA.size === 0 || setB.size === 0) return 0;

  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);

  return intersection.size / union.size;
}

/**
 * Helper: Calculate Hamming Distance between two 64-bit hexadecimal dHashes (Difference Hashes)
 * Lower distance means higher image similarity (distance <= 10 usually indicates duplicates).
 */
function calculateHammingDistance(hashA: string, hashB: string): number {
  if (hashA.length !== hashB.length) return 999; // Length mismatch, not comparable

  let distance = 0;
  for (let i = 0; i < hashA.length; i++) {
    const hexA = parseInt(hashA[i], 16);
    const hexB = parseInt(hashB[i], 16);
    
    // XOR the values and count the set bits (differing bits)
    let xor = hexA ^ hexB;
    while (xor > 0) {
      if (xor & 1) distance++;
      xor >>= 1;
    }
  }
  return distance;
}

/**
 * Main Duplicate Content Checker Middleware Engine
 * Evaluates raw textbook attributes (character transcripts or page image hashes) 
 * to find matching curricula and suggest joining an existing Stage.
 */
async function checkUploadedTextbookDuplicate(payload: {
  title: string;
  stageNumber: number;
  extractedSampleText?: string;
  samplePageHashes?: string[]; // Array of Hex hashes representing uploaded pages
}) {
  try {
    const { title, stageNumber, extractedSampleText, samplePageHashes } = payload;

    // 1. Check direct string match on existing subjects
    const existingSubjects = await prisma.subject.findMany({
      include: {
        stage: true
      }
    });

    for (const subject of existingSubjects) {
      // If same name or extremely similar title, flag immediately
      if (subject.name.toLowerCase().trim() === title.toLowerCase().trim()) {
        return {
          isDuplicate: true,
          matchType: 'DIRECT_TITLE_MATCH',
          existingSubjectId: subject.id,
          existingStageLabel: (subject as any).stage?.label || `Stage ${stageNumber}`,
          message: `The textbook "${title}" has already been processed and mapped under ${(subject as any).stage?.label || "this curriculum"}!`
        };
      }
    }

    // 2. Perform Text-based Overlap Analysis if sample text is provided
    if (extractedSampleText && extractedSampleText.trim().length > 50) {
      const existingConcepts = await prisma.concept.findMany({
        select: {
          id: true,
          name: true,
          unitId: true,
          definition: true 
        }
      });

      for (const concept of existingConcepts) {
        if (concept.definition) {
          const similarity = calculateJaccardSimilarity(extractedSampleText, concept.definition);
          // If Jaccard similarity exceeds 80% boundary, it's a content duplicate!
          if (similarity > 0.8) {
            const unit = await prisma.unit.findUnique({
              where: { id: concept.unitId },
              include: { subject: { include: { stage: true } } }
            });

            return {
              isDuplicate: true,
              matchType: 'CONTENT_TEXT_OVERLAP',
              existingSubjectId: unit?.subject.id,
              existingStageLabel: unit?.subject.stage.label || `Stage ${stageNumber}`,
              similarityScore: Math.round(similarity * 100),
              message: `Ezy detected a ${Math.round(similarity * 100)}% content overlap with textbooks already live in our stage registry!`
            };
          }
        }
      }
    }

    // 3. Perform Perceptual Image Hash matching if page dHashes are provided
    if (samplePageHashes && samplePageHashes.length > 0) {
      const mockDatabasePageHashes = [
        { subjectId: "english-cambridge-stage5", hash: "a3f2b1c0d9e8f7a6" },
        { subjectId: "mathematics-cambridge-stage5", hash: "1234567890abcdef" }
      ];

      for (const dbPage of mockDatabasePageHashes) {
        for (const uploadedHash of samplePageHashes) {
          const distance = calculateHammingDistance(uploadedHash, dbPage.hash);
          // Hamming distance <= 8 indicates highly identical images (likely duplicates)
          if (distance <= 8) {
            const subject = await prisma.subject.findUnique({
              where: { id: dbPage.subjectId },
              include: { stage: true }
            });

            return {
              isDuplicate: true,
              matchType: 'IMAGE_PHASH_MATCH',
              existingSubjectId: dbPage.subjectId,
              existingStageLabel: (subject as any)?.stage?.label || "Cambridge Stage 5",
              hammingDistance: distance,
              message: `Ezy analyzed the uploaded page layouts and found an identical visual match with active courses!`
            };
          }
        }
      }
    }

    // No duplicate found! Safe to seed
    return {
      isDuplicate: false,
      message: "New curriculum textbook verified. Ready for dynamic visual ingestion."
    };
  } catch (error: any) {
    console.error("❌ Duplicate Checker Failure:", error);
    return {
      isDuplicate: false,
      error: error.message || error,
      message: "Duplicate engine failed. Permitting direct upload fallback."
    };
  }
}

/**
 * Next.js app route endpoint handler
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await checkUploadedTextbookDuplicate(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to parse upload checks" }, { status: 500 });
  }
}
