import React from 'react';
import { FactOpinionScale } from './FactOpinionScale';
import { SentenceTrainBuilder } from './SentenceTrainBuilder';

interface WidgetDispatcherProps {
  conceptId: string; // e.g., "1.2", "1.7", "1.9"
  conceptTested?: string; // Optional! (UnitView.tsx does not pass this in some calls)
  unitKey?: string; // Optional! (UnitView.tsx passes this on line 278)
  statement?: string;
  isCorrect?: boolean | null;
  currentSelection?: 'fact' | 'opinion' | null;
  onSelect?: (val: any) => void;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
}

/**
 * StudyEzy Phase 1 Master Interactive Widget Dispatcher (v4)
 * Solves all Next.js / TypeScript build errors in UnitView.tsx
 * Supports both named and default imports to prevent TS2613 errors.
 */
export const WidgetDispatcher: React.FC<WidgetDispatcherProps> = ({
  conceptId,
  conceptTested,
  unitKey,
  statement = "The sun rises early in the morning",
  isCorrect = null,
  currentSelection = null,
  onSelect,
  onSuccess,
  onAttempt,
}) => {
  const id = conceptId || conceptTested;

  switch (id) {
    // 1.7: Fact vs. Opinion (Textbook Page 10)
    case '1.7':
    case 'fact-vs-opinion':
    case 'concept-1-7':
      return (
        <div className="w-full h-full p-2 flex items-center justify-center animate-fade-in">
          <FactOpinionScale
            statement={statement}
            currentSelection={currentSelection}
            isCorrect={isCorrect}
            onSelect={(classification) => {
              if (onSelect) onSelect(classification);
              const correct = (classification === 'fact' && (statement.includes("rising") || statement.includes("rises") || statement.includes("gone out") || statement.includes("didn't have a care")));
              if (onAttempt) onAttempt(correct);
              if (correct && onSuccess) {
                setTimeout(onSuccess, 2000);
              }
            }}
          />
        </div>
      );

    // 1.9: Sentence Types & Connectors (Textbook Page 15 - The Sentence Train)
    case '1.9':
    case 'sentence-connectors':
    case 'concept-1-9':
      return (
        <div className="w-full h-full p-2 flex items-center justify-center animate-fade-in">
          <SentenceTrainBuilder
            onAttempt={onAttempt}
            onSuccess={onSuccess}
          />
        </div>
      );

    default:
      return null;
  }
};

// Export as default fallback to prevent TS2613 UnitView import errors
export default WidgetDispatcher;
