-- Precise transcript of what's printed on Concept.sourceImagePath, generated
-- once via Claude vision when the image is linked. Lets the AI tutor answer
-- questions about the specific content of the real reference page it shows,
-- instead of only knowing the hand-authored definition/key_points/examples.
ALTER TABLE "Concept" ADD COLUMN "sourceImageTranscript" TEXT;
