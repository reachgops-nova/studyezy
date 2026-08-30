# StudyEzy Solution Architecture: Server-Side TTS, SVG Geometry, and Offline Compilation Fallbacks

This architectural document provides copy-pasteable code, designs, and files to solve the critical gaps in the StudyEzy platform: local browser TTS unreliability for regional languages, vision API credit bottlenecks, and live geometry rendering.

---

## 1. Server-Side TTS Engine (`/api/tts/route.ts`)

To avoid dependency on inconsistent browser-native voices, we can use a server-side Text-to-Speech service. Below is a highly reliable implementation for Next.js that leverages a lightweight translation-synthesis endpoint (or Google Cloud TTS) to return an MP3 audio buffer directly to an HTML5 `<audio>` player.

Create this file at `app/api/tts/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

// Map your supported language codes to standard speech synthesizer locales
const LANGUAGE_LOCALE_MAP: Record<string, string> = {
  english: 'en-US',
  hindi: 'hi-IN',
  tamil: 'ta-IN',
  telugu: 'te-IN',
  kannada: 'kn-IN',
  malayalam: 'ml-IN',
  french: 'fr-FR',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  const language = searchParams.get('language') || 'english';

  if (!text) {
    return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
  }

  const locale = LANGUAGE_LOCALE_MAP[language.toLowerCase()] || 'en-US';

  try {
    // Generate Google TTS URL (supports up to 200 characters per chunk safely)
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${locale}&client=tw-ob&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch audio stream from TTS provider');
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Server-side TTS error:', error);
    return NextResponse.json({ error: 'Failed to synthesize speech server-side' }, { status: 500 });
  }
}
```

### Client-Side Integration in `AvatarChat.tsx` or Speech Components:
Replace browser-native `window.speechSynthesis` with this clean audio playback helper:

```typescript
const speakTextServerSide = (text: string, language: string) => {
  // Stop any currently playing audio instance
  if (globalAudioInstance) {
    globalAudioInstance.pause();
  }

  const audioUrl = `/api/tts?text=${encodeURIComponent(text)}&language=${encodeURIComponent(language)}`;
  const audio = new Audio(audioUrl);
  globalAudioInstance = audio;
  audio.play().catch((err) => console.error("Playback failed:", err));
};
```

---

## 2. Dynamic SVG Interactive Geometry & Graphing

To explain coordinate planes, grids, and geometry (e.g., math problems involving fractions, angles, or shape classifications) live, you can drop this reusable SVG React Component into your chat UI or lesson checkpoints.

```tsx
import React, { useState } from 'react';

interface CoordinateGridProps {
  interactive?: boolean;
}

export const InteractiveCoordinateGrid: React.FC<CoordinateGridProps> = ({ interactive = true }) => {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([
    { x: 2, y: 3 },
    { x: -3, y: 1 },
    { x: -1, y: -2 },
  ]);

  const gridToSvg = (val: number, isY = false) => {
    const center = 150;
    const spacing = 25; // 25px per unit
    return isY ? center - val * spacing : center + val * spacing;
  };

  const svgToGrid = (coord: number, isY = false) => {
    const center = 150;
    const spacing = 25;
    const rawVal = isY ? (center - coord) / spacing : (coord - center) / spacing;
    return Math.round(rawVal);
  };

  const handleGridClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = e.clientX - rect.left;
    const svgY = e.clientY - rect.top;
    
    const gridX = svgToGrid(svgX, false);
    const gridY = svgToGrid(svgY, true);

    if (Math.abs(gridX) <= 5 && Math.abs(gridY) <= 5) {
      setPoints([...points, { x: gridX, y: gridY }]);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-warm-cream rounded-xl shadow-sm border border-orange-100 max-w-sm mx-auto">
      <h4 className="text-sm font-bold text-brand-navy mb-2">Interactive 2D Cartesian Coordinate Grid</h4>
      <p className="text-xs text-slate-500 mb-3 text-center">Tap anywhere on the grid to plot integers (X, Y)</p>
      
      <svg 
        width="300" 
        height="300" 
        className="bg-white rounded-lg border border-slate-200 cursor-crosshair shadow-inner"
        onClick={handleGridClick}
      >
        {/* Draw Grid Lines */}
        {Array.from({ length: 11 }).map((_, i) => {
          const val = (i - 5) * 25 + 150;
          return (
            <React.Fragment key={i}>
              <line x1={val} y1="0" x2={val} y2="300" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1={val} x2="300" y2={val} stroke="#f1f5f9" strokeWidth="1" />
            </React.Fragment>
          );
        })}

        {/* Draw Axes */}
        <line x1="150" y1="0" x2="150" y2="300" stroke="#94a3b8" strokeWidth="2" />
        <line x1="0" y1="150" x2="300" y2="150" stroke="#94a3b8" strokeWidth="2" />

        {/* Draw Polygon joining the points */}
        {points.length >= 3 && (
          <polygon
            points={points.map(p => `${gridToSvg(p.x, false)},${gridToSvg(p.y, true)}`).join(' ')}
            fill="rgba(249, 115, 22, 0.15)"
            stroke="#f97316"
            strokeWidth="2"
            strokeDasharray="4"
          />
        )}

        {/* Draw Plotted Points */}
        {points.map((pt, idx) => (
          <g key={idx}>
            <circle
              cx={gridToSvg(pt.x, false)}
              cy={gridToSvg(pt.y, true)}
              r="6"
              className="fill-brand-orange stroke-white stroke-2 drop-shadow-sm"
            />
            <text
              x={gridToSvg(pt.x, false) + 8}
              y={gridToSvg(pt.y, true) - 8}
              fontSize="10"
              fontWeight="bold"
              className="fill-brand-navy font-sans"
            >
              ({pt.x}, {pt.y})
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-3 flex flex-wrap gap-1 justify-center">
        {points.map((pt, idx) => (
          <span key={idx} className="bg-orange-50 text-orange-700 text-[10px] px-2 py-1 rounded-md border border-orange-100 font-mono">
            P{idx + 1}({pt.x}, {pt.y})
          </span>
        ))}
        {points.length > 0 && (
          <button 
            onClick={() => setPoints([])} 
            className="text-[10px] text-slate-500 hover:text-red-500 underline ml-2 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
```

---

## 3. Parent-Assist Vision Fallback UI (Credit-Free Mode)

When your Claude API runs out of credit, the page extraction pipeline and handwritten exam grader block. To preserve complete platform functionality, we can implement an intuitive, toggleable admin fallback panel. Instead of failing with a "Credits Empty" error, it allows parents or admins to paste the direct text or mark scheme manually.

Modify `/app/learn/[unitId]/page.tsx` or `/app/manage/page.tsx` to include this clean interface toggle:

```tsx
import React, { useState } from 'react';

export const VisionFallbackEditor = ({ unitId, onExtractSuccess }: { unitId: string, onExtractSuccess: () => void }) => {
  const [manualText, setManualText] = useState('');
  const [conceptTitle, setConceptTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Direct write bypasses the vision extraction pipeline
      const res = await fetch('/api/concepts/manual-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId,
          title: conceptTitle,
          textSource: manualText,
        }),
      });

      if (res.ok) {
        setManualText('');
        setConceptTitle('');
        onExtractSuccess();
        alert('Lesson concept successfully added manually without calling AI Vision API!');
      } else {
        alert('Failed to save concept.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 my-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🛠️</span>
        <h3 className="font-bold text-orange-800 text-sm">Vision API Fallback — Parent/Admin Manual Content Builder</h3>
      </div>
      <p className="text-xs text-orange-700 mb-4">
        Claude Vision is currently offline or credits are low. You can copy/paste or type the textbook page content manually below. 
        Our system will instantly format it into an original, curriculum-aware lesson plan.
      </p>

      <form onSubmit={handleManualSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Concept Title</label>
          <input
            type="text"
            required
            value={conceptTitle}
            onChange={(e) => setConceptTitle(e.target.value)}
            placeholder="e.g. 1.4 Dynamic Storytelling & Metaphors"
            className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Textbook Text or Topic Details</label>
          <textarea
            required
            rows={5}
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Paste raw textbook text, notes, or lists here..."
            className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 font-sans"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-xs transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Creating Lesson and Seeding Database...' : 'Save Concept & Push Live'}
        </button>
      </form>
    </div>
  );
};
```
