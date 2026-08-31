import React from 'react';
import { FactOpinionScale } from './FactOpinionScale';
import { SentenceTrainBuilder } from './SentenceTrainBuilder';

interface WidgetDispatcherProps {
  conceptId: string; // e.g., "1.2", "1.7", "1.9", "4.1"
  conceptTested: string; // Slug coordinate or name
  statement?: string; // Sourced dynamically from database/lib/interactiveWidgets.ts
  isCorrect?: boolean | null;
  currentSelection?: 'fact' | 'opinion' | null;
  onSelect?: (val: any) => void;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
}

/**
 * StudyEzy Visual Widget Dispatcher
 * This is the master presentational bridge that renders gorgeous, animated cartoon-style 
 * playgrounds right inside the lesson view without cluttering global state.
 */
export const WidgetDispatcher: React.FC<WidgetDispatcherProps> = ({
  conceptId,
  conceptTested,
  statement = "The sun rises early in the morning",
  isCorrect = null,
  currentSelection = null,
  onSelect,
  onSuccess,
  onAttempt,
}) => {
  // Normalize the identifier to ensure accurate matching with real database rows
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
              const correct = (classification === 'fact' && statement.includes("rising") || statement.includes("rises") || statement.includes("gone out") || statement.includes("didn't have a care"));
              if (onAttempt) onAttempt(correct);
              if (correct && onSuccess) {
                setTimeout(onSuccess, 1800);
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

    // Fallback: If no interactive game matches, keep the chat flowing cleanly
    default:
      return null;
  }
};
