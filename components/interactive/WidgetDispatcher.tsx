"use client";

import React from 'react';
import { FactOpinionScale } from './FactOpinionScale';
import { SentenceTrainBuilder } from './SentenceTrainBuilder';
import { ClueDetective } from './ClueDetective';
import { getWidgetForConcept } from '@/lib/interactiveWidgets';

interface WidgetDispatcherProps {
  conceptId: string;
  conceptTested?: string;
  unitKey?: string;
  statement?: string;
  isCorrect?: boolean | null;
  currentSelection?: 'fact' | 'opinion' | null;
  onSelect?: (val: any) => void;
  onSuccess?: () => void;
  onAttempt?: (correct: boolean) => void;
}

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
  const id = conceptId || conceptTested || '';
  const widget = getWidgetForConcept(id);

  if (!widget) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-[#16241f]/40">
        <span className="text-4xl mb-2">🦘</span>
        <p className="text-xs font-bold">Ezy is preparing this lesson...</p>
      </div>
    );
  }

  switch (widget.spec.kind) {
    case 'fact_opinion': {
      const spec = widget.spec;
      return (
        <div className="w-full h-full p-2 flex items-center justify-center animate-fade-in">
          <FactOpinionScale
            statement={spec.statements[0]?.text || statement}
            currentSelection={currentSelection}
            isCorrect={isCorrect}
            onSelect={(classification) => {
              if (onSelect) onSelect(classification);
              const correct = classification === spec.statements[0]?.answer.toLowerCase();
              if (onAttempt) onAttempt(correct);
              if (correct && onSuccess) setTimeout(onSuccess, 1800);
            }}
          />
        </div>
      );
    }

    case 'sentence_train':
      return (
        <div className="w-full h-full p-2 flex items-center justify-center animate-fade-in">
          <SentenceTrainBuilder
            onAttempt={onAttempt}
            onSuccess={onSuccess}
          />
        </div>
      );

    case 'clue_detective': {
      const spec = widget.spec;
      return (
        <div className="w-full h-full p-2 flex items-center justify-center animate-fade-in">
          <ClueDetective
            sentence={spec.sentence}
            clues={spec.clues}
            onAttempt={onAttempt}
            onSuccess={onSuccess}
          />
        </div>
      );
    }

    // TODO: Add cases for other widget kinds as components are built:
    // case 'biography_scanner': return <BiographyScanner ... />;
    // case 'life_mountain': return <LifeMountain ... />;
    // case 'prefix_machine': return <PrefixMachine ... />;
    // case 'trait_matcher': return <TraitMatcher ... />;
    // case 'predictive_brancher': return <PredictiveBrancher ... />;
    // case 'idiom_connector': return <IdiomConnector ... />;

    default:
      return (
        <div className="flex flex-col items-center justify-center p-8 text-[#16241f]/40">
          <span className="text-4xl mb-2">🚧</span>
          <p className="text-xs font-bold">Widget "{widget.spec.kind}" coming soon!</p>
        </div>
      );
  }
};

export default WidgetDispatcher;
