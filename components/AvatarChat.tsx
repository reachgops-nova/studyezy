"use client";

import { useEffect, useRef, useState } from "react";
import type { Concept } from "@/lib/types";
import Avatar from "./Avatar";
import { Illustration, hasIllustration } from "./illustrations";
import VoicePicker, { getSavedRate, getSavedVoiceName } from "./VoicePicker";

interface SpeechRecognitionResultLike {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionResultLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

interface ChatMessage {
  id: string;
  sender: "avatar" | "kid";
  text: string;
  illustrationKey?: string;
  /** A generated illustration (see lib/conceptIllustration.ts) attached to THIS message, not the legacy hand-drawn set - shown inline in the thread instead of a static header (2026-09-08: moved into the conversation sequence so it can't be scrolled past unread). */
  generatedIllustrationUrl?: string;
  keyRanges?: [number, number][];
}

// Matches a [[illustration:some_key]] token the AI tutor can emit when a
// student asks to see a picture and one of the concept's alternate
// illustrations genuinely matches (see lib/claude.ts/lib/groq.ts's
// illustrationInstruction) - stripped from the displayed/spoken text and
// rendered as a real inline image instead.
const ILLUSTRATION_TOKEN_RE = /\[\[illustration:([a-z0-9_]+)\]\]/i;

function extractIllustrationToken(raw: string): { text: string; illustrationKey?: string } {
  const match = raw.match(ILLUSTRATION_TOKEN_RE);
  if (!match) return { text: raw };
  const key = match[1];
  const text = raw.replace(ILLUSTRATION_TOKEN_RE, "").replace(/\s{2,}/g, " ").trim();
  return { text, illustrationKey: hasIllustration(key) ? key : undefined };
}

let messageCounter = 0;
function nextId() {
  messageCounter += 1;
  return `m${messageCounter}`;
}

interface CheckpointStep {
  lines: string[];
  /** Attached to the first line spoken in this step - see playCheckpoint. */
  illustrationUrl?: string;
}

// Teaching content is grouped into small checkpoints - the avatar pauses
// and waits for the kid to react after each one, rather than reading the
// whole concept straight through and only checking in once at the very end.
function buildCheckpoints(concept: Concept): CheckpointStep[] {
  const checkpoints: CheckpointStep[] = [];

  const intro: string[] = [`Hi! Let's learn about ${concept.concept_name}.`];
  if (concept.definition) intro.push(concept.definition);
  checkpoints.push({ lines: intro });

  // The generated illustration (lib/conceptIllustration.ts) and ALL of the
  // concept's examples now form their own paced checkpoint right after the
  // intro - real feedback 2026-09-08: as a static card above the whole
  // thread it was easy to scroll past unread, and only the FIRST example
  // ever got spoken. Putting both in the same sequence as everything else
  // means a kid genuinely sees and hears them before moving on.
  const illustrationUrl = concept.media?.generated_illustration_url;
  const examples = concept.examples ?? [];
  if (illustrationUrl || examples.length) {
    const lines = examples.length
      ? examples.map((e, i) => (examples.length > 1 ? `Example ${i + 1}: ${e}` : `Here's an example: ${e}`))
      : ["Take a look at this:"];
    checkpoints.push({ lines, illustrationUrl });
  }

  if (concept.key_points?.length) {
    checkpoints.push({ lines: concept.key_points });
  }

  const closing: string[] = [];
  if (concept.tips_to_remember?.[0]) closing.push(`Quick tip: ${concept.tips_to_remember[0]}`);
  if (closing.length) checkpoints.push({ lines: closing });

  return checkpoints;
}

const PAUSE_PROMPTS = [
  "Does that make sense so far?",
  "Following okay? Tell me when you're ready to keep going.",
  "All good? Say the word and we'll keep going.",
];

const CONTINUE_ACKS = ["Great, let's keep going!", "Awesome, moving on!", "Nice, here we go!"];
const REPEAT_ACKS = ["No problem, let me explain that again.", "Sure, here it is again."];

// In-Unit Micro-Checks (PLATFORM_PLAN.md §2.2): a couple of short questions
// once teaching finishes, to catch confusion while it's still cheap to fix -
// before the formal progression test. Reuses the concept's own
// voice_qa_samples rather than generating new questions, so this works even
// without Anthropic credit.
//
// Real user request 2026-09-08: a half/incorrect/negative answer must be
// corrected with more explanation and NOT let the lesson move on until the
// kid actually gets it (this used to be deliberately ungraded - see
// lib/groq.ts's groqMicroCheckGrade for why that changed and what didn't).
// The verdict/feedback is computed server-side (app/api/micro-check/route.ts):
// obvious non-answers ("ok", "idk") get graded "incorrect" with no AI call,
// anything else gets a real Groq classification against the sample's own
// reference answer. MAX_MICRO_CHECK_ATTEMPTS caps the retry loop so a kid
// isn't trapped forever on one question - after that many tries the lesson
// moves on regardless, on the theory that by then Ezy has already explained
// the idea with several fresh examples and further looping would frustrate
// rather than teach.
const MICRO_CHECK_COUNT = 2;
const MAX_MICRO_CHECK_ATTEMPTS = 3;
const FALLBACK_ACK = "Thanks for sharing your thinking!";

// Recognizes natural replies to a checkpoint pause ("okay", "got it", "again?")
// without needing an AI call - this is what lets typing/saying a normal
// response act like tapping the pause buttons, instead of always being sent
// off as a real question.
//
// Matched by EXACT phrase (after trimming/lowercasing/dropping trailing
// punctuation), not by substring-search-anywhere-in-a-sentence. A previous
// version used regex.test() plus a word-count cutoff as a proxy for "is this
// just an ack" - that band-aid still broke on real input: "I don't
// understand the part about story check" is exactly 8 words, sat right on
// the cutoff, and still matched "don't understand" as a substring, so it
// silently discarded the specific topic and reset the whole checkpoint
// instead of answering the actual question. Exact-phrase matching is the
// correct semantics (the message IS just an ack vs. it merely CONTAINS ack
// words) and has no equivalent boundary case - any additional content at
// all, of any length, correctly routes to the real grounded-answer pipeline.
const CONTINUE_ACK_PHRASES = new Set([
  "ok", "okay", "k", "yes", "yeah", "yep", "yup", "got it", "good", "fine", "sure",
  "continue", "next", "go on", "keep going", "ready", "understood", "makes sense",
  "i understand", "i get it", "i got it", "alright", "all good", "sounds good",
  "yes got it", "got it thanks", "yep got it",
]);

const REPEAT_ACK_PHRASES = new Set([
  "again", "repeat", "not clear", "confused", "i'm confused", "im confused",
  "explain again", "say again", "what does that mean", "come again",
  "one more time", "slower",
  "i don't understand", "i dont understand", "don't understand", "dont understand",
  "i don't get it", "i dont get it", "don't get it", "dont get it",
  "i didn't get it", "i didnt get it", "didn't get it", "didnt get it",
  "i didn't catch that", "i didnt catch that", "didn't catch that",
  "not sure", "no idea", "huh", "what",
]);

function normalizeAck(text: string): string {
  return text.trim().toLowerCase().replace(/[?!.]+$/g, "").trim();
}

// Real bug reported live 2026-08-27: a kid replied to a checkpoint pause
// with something like "yes that's fine, let's move on" - clearly an
// acknowledgment, but not an EXACT match for any CONTINUE_ACK_PHRASES entry,
// so it silently fell through to a real AI call (as if it were a content
// question) and the lesson never advanced. Exact-match alone is too brittle
// for how kids actually phrase a natural reply.
//
// Widened, but deliberately narrow: only for SHORT replies (<=8 words) that
// don't look like a real question (no "?", doesn't start with a WH/aux
// word) - a genuine question a kid asks, even a short one like "what
// happens next?", still routes to the real answer pipeline. This preserves
// the original exact-match fix's intent (a longer message that merely
// CONTAINS an ack phrase, like "I don't understand why the story says X,
// can you explain?", must still get a real answer, not be treated as a bare
// ack) while catching short natural acknowledgments the exact set misses.
const QUESTION_STARTERS =
  /^(what|why|how|when|where|who|which|can|could|do|does|did|is|are|was|were|will|would|should)\b/;

function looksLikeQuestion(raw: string, normalized: string): boolean {
  return raw.includes("?") || QUESTION_STARTERS.test(normalized);
}

function containsWholePhrase(text: string, phrase: string): boolean {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|\\s)${escaped}($|\\s)`).test(text);
}

// AI answers are prompted to avoid markdown (see lib/claude.ts/lib/groq.ts),
// but models don't always comply perfectly - left unstripped, this both
// displays literal asterisks in the chat bubble and gets read aloud
// character-by-character ("asterisk asterisk...") by SpeechSynthesis, which
// has no markdown awareness. Applied once, right when a message is created,
// so the SAME cleaned string is used for display, speech, and the
// char-index-based read-along highlighting - sanitizing separately for
// speech vs. display would let their character offsets drift apart and
// break the highlight.
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`{1,3}([^`]*)`{1,3}/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\b\d{1,2}\.\s+(?=[A-Z])/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

// Key-point highlighting (2026-08-27): the AI (see lib/claude.ts/lib/groq.ts)
// and hand-authored concept content both mark the 2-4 most important terms
// per message with ==double equals==, e.g. "written in the ==third
// person==". Parsed into the same clean, marker-free string stripMarkdown
// already produces (so speech/read-along-highlight character offsets stay
// untouched - see the comment above stripMarkdown), plus a list of
// [start,end] ranges INTO that final string for the terms to render as a
// persistent highlight. Building the ranges by growing `out` incrementally
// (not from indexOf/replace on the original string) is what keeps the
// offsets correct even when the message contains several highlighted terms.
function parseFormattedText(raw: string): { text: string; keyRanges: [number, number][] } {
  const cleaned = stripMarkdown(raw);
  const keyRanges: [number, number][] = [];
  const re = /==(.+?)==/g;
  let out = "";
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(cleaned)) !== null) {
    out += cleaned.slice(lastIndex, match.index);
    const start = out.length;
    out += match[1];
    keyRanges.push([start, out.length]);
    lastIndex = re.lastIndex;
  }
  out += cleaned.slice(lastIndex);
  return { text: out, keyRanges };
}

function matchCheckpointIntent(text: string): "continue" | "repeat" | null {
  const t = normalizeAck(text);
  if (REPEAT_ACK_PHRASES.has(t)) return "repeat";
  if (CONTINUE_ACK_PHRASES.has(t)) return "continue";

  const wordCount = t.split(/\s+/).filter(Boolean).length;
  if (wordCount === 0 || wordCount > 8 || looksLikeQuestion(text, t)) return null;

  for (const phrase of REPEAT_ACK_PHRASES) {
    if (containsWholePhrase(t, phrase)) return "repeat";
  }
  for (const phrase of CONTINUE_ACK_PHRASES) {
    if (containsWholePhrase(t, phrase)) return "continue";
  }
  return null;
}

// Default speech rate lives in VoicePicker.tsx (getSavedRate) - a kid or
// parent can tune it per-device now instead of a single fixed value.
const SPEECH_LANG = "en-GB";

// Shared language preference - was originally just speech-to-text input
// (hardcoded to en-IN, so a parent/kid asking in Tamil wasn't transcribed
// correctly), now also controls what language on-demand Q&A ANSWERS come
// back in. Real, explicit need: a parent who isn't fluent in English can't
// help their kid with an English-only explanation, and sometimes a
// native-language framing helps a kid grasp a hard idea even in an English
// class. The core lesson content itself (checkpoints, hand-authored
// definitions/examples) always stays English - that's the point of an
// English-curriculum unit - only /api/ask's on-demand answers switch
// language, and even then the AI is told to keep key English subject terms
// alongside the translation so the pedagogical goal isn't lost (see
// lib/claude.ts / lib/groq.ts). ttsCode is the closest BCP-47 tag to ask
// SpeechSynthesis for when speaking that language back - a browser/OS may
// still not have a voice installed for it, which degrades gracefully to
// no voice-read (see pickVoice) rather than mis-speaking English text.
const LANGUAGE_KEY = "studyezy_language";
const LANGUAGES: { code: string; label: string; ttsCode: string }[] = [
  { code: "en-IN", label: "English", ttsCode: "en-GB" },
  { code: "ta-IN", label: "Tamil", ttsCode: "ta-IN" },
  { code: "hi-IN", label: "Hindi", ttsCode: "hi-IN" },
  { code: "te-IN", label: "Telugu", ttsCode: "te-IN" },
  { code: "kn-IN", label: "Kannada", ttsCode: "kn-IN" },
  { code: "ml-IN", label: "Malayalam", ttsCode: "ml-IN" },
  { code: "fr-FR", label: "French", ttsCode: "fr-FR" },
];

function getSavedLanguage(): string {
  if (typeof window === "undefined") return "en-IN";
  return localStorage.getItem(LANGUAGE_KEY) || "en-IN";
}

let cachedVoices: SpeechSynthesisVoice[] = [];

function pickVoice(targetLangCode?: string): SpeechSynthesisVoice | null {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) cachedVoices = voices;
  const pool = cachedVoices.length ? cachedVoices : voices;

  // Non-English responses need a voice that actually speaks that language -
  // the saved English voice preference would just mispronounce it, so
  // search by language instead of honoring that preference for this
  // utterance. Returns null (no voice forced) rather than falling through
  // to English if the device has nothing installed for this language -
  // better to fall back to the browser/OS's own default than to
  // confidently mis-speak French text with an English voice.
  if (targetLangCode && !targetLangCode.toLowerCase().startsWith("en")) {
    const target = targetLangCode.toLowerCase();
    const exact = pool.find((v) => v.lang?.toLowerCase() === target);
    if (exact) return exact;
    const base = target.split("-")[0];
    return pool.find((v) => v.lang?.toLowerCase().startsWith(base)) ?? null;
  }

  // A voice picked and previewed in VoicePicker always wins - it's a real
  // choice made against what's actually installed on this device, better
  // than any heuristic guess.
  const savedName = getSavedVoiceName();
  if (savedName) {
    const saved = pool.find((v) => v.name === savedName);
    if (saved) return saved;
  }

  // Otherwise fall back to a British English voice as the default; most
  // platforms ship at least one (e.g. "Google UK English Female", "Daniel",
  // "Kate", "Serena").
  const gb = pool.filter((v) => v.lang?.toLowerCase() === "en-gb");
  if (gb.length === 0) return null;
  return gb.find((v) => /female|kate|serena/i.test(v.name)) ?? gb[0];
}

function getWordRange(text: string, charIndex: number, charLength?: number): [number, number] {
  const start = Math.max(0, Math.min(charIndex, text.length));
  if (charLength && charLength > 0) {
    return [start, Math.min(start + charLength, text.length)];
  }
  let end = start;
  while (end < text.length && !/\s/.test(text[end])) end++;
  if (end === start) end = Math.min(start + 1, text.length);
  return [start, end];
}

// [start,end] character spans for each whitespace-delimited word in text -
// the same "word" unit a real onboundary event's charIndex/charLength
// normally gives us, computed up front so the synthetic fallback highlighter
// (see speakText) can step through them on a timer instead.
function computeWordSpans(text: string): [number, number][] {
  const spans: [number, number][] = [];
  const re = /\S+/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    spans.push([match.index, match.index + match[0].length]);
  }
  return spans;
}

// [text, startOffset, endOffset][] for each sentence - real, measured gap
// 2026-09-08: server TTS (see speakViaServerTts) has a fixed ~5s floor per
// call regardless of length, growing further for longer text (measured live:
// ~5s for one short sentence, ~13s for a real 5-sentence answer) - a kid
// waiting for the WHOLE answer's audio before anything plays is exactly the
// "10-20 seconds, not sure why" gap reported live. Splitting by sentence and
// starting playback as soon as the FIRST one's audio is ready (while later
// sentences generate in the background, one call ahead) cuts that wait back
// down to roughly one sentence's worth, not the whole answer's.
function splitIntoSentences(text: string): { text: string; start: number; end: number }[] {
  const matches = text.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g);
  if (!matches) return text.trim() ? [{ text: text.trim(), start: 0, end: text.length }] : [];
  const result: { text: string; start: number; end: number }[] = [];
  let cursor = 0;
  for (const raw of matches) {
    const trimmed = raw.trim();
    if (!trimmed) {
      cursor += raw.length;
      continue;
    }
    const start = text.indexOf(trimmed, cursor);
    const resolvedStart = start === -1 ? cursor : start;
    const end = resolvedStart + trimmed.length;
    result.push({ text: trimmed, start: resolvedStart, end });
    cursor = end;
  }
  return result;
}

// Composes two independent kinds of highlight over the same text: the
// persistent key-point marks from parseFormattedText's keyRanges (a kid
// should still see these after speech finishes and while re-reading later),
// and the transient "currently being spoken" word tracked by `range` during
// read-along. Both operate on the same character-offset space (see
// parseFormattedText's comment), so they compose correctly even when the
// live-speaking word falls inside a highlighted key phrase.
function HighlightedText({
  text,
  range,
  keyRanges,
}: {
  text: string;
  range: [number, number] | null;
  keyRanges?: [number, number][];
}) {
  if ((!keyRanges || keyRanges.length === 0) && !range) return <>{text}</>;

  const points = new Set<number>([0, text.length]);
  (keyRanges ?? []).forEach(([s, e]) => {
    points.add(s);
    points.add(e);
  });
  if (range) {
    points.add(range[0]);
    points.add(range[1]);
  }
  const bounds = Array.from(points)
    .filter((p) => p >= 0 && p <= text.length)
    .sort((a, b) => a - b);

  return (
    <>
      {bounds.slice(0, -1).map((start, i) => {
        const end = bounds[i + 1];
        if (start === end) return null;
        const chunk = text.slice(start, end);
        const isLive = !!range && start >= range[0] && start < range[1];
        const isKey = (keyRanges ?? []).some(([s, e]) => start >= s && start < e);
        if (isLive) {
          return (
            <mark key={start} className="rounded bg-yellow-300 px-0.5 text-slate-900">
              {chunk}
            </mark>
          );
        }
        if (isKey) {
          return (
            <mark key={start} className="rounded bg-brand-gold-bright/30 px-0.5 font-medium text-brand-ink-dark">
              {chunk}
            </mark>
          );
        }
        return <span key={start}>{chunk}</span>;
      })}
    </>
  );
}

export default function AvatarChat({
  unitKey,
  concept,
  onAdvanceConcept,
  onReachedPractice,
  hideSourceImage = false,
  hideIllustration = false,
  practiceSlot,
}: {
  unitKey: string;
  concept: Concept;
  /**
   * Set by UnitView when the lesson's textbook pane is open AND already
   * showing this concept's own page - in that case the small copy in here is
   * duplication. Never hides a built-in illustration, only a real scanned
   * page the booklet is displaying at full size.
   */
  hideSourceImage?: boolean;
  /**
   * Set by UnitView to drop the built-in cartoon illustration card at the
   * top of the thread - real feedback (2026-09-05): the generic art wasn't
   * worth the vertical space it took from the actual lesson/widget below on
   * a 3-column layout that's already tight on room. Independent of
   * hideSourceImage, which only ever governs the real scanned textbook page.
   * Only ever applies to the legacy illustration_key SVG set - a generated
   * illustration (see lib/conceptIllustration.ts) doesn't use this card at
   * all any more, it's shown inline in the conversation instead (2026-09-08,
   * see buildCheckpoints), so there's nothing here for this flag to hide.
   */
  hideIllustration?: boolean;
  // Real gap found live 2026-08-27: after finishing a concept's checkpoints
  // and micro-check questions, the avatar asked "Ready to move on?" but
  // nothing in this component ever acted on a "yes" - there was no
  // mechanism anywhere to advance to the next concept in the unit, so the
  // conversation just dead-ended there no matter what the kid said. Passed
  // in by UnitView.tsx (undefined on the unit's last concept, where there's
  // nothing to advance to).
  onAdvanceConcept?: () => void;
  /**
   * Fires once the explanation/checkpoints/micro-checks are actually done
   * and the avatar is asking "ready to move on?" - real feedback
   * (2026-09-05): the practice widget used to render unconditionally the
   * whole time, "hanging separately at the bottom" even while Ezy was still
   * mid-explanation. UnitView uses this to reveal the widget only once
   * there's actually something to practise.
   */
  onReachedPractice?: () => void;
  /**
   * The concept's practice widget (see components/interactive/
   * WidgetDispatcher.tsx), rendered by the caller and handed in rather than
   * built here - AvatarChat has no idea what a "widget" is, it just gives
   * this a place to live. Real feedback 2026-09-08: it used to render as a
   * separate block below this whole component, which read as a different,
   * disconnected part of the page rather than part of the same
   * conversation - now it's placed inside the same scrolling thread as
   * every other message, right after whatever Ezy last said.
   */
  practiceSlot?: React.ReactNode;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [readyForInput, setReadyForInput] = useState(false);
  const [awaitingContinue, setAwaitingContinue] = useState(false);
  const [awaitingConceptAdvance, setAwaitingConceptAdvance] = useState(false);
  const [checkpointIndex, setCheckpointIndex] = useState(0);
  const [inMicroCheck, setInMicroCheck] = useState(false);
  const [microCheckIndex, setMicroCheckIndex] = useState(0);
  const [microCheckAttempt, setMicroCheckAttempt] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [speechPaused, setSpeechPaused] = useState(false);
  const [highlightRange, setHighlightRange] = useState<[number, number] | null>(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [speechInputSupported, setSpeechInputSupported] = useState(false);
  const [language, setLanguage] = useState(getSavedLanguage);
  const [readAloud, setReadAloud] = useState(true);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  // Replaces the static starter suggestions once the AI has answered at
  // least one question - keeps evolving after every answer instead of
  // staying frozen on the same list for the whole conversation.
  const [dynamicFollowUps, setDynamicFollowUps] = useState<string[]>([]);
  // Real feedback 2026-09-08: once the illustration checkpoint scrolls past,
  // a LATER checkpoint (e.g. a key point) can reference the same scene the
  // picture showed (the "raining cats and dogs" idiom is drawn in the
  // illustration but only spoken during the key-points step, not the
  // examples step the picture is attached to) with no way to see it again.
  // Keeps a small recap of the current concept's illustration pinned within
  // the chat pane (not the whole page - it's still "inside the
  // conversation", just persistent instead of a single scrolled-past
  // bubble) from the moment it's introduced through the rest of the lesson.
  const [activeIllustrationUrl, setActiveIllustrationUrl] = useState<string | undefined>(undefined);

  const playTokenRef = useRef(0);
  const checkpointsRef = useRef<CheckpointStep[]>([]);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Pause/resume state - see togglePauseSpeech for why this exists instead
  // of just calling speechSynthesis.resume().
  const currentUtteranceRef = useRef<{
    text: string;
    messageId: string;
    onDone: () => void;
    langCode?: string;
    baseOffset: number;
  } | null>(null);
  const lastBoundaryOffsetRef = useRef(0);
  const isPausingRef = useRef(false);
  const [noVoiceForLanguage, setNoVoiceForLanguage] = useState(false);
  // Shown only while waiting on server TTS's first sentence (see
  // speakViaServerTts) - the browser voice path is near-instant and never
  // sets this. Real gap reported live: with nothing on screen during that
  // wait, a genuine ~5s+ model latency read as the feature being broken.
  const [preparingSpeech, setPreparingSpeech] = useState(false);
  // Real, common gap reported live: on plenty of installed voices (most
  // non-"Google" system voices in Chrome, and Safari/Firefox generally),
  // SpeechSynthesisUtterance never fires onboundary at all - speech plays
  // fine but the read-along highlight silently never appears, which looks
  // broken rather than like a voice limitation. boundaryFiredRef tracks
  // whether a REAL boundary event has arrived for the current utterance;
  // syntheticHighlightTimerRef holds the fallback timer that steps through
  // the text's own words on an estimated clock when it hasn't - see
  // speakText below. A real boundary event always wins if one does arrive.
  const boundaryFiredRef = useRef(false);
  const syntheticHighlightTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Real gap reported live 2026-09-08: Chrome on plenty of real devices has
  // NO installed Tamil (or other Indian language) voice at all - a
  // correctly-translated /api/ask reply had nothing able to speak it back,
  // so "local language support" silently only worked for reading, not
  // listening. When pickVoice finds nothing for a non-English language,
  // speakText falls back to server-side TTS (lib/gemini.ts's
  // generateSpeechGemini, via /api/tts) and plays it through this <audio>
  // element instead of a SpeechSynthesisUtterance - see speakViaServerTts.
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const audioObjectUrlRef = useRef<string | null>(null);
  const audioHighlightIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Bumped by every genuine new speakText call and by stopSpeech - lets
  // speakViaServerTts's multi-chunk async loop (see splitIntoSentences)
  // detect it's been superseded/stopped and stop scheduling further chunks,
  // without touching currentUtteranceRef (which the SEPARATE browser-voice
  // pause/resume flow in togglePauseSpeech depends on staying populated
  // across a pause, so stopSpeech deliberately never clears it).
  const speechGenerationRef = useRef(0);

  useEffect(() => {
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSpeechInputSupported(Boolean(SpeechRecognitionCtor));

    // Voice lists load asynchronously in most browsers - warm the cache now
    // so the first line spoken already has a chance to use a UK voice
    // instead of falling back to the system default.
    if ("speechSynthesis" in window) {
      pickVoice();
      window.speechSynthesis.onvoiceschanged = () => pickVoice();
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function clearSyntheticHighlighter() {
    if (syntheticHighlightTimerRef.current !== null) {
      clearInterval(syntheticHighlightTimerRef.current);
      syntheticHighlightTimerRef.current = null;
    }
  }

  function clearAudioHighlightInterval() {
    if (audioHighlightIntervalRef.current !== null) {
      clearInterval(audioHighlightIntervalRef.current);
      audioHighlightIntervalRef.current = null;
    }
  }

  function cleanupAudio() {
    clearAudioHighlightInterval();
    if (audioObjectUrlRef.current) {
      URL.revokeObjectURL(audioObjectUrlRef.current);
      audioObjectUrlRef.current = null;
    }
    audioElRef.current = null;
  }

  // Every real stop-speech call site needs every half - cancelling the
  // browser utterance, the server-TTS <audio> element (if that's the path
  // that was active), and both highlight timers, none of which are stopped
  // by speechSynthesis.cancel() alone.
  function stopSpeech() {
    speechGenerationRef.current++;
    clearSyntheticHighlighter();
    window.speechSynthesis?.cancel();
    audioElRef.current?.pause();
    cleanupAudio();
    setPreparingSpeech(false);
  }

  // Server-side speech (see lib/gemini.ts's generateSpeechGemini via
  // /api/tts) - the fallback speakText reaches for when pickVoice finds no
  // browser voice for a non-English language (real gap reported live
  // 2026-09-08: Chrome commonly has zero installed Tamil/Indian-language
  // voices). Highlighting here is even more accurate than the synthetic
  // word-timer fallback used for browser TTS: a real <audio> element knows
  // its own total duration once loaded, so each word's highlight timing is
  // computed as a proportion of actual playback progress instead of a
  // guessed words-per-minute rate. Pause/resume also gets simpler and more
  // reliable here - unlike speechSynthesis, HTML <audio> pause()/play() has
  // no equivalent "resume silently does nothing" browser bug to work around
  // (see togglePauseSpeech).
  //
  // Real, measured gap reported live 2026-09-08: this model has a fixed
  // ~5s floor per call, growing for longer text (measured: ~5s for one
  // short sentence, ~13s for a real 5-sentence answer) - waiting for the
  // WHOLE answer's audio before anything plays produced exactly the
  // "10-20 seconds, not sure why" delay. Fixed by splitting into sentences
  // (splitIntoSentences) and pipelining: play sentence 1 as soon as its
  // audio is ready while sentence 2 generates in the background (one call
  // ahead of playback), so the wait a kid actually feels is roughly one
  // sentence's worth, not the whole reply's - and total spoken duration is
  // unchanged since it's the same audio, just fetched/played in pieces.
  //
  // Real gap reported live 2026-09-08: playback stopped partway through a
  // longer reply ("reads them incomplete") with no error visible anywhere.
  // Root cause: each chunk created a BRAND NEW Audio() element, and Chrome's
  // autoplay policy only reliably keeps allowing programmatic play() on the
  // SAME element that was blessed by the original user action - a fresh
  // element created later inside an async chain (after an await fetch)
  // can get silently blocked, and an unhandled play() rejection on top of
  // that meant the chunk chain just stopped dead with no next-chunk call
  // and no onDone(), which could also hang the whole lesson waiting on a
  // callback that would never fire. Fixed by (1) reusing ONE Audio element
  // across every chunk of a single reply, and (2) wrapping play() so a
  // rejection always still advances the chain instead of freezing it.
  async function speakViaServerTts(text: string, messageId: string, onDone: () => void, baseOffset: number, langCode: string) {
    const sentences = splitIntoSentences(text);
    if (sentences.length === 0) {
      setTimeout(onDone, 400);
      return;
    }

    // Captured here, not passed in - speakText increments speechGenerationRef
    // immediately before calling this, synchronously, so this always reads
    // the fresh value for this specific call.
    const myGeneration = speechGenerationRef.current;
    const isCurrent = () => speechGenerationRef.current === myGeneration;
    const audioCache = new Map<number, Blob | null>();

    async function fetchChunk(i: number): Promise<Blob | null> {
      if (i >= sentences.length) return null;
      if (audioCache.has(i)) return audioCache.get(i) ?? null;
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: sentences[i].text, languageCode: langCode }),
        });
        if (!res.ok) throw new Error(`tts request failed (${res.status})`);
        const blob = await res.blob();
        audioCache.set(i, blob);
        return blob;
      } catch (err) {
        console.error(`speakViaServerTts chunk ${i} failed`, err);
        audioCache.set(i, null);
        return null;
      }
    }

    function finish() {
      cleanupAudio();
      setPreparingSpeech(false);
      setSpeaking(false);
      setSpeakingMessageId(null);
      setHighlightRange(null);
      onDone();
    }

    // Created ONCE, reused for every chunk - see the function-level comment
    // above for why a fresh Audio() per chunk was the real bug.
    const audio = new Audio();
    audioElRef.current = audio;

    async function playChunk(i: number) {
      if (!isCurrent()) return;
      if (i >= sentences.length) {
        finish();
        return;
      }
      if (i === 0) setPreparingSpeech(true);
      const blob = await fetchChunk(i);
      if (!isCurrent()) return;
      setPreparingSpeech(false);
      if (!blob) {
        setNoVoiceForLanguage(true);
        playChunk(i + 1);
        return;
      }
      // Pipeline: start fetching the NEXT sentence now, in parallel with
      // this one playing, so there's no gap waiting between sentences.
      fetchChunk(i + 1);

      if (audioObjectUrlRef.current) URL.revokeObjectURL(audioObjectUrlRef.current);
      const url = URL.createObjectURL(blob);
      audioObjectUrlRef.current = url;
      audio.src = url;

      const { start: rangeStart, end: rangeEnd } = sentences[i];
      const spans = computeWordSpans(sentences[i].text);
      audio.onloadedmetadata = () => {
        const durationMs = audio.duration * 1000;
        if (!durationMs || spans.length === 0) return;
        clearAudioHighlightInterval();
        audioHighlightIntervalRef.current = setInterval(() => {
          if (audioElRef.current !== audio || !isCurrent()) {
            clearAudioHighlightInterval();
            return;
          }
          const progress = Math.min(1, (audio.currentTime * 1000) / durationMs);
          const idx = Math.min(spans.length - 1, Math.floor(progress * spans.length));
          const [wordStart, wordEnd] = spans[idx];
          lastBoundaryOffsetRef.current = baseOffset + rangeStart + wordStart;
          setHighlightRange([baseOffset + rangeStart + wordStart, baseOffset + rangeStart + wordEnd]);
        }, 90);
      };
      audio.onended = () => {
        lastBoundaryOffsetRef.current = baseOffset + rangeEnd;
        playChunk(i + 1);
      };
      audio.onerror = () => {
        console.error(`speakViaServerTts: playback error on chunk ${i}`);
        setNoVoiceForLanguage(true);
        playChunk(i + 1);
      };
      setSpeaking(true);
      setSpeakingMessageId(messageId);
      setSpeechPaused(false);
      try {
        await audio.play();
      } catch (err) {
        // A rejected play() (e.g. the browser's autoplay policy blocking a
        // later chunk) must never silently stop the chain here - that's
        // exactly what produced "reads them incomplete" with no visible
        // error, and could leave the whole lesson waiting on an onDone()
        // that would never come. Advance instead: the rest of the reply is
        // still fully visible as text even if audio can't continue.
        console.error(`speakViaServerTts: play() rejected on chunk ${i}`, err);
        if (!isCurrent()) return;
        setNoVoiceForLanguage(true);
        playChunk(i + 1);
      }
    }

    playChunk(0);
  }

  // baseOffset is where `text` starts within the "logical" full message -
  // 0 for a normal from-scratch call, or a mid-message offset when resuming
  // after a pause (see togglePauseSpeech). Keeping highlight math relative
  // to baseOffset means the highlight range is always correct against the
  // ORIGINAL full text, even when the utterance currently playing is only
  // the remainder after a pause.
  function speakText(text: string, messageId: string, onDone: () => void, langCode?: string, baseOffset = 0) {
    speechGenerationRef.current++;
    isPausingRef.current = false;
    setNoVoiceForLanguage(false);
    boundaryFiredRef.current = false;
    clearSyntheticHighlighter();
    cleanupAudio();

    if (!(readAloud && "speechSynthesis" in window)) {
      setTimeout(onDone, 1400);
      return;
    }

    const voice = pickVoice(langCode);
    if (!voice && langCode && !langCode.toLowerCase().startsWith("en")) {
      currentUtteranceRef.current = { text, messageId, onDone, langCode, baseOffset };
      speakViaServerTts(text, messageId, onDone, baseOffset, langCode);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode ?? SPEECH_LANG;
    utterance.rate = getSavedRate();
    if (voice) {
      utterance.voice = voice;
    }
    lastBoundaryOffsetRef.current = baseOffset;
    currentUtteranceRef.current = { text, messageId, onDone, langCode, baseOffset };
    utterance.onboundary = (event) => {
      if (event.name === "sentence") return;
      boundaryFiredRef.current = true;
      clearSyntheticHighlighter();
      const charLength = (event as unknown as { charLength?: number }).charLength;
      const [start, end] = getWordRange(text, event.charIndex, charLength);
      lastBoundaryOffsetRef.current = baseOffset + start;
      setHighlightRange([baseOffset + start, baseOffset + end]);
    };
    utterance.onend = () => {
      clearSyntheticHighlighter();
      if (isPausingRef.current) return;
      currentUtteranceRef.current = null;
      setSpeaking(false);
      setSpeakingMessageId(null);
      setHighlightRange(null);
      onDone();
    };
    utterance.onerror = () => {
      clearSyntheticHighlighter();
      if (isPausingRef.current) return;
      currentUtteranceRef.current = null;
      setSpeaking(false);
      setSpeakingMessageId(null);
      setHighlightRange(null);
      onDone();
    };
    setSpeaking(true);
    setSpeakingMessageId(messageId);
    setSpeechPaused(false);
    window.speechSynthesis.speak(utterance);

    // Real, common gap (see boundaryFiredRef's comment above): plenty of
    // installed voices never fire onboundary at all, so the read-along
    // highlight silently never appears even though speech plays fine. If no
    // real boundary event has arrived shortly after starting, approximate
    // one instead - step through the text's own words on a timer at an
    // estimated speaking pace (165 wpm at rate 1, the usual ballpark for
    // plain narration, scaled by the actual utterance rate). A real
    // boundary event, if one does eventually arrive, always wins - see
    // boundaryFiredRef's check inside onboundary and the interval below.
    const spans = computeWordSpans(text);
    const msPerWord = Math.max(120, 60000 / (165 * utterance.rate));
    setTimeout(() => {
      if (boundaryFiredRef.current || currentUtteranceRef.current?.messageId !== messageId || spans.length === 0) return;
      let wordIndex = 0;
      syntheticHighlightTimerRef.current = setInterval(() => {
        if (boundaryFiredRef.current || currentUtteranceRef.current?.messageId !== messageId || wordIndex >= spans.length) {
          clearSyntheticHighlighter();
          return;
        }
        const [start, end] = spans[wordIndex];
        lastBoundaryOffsetRef.current = baseOffset + start;
        setHighlightRange([baseOffset + start, baseOffset + end]);
        wordIndex++;
      }, msPerWord);
    }, 350);
  }

  // Deliberately does NOT rely on speechSynthesis.pause()/resume() for the
  // resume half - resume() is a long-documented Chrome bug where speech
  // stays silently paused forever after pause() (reported: "tap pause
  // worked, tap resume didn't"). Instead: pausing cancels the utterance but
  // remembers exactly where playback stopped (lastBoundaryOffsetRef, kept
  // current by onboundary), and resuming re-speaks just the remaining text
  // as a fresh utterance - reliable on every browser, not just the ones
  // whose resume() actually works. isPausingRef tells the onend/onerror
  // handlers this cancel was intentional, so they don't fire onDone() (which
  // would otherwise incorrectly advance the lesson as if speech had
  // finished naturally).
  function togglePauseSpeech() {
    // Server-TTS playback (see speakViaServerTts) - real <audio>
    // pause()/play() is reliable, unlike speechSynthesis's resume() (see
    // the comment below), so this doesn't need the cancel-and-reconstruct
    // workaround the browser-voice path below uses.
    const audio = audioElRef.current;
    if (audio) {
      if (speechPaused) {
        audio.play();
        setSpeechPaused(false);
      } else {
        audio.pause();
        setSpeechPaused(true);
      }
      return;
    }

    if (!("speechSynthesis" in window)) return;

    if (speechPaused) {
      const paused = currentUtteranceRef.current;
      if (!paused) {
        setSpeechPaused(false);
        return;
      }
      const consumed = Math.max(0, lastBoundaryOffsetRef.current - paused.baseOffset);
      const remaining = paused.text.slice(consumed);
      if (!remaining.trim()) {
        clearSyntheticHighlighter();
        setSpeechPaused(false);
        setSpeaking(false);
        setSpeakingMessageId(null);
        setHighlightRange(null);
        currentUtteranceRef.current = null;
        paused.onDone();
        return;
      }
      speakText(remaining, paused.messageId, paused.onDone, paused.langCode, lastBoundaryOffsetRef.current);
    } else if (window.speechSynthesis.speaking) {
      isPausingRef.current = true;
      stopSpeech();
      setSpeechPaused(true);
      // Leave speaking/speakingMessageId/highlightRange as-is - paused
      // should freeze the display, not clear it.
    }
  }

  function startFinalCheckIn(token: number) {
    if (playTokenRef.current !== token) return;
    const samples = concept.voice_qa_samples ?? [];
    if (samples.length > 0) {
      askMicroCheck(0, token);
      return;
    }
    const checkIn = onAdvanceConcept
      ? "Want to try answering a quick question, ask me anything about this, or move on to the next part?"
      : "Want to try answering a quick question, or ask me anything about this?";
    const id = nextId();
    setMessages((prev) => [...prev, { id, sender: "avatar", text: checkIn }]);
    speakText(checkIn, id, () => {});
    setReadyForInput(true);
    setAwaitingContinue(false);
    setAwaitingConceptAdvance(Boolean(onAdvanceConcept));
    onReachedPractice?.();
  }

  function askMicroCheck(index: number, token: number) {
    if (playTokenRef.current !== token) return;
    const samples = concept.voice_qa_samples ?? [];
    const count = Math.min(MICRO_CHECK_COUNT, samples.length);

    if (index >= count) {
      setInMicroCheck(false);
      // Real gap found live 2026-08-27: this message asked "ready to move
      // on?" but nothing acted on a "yes" - see onAdvanceConcept's comment.
      // Wording now matches what actually happens: only offers "move on" as
      // an option when there's somewhere to move on TO (a next concept).
      const checkIn = onAdvanceConcept
        ? "Ready to move on to the next part, or want to ask me anything else about this first?"
        : "Nice work - that's everything in this unit! Want to ask me anything else about this first?";
      const id = nextId();
      setMessages((prev) => [...prev, { id, sender: "avatar", text: checkIn }]);
      speakText(checkIn, id, () => {});
      setReadyForInput(true);
      setAwaitingContinue(false);
      setAwaitingConceptAdvance(Boolean(onAdvanceConcept));
      onReachedPractice?.();
      return;
    }

    const question = samples[index].question;
    const id = nextId();
    setMessages((prev) => [...prev, { id, sender: "avatar", text: question }]);
    speakText(question, id, () => {});
    setReadyForInput(true);
    setAwaitingContinue(false);
    setInMicroCheck(true);
    setMicroCheckIndex(index);
    setMicroCheckAttempt(1);
  }

  function playCheckpoint(index: number, token: number) {
    if (playTokenRef.current !== token) return;
    const checkpoints = checkpointsRef.current;

    if (checkpoints.length === 0 || index > checkpoints.length - 1) {
      startFinalCheckIn(token);
      return;
    }

    const isLast = index === checkpoints.length - 1;
    const step = checkpoints[index];
    const msgs = step.lines;

    function speakStep(i: number) {
      if (playTokenRef.current !== token) return;
      if (i >= msgs.length) {
        if (isLast) {
          startFinalCheckIn(token);
        } else {
          const prompt = PAUSE_PROMPTS[index % PAUSE_PROMPTS.length];
          const id = nextId();
          setMessages((prev) => [...prev, { id, sender: "avatar", text: prompt }]);
          speakText(prompt, id, () => {});
          setReadyForInput(true);
          setAwaitingContinue(true);
        }
        return;
      }
      const id = nextId();
      const { text: cleanText, keyRanges } = parseFormattedText(msgs[i]);
      if (i === 0 && step.illustrationUrl) setActiveIllustrationUrl(step.illustrationUrl);
      setMessages((prev) => [
        ...prev,
        { id, sender: "avatar", text: cleanText, keyRanges, generatedIllustrationUrl: i === 0 ? step.illustrationUrl : undefined },
      ]);
      speakText(cleanText, id, () => {
        if (playTokenRef.current !== token) return;
        speakStep(i + 1);
      });
    }

    speakStep(0);
  }

  useEffect(() => {
    const myToken = playTokenRef.current + 1;
    playTokenRef.current = myToken;

    // Resetting chat state here is synchronizing with an external system
    // (speechSynthesis playback) that has to restart whenever the concept
    // changes - there's no render-time equivalent for "cancel in-flight speech
    // and begin a new teaching sequence."
    /* eslint-disable react-hooks/set-state-in-effect */
    setMessages([]);
    setReadyForInput(false);
    setAwaitingContinue(false);
    setAwaitingConceptAdvance(false);
    setCheckpointIndex(0);
    setInMicroCheck(false);
    setMicroCheckIndex(0);
    setMicroCheckAttempt(1);
    setSpeaking(false);
    setSpeakingMessageId(null);
    setHighlightRange(null);
    setDynamicFollowUps([]);
    setSpeechPaused(false);
    setActiveIllustrationUrl(undefined);
    setPreparingSpeech(false);
    /* eslint-enable react-hooks/set-state-in-effect */
    stopSpeech();

    checkpointsRef.current = buildCheckpoints(concept);

    // AvatarChat is remounted (not just re-rendered) on every concept
    // change - see UnitView.tsx's key={selected.concept_id}. React flushes
    // the old instance's cleanup (cancel() above/below) and the new
    // instance's effect in the same synchronous pass, so without a beat in
    // between, this speak() call reaches the browser's speech engine before
    // the previous cancel() has actually taken effect - a documented Chrome
    // quirk where the two utterances end up queued back to back instead of
    // the old one being interrupted (reported: switching concepts kept
    // reading the OLD concept's intro before continuing into the new one).
    // A short delay is a pragmatic, well-known workaround for this exact
    // race - clearTimeout in the cleanup also protects a rapid double
    // concept-switch from leaving a stale speak() scheduled.
    const startTimer = setTimeout(() => playCheckpoint(0, myToken), 80);

    return () => {
      clearTimeout(startTimer);
      stopSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concept.concept_id, readAloud]);

  function handleContinueCheckpoint() {
    stopSpeech();
    setAwaitingContinue(false);
    const ack = CONTINUE_ACKS[checkpointIndex % CONTINUE_ACKS.length];
    const ackId = nextId();
    setMessages((prev) => [...prev, { id: ackId, sender: "avatar", text: ack }]);
    const nextIndex = checkpointIndex + 1;
    setCheckpointIndex(nextIndex);
    const token = playTokenRef.current;
    speakText(ack, ackId, () => playCheckpoint(nextIndex, token));
  }

  function handleRepeatCheckpoint() {
    stopSpeech();
    setAwaitingContinue(false);
    const ack = REPEAT_ACKS[checkpointIndex % REPEAT_ACKS.length];
    const ackId = nextId();
    setMessages((prev) => [...prev, { id: ackId, sender: "avatar", text: ack }]);
    const token = playTokenRef.current;
    speakText(ack, ackId, () => playCheckpoint(checkpointIndex, token));
  }

  function handleAdvanceConcept() {
    stopSpeech();
    setAwaitingConceptAdvance(false);
    onAdvanceConcept?.();
  }

  // Distinct from "say that again" (a verbatim repeat) - this asks for a
  // genuinely different explanation, so it goes through the same
  // grounded-answer pipeline as free-form questions (Claude -> Groq -> local
  // fallback, see /api/ask) instead of replaying the same wording.
  // Deliberately leaves awaitingContinue as-is so the pause buttons stay
  // available - the kid might need another round before they're ready to
  // continue.
  function handleExplainDifferently() {
    sendMessage("Can you explain that in a different, simpler way?");
  }

  // For confusion about one specific part rather than the whole checkpoint -
  // pre-fills a sentence starter and focuses the input so the kid only has
  // to finish the thought, instead of writing a question from scratch.
  function promptForSpecificConfusion() {
    setInputText("I don't understand the part about ");
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { id: nextId(), sender: "kid", text: trimmed }]);
    setInputText("");

    // A natural "okay" / "again?" style reply during a checkpoint pause acts
    // like tapping the pause buttons - no need to send it off as a real
    // question (and no AI call needed, so this works even without credits).
    if (awaitingContinue) {
      const intent = matchCheckpointIntent(trimmed);
      if (intent === "continue") {
        handleContinueCheckpoint();
        return;
      }
      if (intent === "repeat") {
        handleRepeatCheckpoint();
        return;
      }
    }

    // Same idea, but for "ready to move on?" at the very end of a concept -
    // only "continue"-shaped replies act (a "repeat" here has no special
    // meaning, so it falls through to a real answer like any other message).
    if (awaitingConceptAdvance && matchCheckpointIntent(trimmed) === "continue") {
      handleAdvanceConcept();
      return;
    }

    const languageInfo = LANGUAGES.find((l) => l.code === language);

    // Real user request 2026-09-08: a half/incorrect/negative micro-check
    // answer must be corrected with more explanation and NOT let the lesson
    // move on until the kid actually gets it (see lib/groq.ts's
    // groqMicroCheckGrade and MAX_MICRO_CHECK_ATTEMPTS above for what
    // changed and why, and the retry cap). Awaited (not fire-and-forget) so
    // what's spoken back actually reflects what the kid said.
    if (inMicroCheck) {
      const sample = concept.voice_qa_samples?.[microCheckIndex];
      const questionAsked = sample?.question ?? "";
      setLoading(true);
      let verdict: "correct" | "partial" | "incorrect" = "correct";
      let feedback = FALLBACK_ACK;
      try {
        const res = await fetch("/api/micro-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            unitKey,
            conceptId: concept.concept_id,
            question: questionAsked,
            expectedAnswer: sample?.answer ?? "",
            answer: trimmed,
            index: microCheckIndex,
            attempt: microCheckAttempt,
            language: languageInfo?.label ?? "English",
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as { verdict?: string; feedback?: string };
          if (data.feedback) feedback = stripMarkdown(data.feedback);
          if (data.verdict === "correct" || data.verdict === "partial" || data.verdict === "incorrect") {
            verdict = data.verdict;
          }
        }
      } catch {
        // keep the lenient defaults - an infra failure shouldn't trap a kid
        // in a retry loop over an answer the server never actually saw.
      }
      setLoading(false);
      const ackId = nextId();
      setMessages((prev) => [...prev, { id: ackId, sender: "avatar", text: feedback }]);
      const token = playTokenRef.current;
      const doneWithThisQuestion = verdict === "correct" || microCheckAttempt >= MAX_MICRO_CHECK_ATTEMPTS;

      if (doneWithThisQuestion) {
        speakText(feedback, ackId, () => askMicroCheck(microCheckIndex + 1, token), languageInfo?.ttsCode);
      } else {
        // Same question again, not the next one - re-ask after the
        // corrective feedback instead of advancing microCheckIndex.
        setMicroCheckAttempt(microCheckAttempt + 1);
        speakText(
          feedback,
          ackId,
          () => {
            if (playTokenRef.current !== token) return;
            const retryId = nextId();
            // Unlike the feedback above (AI-generated, genuinely in the
            // target language), this question text is the hand-authored
            // English voice_qa_sample verbatim - spoken with the default
            // English voice, not languageInfo's, since translating it would
            // need its own AI call and this is just a literal repeat.
            const retryText = `Let's try that again: ${questionAsked}`;
            setMessages((prev) => [...prev, { id: retryId, sender: "avatar", text: retryText }]);
            speakText(retryText, retryId, () => {});
            setReadyForInput(true);
          },
          languageInfo?.ttsCode
        );
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitKey,
          conceptId: concept.concept_id,
          question: trimmed,
          language: languageInfo?.label ?? "English",
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Try again in a moment.");
      }

      const data = (await res.json()) as { answer: string; followUps?: string[] };
      const { text: withoutToken, illustrationKey } = extractIllustrationToken(data.answer);
      const { text: cleanAnswer, keyRanges } = parseFormattedText(withoutToken);
      const answerId = nextId();
      setMessages((prev) => [...prev, { id: answerId, sender: "avatar", text: cleanAnswer, illustrationKey, keyRanges }]);
      speakText(cleanAnswer, answerId, () => {}, languageInfo?.ttsCode);
      // Only replace the suggestions if fresh ones actually came back -
      // keep showing the last known-good list rather than going blank if
      // this best-effort generation didn't produce anything usable.
      if (data.followUps?.length) setDynamicFollowUps(data.followUps.map(stripMarkdown));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function startListening() {
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;
    const recognition: SpeechRecognitionLike = new SpeechRecognitionCtor();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => setInputText(event.results[0][0].transcript);
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  // Starter suggestions, shown until the AI has answered at least one real
  // question - dynamicFollowUps (regenerated after every answer, see
  // sendMessage) takes over from there so the chips keep evolving with the
  // conversation instead of staying frozen on this fixed list forever.
  const starterReplies = [
    ...(concept.voice_qa_samples?.map((q) => q.question) ?? []),
    "Can you explain that differently?",
    "Give me another example",
    ...(concept.reasoning_interview_prompts ?? []),
  ].slice(0, 5);
  const quickReplies = dynamicFollowUps.length > 0 ? dynamicFollowUps : starterReplies;

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* A generated illustration (lib/conceptIllustration.ts) no longer
          shows here - 2026-09-08: moved into the conversation itself (see
          buildCheckpoints/playCheckpoint), spoken right after the intro
          alongside the concept's examples, instead of a static header a kid
          could scroll past unread. This card is back to its original two
          jobs: the real scanned textbook page, and the legacy hand-drawn
          illustration_key set (still gated by hideIllustration). */}
      {((concept.media?.source_image_path && !hideSourceImage) ||
        (concept.media?.illustration_key && !hideIllustration)) && (
        // max-w-xl + aspect-ratio (matching the illustrations' own 300x180
        // viewBox) gives the artwork real presence instead of a small
        // thumbnail, while still capping it well short of the full-width
        // lesson column - an uncapped width was the earlier "empty space"
        // regression (2026-08-21) when this card had little content to fill
        // it with.
        <div className="max-w-xl rounded-2xl border border-slate-200/70 bg-white p-4 shadow-soft">
          {/* A scanned page is portrait, so it gets a portrait box and
              object-contain. It used to share the illustrations' landscape
              aspect-[5/3] with object-cover, which sliced the top and bottom
              off every real textbook page - the actual source of the
              "cropped pages" complaint (2026-08-30). Built-in illustrations
              really are 300x180 artwork and keep the landscape box. */}
          <div
            className={`w-full overflow-hidden rounded-xl ${
              concept.media?.source_image_path && !hideSourceImage ? "aspect-[3/4]" : "aspect-[5/3]"
            }`}
          >
            {concept.media?.source_image_path && !hideSourceImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={concept.media.source_image_path}
                alt={concept.media.illustration_caption ?? concept.concept_name}
                className="h-full w-full bg-slate-50 object-contain"
              />
            ) : (
              <Illustration illustrationKey={concept.media!.illustration_key!} />
            )}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-600">{concept.media?.illustration_caption}</p>
            {concept.media?.video_status === "coming_soon" && (
              <span className="w-fit shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                🎬 Video coming soon
              </span>
            )}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-practice-border bg-practice-bg">
        {activeIllustrationUrl && (
          // Real feedback 2026-09-08: a later checkpoint's text can refer
          // back to something the illustration showed (e.g. a key point
          // naming an idiom the picture already drew) after the message
          // that introduced it has scrolled out of view. This small recap
          // stays pinned for the rest of the concept so the conversation
          // keeps "connecting" to the picture instead of only showing it once.
          <div className="flex items-center gap-2 border-b border-practice-border bg-white/70 px-4 py-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeIllustrationUrl}
              alt=""
              className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 object-cover"
            />
            <p className="text-xs text-slate-500">This lesson&apos;s picture - scroll up to see it full size</p>
          </div>
        )}
        <div ref={scrollRef} className="flex max-h-[420px] flex-col gap-3 overflow-y-auto p-4">
          {messages.map((m) =>
            m.sender === "avatar" ? (
              <div key={m.id} className="message-enter flex items-start gap-2">
                <Avatar speaking={m.id === speakingMessageId} />
                <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-2 text-sm leading-relaxed text-slate-800 shadow-sm">
                  <HighlightedText
                    text={m.text}
                    range={m.id === speakingMessageId ? highlightRange : null}
                    keyRanges={m.keyRanges}
                  />
                  {m.illustrationKey && (
                    <div className="mt-2 aspect-[5/3] w-64 max-w-full overflow-hidden rounded-xl">
                      <Illustration illustrationKey={m.illustrationKey} />
                    </div>
                  )}
                  {m.generatedIllustrationUrl && (
                    <div className="mt-2 aspect-square w-64 max-w-full overflow-hidden rounded-xl border border-slate-200/70">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.generatedIllustrationUrl} alt="" className="h-full w-full bg-slate-50 object-contain" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div key={m.id} className="message-enter flex justify-end">
                <div className="rounded-2xl rounded-tr-sm bg-brand-ink px-4 py-2 text-sm leading-relaxed text-white shadow-sm">
                  {m.text}
                </div>
              </div>
            )
          )}
          {loading && (
            <div className="flex items-center gap-2">
              <Avatar speaking />
              <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-2 text-sm text-slate-400 shadow-sm">
                Thinking...
              </div>
            </div>
          )}
          {practiceSlot && <div className="message-enter flex items-start gap-2">{practiceSlot}</div>}
        </div>

        <div className="border-t border-practice-border p-4">
          {awaitingContinue ? (
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleContinueCheckpoint}
                disabled={loading}
                className="rounded-full bg-green-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                👍 Got it, keep going
              </button>
              <button
                type="button"
                onClick={handleExplainDifferently}
                disabled={loading}
                className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                🤔 Kind of - explain it another way
              </button>
              <button
                type="button"
                onClick={handleRepeatCheckpoint}
                disabled={loading}
                className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                🔁 Say that again
              </button>
              <button
                type="button"
                onClick={promptForSpecificConfusion}
                disabled={loading}
                className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                ❓ I&apos;m stuck on one part
              </button>
              {dynamicFollowUps.length > 0 && (
                <div className="mt-1 flex w-full flex-wrap gap-2 border-t border-slate-200 pt-2">
                  {dynamicFollowUps.map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => sendMessage(q)}
                      disabled={loading}
                      className="rounded-full border border-brand-ink-light bg-white px-3 py-1.5 text-xs text-brand-ink hover:bg-brand-paper disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : awaitingConceptAdvance ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {onAdvanceConcept && (
                <button
                  type="button"
                  onClick={handleAdvanceConcept}
                  disabled={loading}
                  className="rounded-full bg-green-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  ➡️ Next part
                </button>
              )}
              {dynamicFollowUps.length > 0 &&
                dynamicFollowUps.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => sendMessage(q)}
                    disabled={loading}
                    className="rounded-full border border-brand-ink-light bg-white px-3 py-1.5 text-xs text-brand-ink hover:bg-brand-paper disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
            </div>
          ) : inMicroCheck ? (
            <p className="mb-3 text-xs text-slate-400">
              Quick check - take your best shot. Ezy will help you get there if it's not quite right yet.
            </p>
          ) : (
            readyForInput &&
            quickReplies.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {quickReplies.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => sendMessage(q)}
                    disabled={loading}
                    className="rounded-full border border-brand-ink-light bg-white px-3 py-1.5 text-xs text-brand-ink hover:bg-brand-paper disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )
          )}

          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(inputText)}
              disabled={!readyForInput}
              placeholder={
                !readyForInput
                  ? "Ezy is teaching..."
                  : inMicroCheck
                  ? "Type your answer..."
                  : speechInputSupported
                  ? "Type or use the mic..."
                  : "Type your question..."
              }
              // min-w-0: a flex item defaults to min-width:auto, so this input
              // refused to shrink below its intrinsic width and pushed the whole
              // lesson page into a horizontal scroll on a phone (measured 436px of
              // content in a 375px viewport, 2026-08-30). flex-1 alone does not fix
              // that - the row is the widest thing on the page without this.
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-50"
            />
            <button
              type="button"
              onClick={listening ? stopListening : startListening}
              disabled={!readyForInput || !speechInputSupported}
              aria-pressed={listening}
              aria-label={
                speechInputSupported
                  ? listening
                    ? "Stop listening"
                    : "Start voice question"
                  : "Voice input isn't available in this browser"
              }
              title={speechInputSupported ? undefined : "Voice input isn't available in this browser - try Chrome or Safari"}
              className={`rounded-xl px-3 py-2 text-sm disabled:opacity-40 ${
                listening ? "bg-red-500 text-white" : "border border-slate-300 bg-white"
              }`}
            >
              🎤
            </button>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                localStorage.setItem(LANGUAGE_KEY, e.target.value);
              }}
              disabled={!readyForInput}
              aria-label="Language"
              title="Language - for voice input, and for answers to your own questions (the lesson itself stays in English)"
              className="rounded-xl border border-slate-300 bg-white px-1 text-xs text-slate-600 disabled:opacity-40"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => sendMessage(inputText)}
              disabled={!readyForInput || loading}
              className="rounded-xl bg-practice-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-500">
                <input type="checkbox" checked={readAloud} onChange={(e) => setReadAloud(e.target.checked)} />
                Read aloud
              </label>
              <button
                type="button"
                onClick={() => setShowVoicePicker((prev) => !prev)}
                className="text-xs font-medium text-brand-ink hover:underline"
              >
                🔊 Choose voice
              </button>
            </div>
            {speaking && (
              <button
                type="button"
                onClick={togglePauseSpeech}
                className="flex items-center gap-1 text-xs font-medium text-brand-gold hover:underline"
              >
                {speechPaused ? (
                  <>▶ resume reading</>
                ) : (
                  <>
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-gold" /> reading... (tap to
                    pause)
                  </>
                )}
              </button>
            )}
          </div>

          {preparingSpeech && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-gold" aria-hidden="true" />
              Getting the {LANGUAGES.find((l) => l.code === language)?.label ?? ""} audio ready - the text above is
              already correct, sound is just a moment behind...
            </p>
          )}

          {noVoiceForLanguage && (
            <p className="mt-1 text-xs text-amber-600">
              Couldn&apos;t read this one aloud in {LANGUAGES.find((l) => l.code === language)?.label ?? "this language"}{" "}
              right now - the text above is still correct.
            </p>
          )}

          {showVoicePicker && (
            <div className="mt-2">
              <VoicePicker onClose={() => setShowVoicePicker(false)} />
            </div>
          )}

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
