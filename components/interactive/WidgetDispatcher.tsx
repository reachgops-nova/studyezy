"use client";

import React from 'react';
import { FactOpinionScale } from './FactOpinionScale';
import { SentenceTrainBuilder } from './SentenceTrainBuilder';
import { ClueDetective } from './ClueDetective';
import { TraitMatcher } from './TraitMatcher';
import { PredictiveBrancher } from './PredictiveBrancher';
import { IdiomConnector } from './IdiomConnector';
import { BiographyScanner } from './BiographyScanner';
import { LifeMountain } from './LifeMountain';
import { PrefixMachine } from './PrefixMachine';
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

    case 'trait_matcher': {
      const spec = widget.spec;
      return (
        <div className="w-full h-full p-2 flex items-center justify-center animate-fade-in">
          <TraitMatcher instruction={widget.instruction} pairs={spec.pairs} onAttempt={onAttempt} onSuccess={onSuccess} />
        </div>
      );
    }

    case 'predictive_brancher': {
      const spec = widget.spec;
      return (
        <div className="w-full h-full p-2 flex items-center justify-center animate-fade-in">
          <PredictiveBrancher
            instruction={widget.instruction}
            scenario={spec.scenario}
            choices={spec.choices}
            onAttempt={onAttempt}
            onSuccess={onSuccess}
          />
        </div>
      );
    }

    case 'idiom_connector': {
      const spec = widget.spec;
      return (
        <div className="w-full h-full p-2 flex items-center justify-center animate-fade-in">
          <IdiomConnector instruction={widget.instruction} items={spec.items} onAttempt={onAttempt} onSuccess={onSuccess} />
        </div>
      );
    }

    case 'biography_scanner': {
      const spec = widget.spec;
      return (
        <div className="w-full h-full p-2 flex items-center justify-center animate-fade-in">
          <BiographyScanner
            instruction={widget.instruction}
            passage={spec.passage}
            onAttempt={onAttempt}
            onSuccess={onSuccess}
          />
        </div>
      );
    }

    case 'life_mountain': {
      const spec = widget.spec;
      return (
        <div className="w-full h-full p-2 flex items-center justify-center animate-fade-in">
          <LifeMountain
            instruction={widget.instruction}
            checkpoints={spec.checkpoints}
            ezyOnComplete={spec.ezyOnComplete}
            onAttempt={onAttempt}
            onSuccess={onSuccess}
          />
        </div>
      );
    }

    case 'prefix_machine': {
      const spec = widget.spec;
      return (
        <div className="w-full h-full p-2 flex items-center justify-center animate-fade-in">
          <PrefixMachine
            instruction={widget.instruction}
            prefixes={spec.prefixes}
            challenges={spec.challenges}
            ezyRemedial={spec.ezyRemedial}
            onAttempt={onAttempt}
            onSuccess={onSuccess}
          />
        </div>
      );
    }

    default:
      // All 9 WidgetSpec kinds are handled above - this only fires if a new
      // kind is added to the union without a matching case here.
      return (
        <div className="flex flex-col items-center justify-center p-8 text-[#16241f]/40">
          <span className="text-4xl mb-2">🚧</span>
          <p className="text-xs font-bold">This widget is coming soon!</p>
        </div>
      );
  }
};

export default WidgetDispatcher;
