import type { InkOp, InkAxes } from "./types";

// The one shared interpreter every ink-board scene is drawn through - see
// types.ts's module comment for why this exists (replacing per-topic canvas
// code with per-topic data). Font stays the same hand-written look
// TeacherWritingSample established ("Comic Sans MS"/"Bradley Hand"), so a
// new topic's board still looks like the same teacher's handwriting.
const HAND_FONT = `"Comic Sans MS", "Bradley Hand", cursive`;

function setTextStyle(ctx: CanvasRenderingContext2D, color: string, size: number) {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.font = `700 ${size}px ${HAND_FONT}`;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
}

function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, width: number, dashed = false) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dashed ? [8, 6] : []);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
  drawLine(ctx, x1, y1, x2, y2, color, 5);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 16;
  drawLine(ctx, x2, y2, x2 - headLen * Math.cos(angle - Math.PI / 7), y2 - headLen * Math.sin(angle - Math.PI / 7), color, 5);
  drawLine(ctx, x2, y2, x2 - headLen * Math.cos(angle + Math.PI / 7), y2 - headLen * Math.sin(angle + Math.PI / 7), color, 5);
}

function drawBox(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, label?: string, labelSize = 18) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 10);
  ctx.stroke();
  if (label) {
    setTextStyle(ctx, color, labelSize);
    ctx.fillText(label, x + 14, y + labelSize + 10);
  }
}

function drawSet(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, color: string, title: string, members: string[]) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  setTextStyle(ctx, color, 24);
  ctx.textAlign = "center";
  ctx.fillText(title, cx, cy - ry - 14);
  const lineHeight = Math.min(34, (ry * 1.6) / Math.max(members.length, 1));
  const startY = cy - ((members.length - 1) * lineHeight) / 2;
  members.forEach((m, i) => {
    const my = startY + i * lineHeight;
    ctx.beginPath();
    ctx.arc(cx, my, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    setTextStyle(ctx, color, 20);
    ctx.textAlign = "left";
    ctx.fillText(m, cx + 14, my + 7);
  });
  ctx.textAlign = "left";
}

function drawAxes(ctx: CanvasRenderingContext2D, op: InkAxes) {
  const color = op.color ?? "#475569";
  const { x, y, width, height, xRange, yRange } = op;
  drawLine(ctx, x, y + height, x + width, y + height, color, 3);
  drawLine(ctx, x, y, x, y + height, color, 3);
  if (op.xLabel) {
    setTextStyle(ctx, color, 18);
    ctx.fillText(op.xLabel, x + width - 20, y + height + 28);
  }
  if (op.yLabel) {
    setTextStyle(ctx, color, 18);
    ctx.fillText(op.yLabel, x - 10, y - 10);
  }
  // A light tick + gridline every whole unit keeps plotted points readable
  // without needing a separate "grid" op.
  for (let v = Math.ceil(xRange.min); v <= Math.floor(xRange.max); v++) {
    const px = x + ((v - xRange.min) / (xRange.max - xRange.min)) * width;
    drawLine(ctx, px, y + height - 5, px, y + height + 5, color, 2);
  }
  for (let v = Math.ceil(yRange.min); v <= Math.floor(yRange.max); v++) {
    const py = y + height - ((v - yRange.min) / (yRange.max - yRange.min)) * height;
    drawLine(ctx, x - 5, py, x + 5, py, color, 2);
  }
}

export function renderOps(ctx: CanvasRenderingContext2D, width: number, height: number, ops: InkOp[]) {
  // Board background + faint ruled lines, same look as the original
  // TeacherWritingSample board.
  ctx.fillStyle = "#fbfdfb";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(68,135,162,.17)";
  ctx.lineWidth = 1;
  for (let ly = 34; ly < height; ly += 40) {
    ctx.beginPath();
    ctx.moveTo(0, ly);
    ctx.lineTo(width, ly);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(235,88,166,.2)";
  ctx.beginPath();
  ctx.moveTo(42, 0);
  ctx.lineTo(42, height);
  ctx.stroke();

  const axesById = new Map<string, InkAxes>();
  for (const op of ops) if (op.type === "axes") axesById.set(op.id, op);

  for (const op of ops) {
    switch (op.type) {
      case "text":
        setTextStyle(ctx, op.color, op.size ?? 32);
        ctx.fillText(op.value, op.x, op.y);
        break;
      case "line":
        drawLine(ctx, op.x1, op.y1, op.x2, op.y2, op.color, op.width ?? 4, op.dashed);
        break;
      case "arrow":
        drawArrow(ctx, op.x1, op.y1, op.x2, op.y2, op.color);
        break;
      case "box":
        drawBox(ctx, op.x, op.y, op.w, op.h, op.color, op.label, op.labelSize);
        break;
      case "set":
        drawSet(ctx, op.cx, op.cy, op.rx, op.ry, op.color, op.title, op.members);
        break;
      case "mapping":
        drawArrow(ctx, op.from.x, op.from.y, op.to.x, op.to.y, op.color);
        break;
      case "axes":
        drawAxes(ctx, op);
        break;
      case "point": {
        const axes = axesById.get(op.axesId);
        if (!axes) break;
        const px = axes.x + ((op.valueX - axes.xRange.min) / (axes.xRange.max - axes.xRange.min)) * axes.width;
        const py = axes.y + axes.height - ((op.valueY - axes.yRange.min) / (axes.yRange.max - axes.yRange.min)) * axes.height;
        ctx.fillStyle = op.color;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
        if (op.label) {
          setTextStyle(ctx, op.color, 18);
          ctx.fillText(op.label, px + 10, py - 8);
        }
        break;
      }
      case "curve": {
        const axes = axesById.get(op.axesId);
        if (!axes || op.points.length < 2) break;
        const toPx = (v: { x: number; y: number }) => ({
          px: axes.x + ((v.x - axes.xRange.min) / (axes.xRange.max - axes.xRange.min)) * axes.width,
          py: axes.y + axes.height - ((v.y - axes.yRange.min) / (axes.yRange.max - axes.yRange.min)) * axes.height,
        });
        ctx.strokeStyle = op.color;
        ctx.lineWidth = op.width ?? 4;
        ctx.beginPath();
        op.points.forEach((v, i) => {
          const { px, py } = toPx(v);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
        break;
      }
    }
  }
}
