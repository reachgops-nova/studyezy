import React, { useRef, useState } from 'react';

interface Checkpoint {
  /** Seconds into the video - ESTIMATED, evenly spaced against the video's
   * own known content beats (intro -> Example 1 -> reassembly/place-value
   * chart -> Example 2 -> wrap-up). Not yet verified against the actual
   * rendered video, since video can't be watched programmatically - a real
   * watch-through should correct these to the actual scene boundaries. */
  at: number;
  prompt: string;
}

// Real feedback 2026-09-09: "there is no connection between the chat window
// and this video... it has to be interactive. based on the video slides we
// can pause and get response through chat... if the chat can explain things
// better or re-go the video again to previous or from start." This replaces
// the plain <video> element with a real pause-and-check-in player: the
// video stops at each checkpoint, the student can continue, ask Ezy a real
// question (routed through the existing /api/ask endpoint - same grounded
// answer pipeline as the voice chat), rewatch just that section, or restart
// the whole video from the beginning.
const CHECKPOINTS: Checkpoint[] = [
  { at: 70, prompt: "So far: a whole splits into 10 equal tenths - 1/10 written as 0.1. Does that make sense?" },
  { at: 160, prompt: "That was Example 1 - a 1-metre rod split into 10 pieces, each 0.1 metres. Following okay?" },
  { at: 260, prompt: "That's the place-value chart - ones on the left, tenths on the right of the decimal point. All good so far?" },
  { at: 340, prompt: "That was Example 2 - 2.6 as 2 whole units and 6 tenths. Make sense?" },
];

type Mode = 'playing' | 'checkpoint' | 'asking' | 'answered';

interface DecimalVideoCheckpointPlayerProps {
  unitKey: string;
  conceptId: string;
  onComplete?: () => void;
}

export const DecimalVideoCheckpointPlayer: React.FC<DecimalVideoCheckpointPlayerProps> = ({
  unitKey,
  conceptId,
  onComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<Mode>('playing');
  const [checkpointIdx, setCheckpointIdx] = useState(-1);
  const firedRef = useRef<Set<number>>(new Set());
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || mode !== 'playing') return;
    for (let i = 0; i < CHECKPOINTS.length; i++) {
      if (!firedRef.current.has(i) && video.currentTime >= CHECKPOINTS[i].at) {
        firedRef.current.add(i);
        video.pause();
        setCheckpointIdx(i);
        setMode('checkpoint');
        break;
      }
    }
  };

  const resume = () => {
    setMode('playing');
    videoRef.current?.play();
  };

  const watchAgain = () => {
    const video = videoRef.current;
    if (!video) return;
    const from = checkpointIdx > 0 ? CHECKPOINTS[checkpointIdx - 1].at : 0;
    // Clear every checkpoint at or after the rewind point so it can re-fire.
    for (const i of Array.from(firedRef.current)) {
      if (CHECKPOINTS[i].at >= from) firedRef.current.delete(i);
    }
    video.currentTime = from;
    setMode('playing');
    video.play();
  };

  const startOver = () => {
    const video = videoRef.current;
    if (!video) return;
    firedRef.current.clear();
    video.currentTime = 0;
    setMode('playing');
    setAnswer(null);
    video.play();
  };

  const askEzy = async () => {
    if (!question.trim()) return;
    setAsking(true);
    setAskError(null);
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitKey, conceptId, question: question.trim(), language: 'English' }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Couldn't get an answer - please try again.");
      }
      const data = (await res.json()) as { answer: string };
      setAnswer(data.answer);
      setMode('answered');
    } catch (e) {
      setAskError(e instanceof Error ? e.message : "Couldn't get an answer - please try again.");
    } finally {
      setAsking(false);
    }
  };

  const currentPrompt = checkpointIdx >= 0 ? CHECKPOINTS[checkpointIdx].prompt : '';

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
      <p className="mb-2 font-medium text-slate-800">🎬 Watch this first: Understanding Tenths and Decimals</p>

      <video
        ref={videoRef}
        controls
        autoPlay
        className="w-full rounded-xl bg-black"
        src="/api/concept-videos/cmtsrk34b0001ow58qrj23lm0.mp4"
        onTimeUpdate={handleTimeUpdate}
        onEnded={onComplete}
      />

      {mode !== 'playing' && (
        <div className="mt-3 rounded-xl border border-brand-gold/20 bg-brand-gold-bright/10 p-3">
          {(mode === 'checkpoint' || mode === 'asking') && (
            <>
              <p className="text-sm font-medium text-slate-800">⏸ {currentPrompt}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={resume}
                  className="rounded-full bg-brand-ink px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-ink/90"
                >
                  👍 Got it, keep going
                </button>
                <button
                  type="button"
                  onClick={watchAgain}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  🔁 Watch that part again
                </button>
                <button
                  type="button"
                  onClick={startOver}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  ⏮ Start over
                </button>
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && askEzy()}
                  placeholder="Or ask Ezy a question about this..."
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  disabled={asking}
                />
                <button
                  type="button"
                  onClick={askEzy}
                  disabled={asking || !question.trim()}
                  className="rounded-lg bg-brand-gold px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                >
                  {asking ? '...' : 'Ask'}
                </button>
              </div>
              {askError && <p className="mt-1 text-xs text-red-600">{askError}</p>}
            </>
          )}

          {mode === 'answered' && (
            <>
              <p className="text-sm text-slate-800">🦘 {answer}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setQuestion('');
                    setAnswer(null);
                    resume();
                  }}
                  className="rounded-full bg-brand-ink px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-ink/90"
                >
                  Thanks, keep going →
                </button>
                <button
                  type="button"
                  onClick={watchAgain}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  🔁 Watch that part again
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DecimalVideoCheckpointPlayer;
