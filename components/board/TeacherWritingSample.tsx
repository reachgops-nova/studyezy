"use client";

import { useEffect, useRef, useState } from "react";

type Scene = "teach" | "mistake" | "fix" | "next";

export default function TeacherWritingSample() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<Scene>("teach");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const box = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = box.width * ratio;
    canvas.height = box.height * ratio;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    drawBoard(ctx, box.width, box.height, scene);
  }, [scene]);

  function readBoard() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const text = scene === "teach" ? "We share twenty eight stars into four equal groups. Each group gets seven." : scene === "mistake" ? "You wrote six. Let us check your answer before moving on." : scene === "fix" ? "This exact question is repaired by working backwards. Thirty five divided by five is seven. Then seven times five equals thirty five." : "Now use the same method on a fresh question: question mark times three equals twenty four.";
    window.speechSynthesis.cancel();
    const voice = new SpeechSynthesisUtterance(text);
    voice.rate = 0.65;
    window.speechSynthesis.speak(voice);
  }

  return <main className="min-h-screen bg-[#20242b] p-2 sm:p-6"><section className="mx-auto max-w-[1500px] overflow-hidden rounded-xl border-[10px] border-[#343943] bg-[#f5f8f5] shadow-2xl"><header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-300 bg-white px-4 py-3 sm:px-8"><div><p className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-indigo-700">StudyEzy · Unit 15.1 · ink board</p><h1 className="hand text-2xl text-slate-800 sm:text-4xl">The teacher’s board</h1></div><button type="button" onClick={readBoard} className="rounded-lg bg-indigo-700 px-4 py-3 text-sm font-black text-white">🔊 Read this board</button></header><div className="relative bg-[#fbfdfb] p-2 sm:p-5"><canvas ref={canvasRef} className="h-[680px] w-full rounded-lg" /><div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 gap-1 rounded-full border-2 border-slate-400 bg-white/95 p-1 shadow-lg">{(["teach", "mistake", "fix", "next"] as Scene[]).map((item) => <button key={item} type="button" onClick={() => setScene(item)} className={`rounded-full px-3 py-2 text-xs font-black uppercase ${scene === item ? "bg-indigo-700 text-white" : "text-slate-600"}`}>{item}</button>)}</div></div></section><style jsx>{`.hand{font-family:'Comic Sans MS','Bradley Hand',cursive;font-weight:700}`}</style></main>;
}

function drawBoard(ctx: CanvasRenderingContext2D, width: number, height: number, scene: Scene) {
  ctx.fillStyle = "#fbfdfb"; ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(68,135,162,.17)"; ctx.lineWidth = 1;
  for (let y = 34; y < height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
  ctx.strokeStyle = "rgba(235,88,166,.2)"; ctx.beginPath(); ctx.moveTo(42, 0); ctx.lineTo(42, height); ctx.stroke();
  const ink = (color: string, size = 42) => { ctx.fillStyle = color; ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.font = `700 ${size}px "Comic Sans MS", "Bradley Hand", cursive`; ctx.lineCap = "round"; ctx.lineJoin = "round"; };
  const text = (value: string, x: number, y: number, color: string, size = 42) => { ink(color, size); ctx.fillText(value, x, y); };
  const line = (x1: number, y1: number, x2: number, y2: number, color: string, width = 5) => { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  const arrow = (x1: number, y1: number, x2: number, y2: number, color: string) => { line(x1, y1, x2, y2, color, 5); line(x2, y2, x2 - 16, y2 - 12, color, 5); line(x2, y2, x2 - 12, y2 + 16, color, 5); };
  const star = (cx: number, cy: number, color = "#f2b928") => { ctx.fillStyle = color; ctx.strokeStyle = "#d88900"; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 7 : 16; const a = -Math.PI / 2 + i * Math.PI / 5; const x = cx + Math.cos(a) * r; const y = cy + Math.sin(a) * r; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); ctx.fill(); ctx.stroke(); };
  const box = (x: number, y: number, label: string) => { ctx.strokeStyle = "#39247f"; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(x, y, 170, 150, 12); ctx.stroke(); text(label, x + 45, y + 30, "#39247f", 18); };

  if (scene === "teach") {
    text("We have 28 stars", 70, 70, "#df4da8", 38);
    for (let i = 0; i < 28; i++) star(90 + (i % 14) * 34, 110 + Math.floor(i / 14) * 34);
    text("share them into 4 equal groups", 580, 85, "#df4da8", 27);
    [0, 1, 2, 3].forEach((i) => { box(70 + i * 200, 230, `BOX ${i + 1}`); for (let j = 0; j < 7; j++) star(105 + i * 200 + (j % 4) * 34, 295 + Math.floor(j / 4) * 38); });
    arrow(275, 435, 720, 435, "#188e69"); text("7 × 4 = 28", 370, 505, "#188e69", 55); text("seven in every box", 720, 505, "#188e69", 25);
  }
  if (scene === "mistake") {
    text("Your turn", 75, 75, "#df4da8", 38); text("? × 5 = 35", 80, 180, "#39247f", 68); line(75, 205, 505, 205, "#39247f", 4); text("student writes", 80, 295, "#64748b", 28); text("6", 105, 430, "#39247f", 125); text("✕", 255, 425, "#dc2626", 100); text("Stop. Let us check this exact question.", 400, 350, "#dc2626", 30); arrow(515, 380, 720, 430, "#dc2626");
  }
  if (scene === "fix") {
    text("We use your numbers again", 70, 70, "#df4da8", 35); text("? × 5 = 35", 70, 155, "#39247f", 62); text("your answer: 6", 570, 150, "#dc2626", 29); arrow(280, 190, 280, 275, "#df4da8"); text("work backwards", 315, 245, "#df4da8", 28); text("35 ÷ 5 = 7", 90, 355, "#df4da8", 60); arrow(510, 375, 725, 375, "#188e69"); text("check", 590, 330, "#188e69", 27); text("7 × 5 = 35 ✓", 735, 390, "#188e69", 52); text("same question · same numbers · clear method", 250, 515, "#475569", 25);
  }
  if (scene === "next") {
    text("Now try a fresh one", 75, 75, "#df4da8", 38); text("? × 3 = 24", 80, 190, "#39247f", 68); text("your working", 85, 285, "#64748b", 28); line(85, 350, width - 90, 350, "#94a3b8", 3); line(85, 450, width - 90, 450, "#94a3b8", 3); text("work backwards → check by multiplying", 275, 540, "#df4da8", 28);
  }
}
