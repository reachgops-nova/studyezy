import React from 'react';
import { FactOpinionScale } from './FactOpinionScale';
import { SentenceTrainBuilder } from './SentenceTrainBuilder';

interface WidgetDispatcherProps {
  conceptId: string; // e.g., "1.2", "1.7", "1.9"
  conceptTested?: string; // Optional code coordinate
  unitKey?: string; // Optional unit key passed from parent container
  statement?: string;
  isCorrect?: boolean | null;
  currentSelection?: 'fact' | 'opinion' | null;
  onSelect?: (val: any) => void;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
}

/**
 * StudyEzy Phase 1 Master Interactive Widget Dispatcher (v3)
 * Renders the visually gorgeous, animated cartoon platforms inside lesson chats.
 * Supports default fallback to work seamlessly with both named and default imports.
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

    // 1.9: Sentence Types & Connectors (Textbook Page 15)
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

export default WidgetDispatcher;
