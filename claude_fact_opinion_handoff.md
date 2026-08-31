### 🤖 Claude Handoff: Modular Fact vs. Opinion Scale Component Integration

Your structural and architectural feedback is **100% correct and incredibly sharp**. 

Hardcoding separate text content or duplicating the Kangaroo mascot, hint buttons, and header shells would break the clean, unified layout of StudyEzy. The `WidgetShell` should remain the single source of truth for mascot rendering and chrome, while the individual widgets should act as **pure presentational sandboxes** driven by parent state.

To implement this perfectly, I have built a **completely modular, presentational version** of the balance scale widget: **`FactOpinionScale.tsx`**.

---

### 📦 The Modular Component: `FactOpinionScale.tsx`

This component is fully stateless, matching your active design system:
- **Zero Duplicate Chrome:** It renders *only* the tilting scale and the active statement box. It has no mascot, no built-in help bubbles, and no outer headers.
- **Accurate Brand Tokens:** It uses your active color variables—**Forest Ink (`#16241f`)**, **Paper background (`#f4f6f1`)**, and **Gold highlights (`#9c6f1f`)**—avoiding the retired orange palette.
- **Dynamic Physics Animation:** The balance scale SVG automatically tilts smoothly by **-12° (Fact)** or **+12° (Opinion)** based on the selected prop, with matching counter-rotations on the hanging plates to keep them perfectly upright!

#### Props Definition:
```typescript
interface FactOpinionScaleProps {
  statement: string;                          // Sourced dynamically from your lib/interactiveWidgets.ts
  onSelect: (type: 'fact' | 'opinion') => void;// Triggers when student taps selection buttons
  currentSelection?: 'fact' | 'opinion' | null;// Drives the active scale tilt state
  isCorrect?: boolean | null;                  // Drives the bouncy correct/incorrect shaking animation
}
```

---

### 🛠️ How to Instruct Local Claude (Copy-Paste Prompt)

Navigate to your local repository directory at `/Users/gopsair/studyezy` and paste this high-density, token-efficient instruction block directly into your local **Claude** terminal:

```markdown
### SYSTEM INSTRUCTION: INTEGRATE MODULAR FACT_OPINION_SCALE

We have dropped a pure presentational, state-driven balance scale component aligned with our active design tokens (#16241f / #f4f6f1 / #9c6f1f) at:
`components/interactive/FactOpinionScale.tsx`

Your task is to wire this component into our centralized widget structure:

1. UPDATE THE DISPATCHER:
   - Import `FactOpinionScale` from `./components/interactive/FactOpinionScale` inside your `WidgetDispatcher.tsx` or matching controller.
   - Map it to Concept 1.7 (Fact vs. Opinion).

2. DRIVE STATE DYNAMICALLY (NO HARDCODING):
   - Feed the statements dynamically into `FactOpinionScale` from our central data source (`lib/interactiveWidgets.ts` or database context).
   - Let our existing `WidgetShell` handle the mascot, the primary hint button, and feedback bubbles. This prevents double-mascot or double-button rendering.

3. HANDLE CALLBACKS:
   - Bind `onSelect` to update the active session's state and validate the answer.
   - On correct classification, trigger our existing database update paths for `ConceptMastery` and transition the scale smoothly.
```
