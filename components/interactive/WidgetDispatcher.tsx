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
import { DecimalPlaceValuePlayer } from './DecimalPlaceValuePlayer';
import { ComposingDecomposingPlayer } from './ComposingDecomposingPlayer';
import { MultiplyDivideShiftPlayer } from './MultiplyDivideShiftPlayer';
import { NegativeNumberLinePlayer } from './NegativeNumberLinePlayer';
import { LinearSequencePlayer } from './LinearSequencePlayer';
import { getWidgetForConcept, type InteractiveWidget, type TraitMatcherSpec, type PredictiveBrancherSpec } from '@/lib/interactiveWidgets';

// Bespoke, richer widgets for the whole of Unit 1 (Number) - started as a
// pilot for just concept 1.1 ("test this visual appealing graphical session
// along with our chat, in a separate link first", 2026-09-09), then
// extended to 1.2-1.5 ("Rest of Math Unit 1 (recommended)"). Real user
// request 2026-09-09: "please do not use gemini / openroute now.. use
// NotebookLLM for all of these as it generates intuitive images / screens
// and quiz as well" - these four (plus DecimalPlaceValuePlayer for 1.1) were
// generated via NotebookLM's chat (grounded in this unit's real content,
// same house style: phases visual_intro -> demo -> checkpoint_quiz ->
// passed, brand colors, onNarrate reporting the exact on-screen text)
// instead of the generic Gemini/OpenRouter widget-generation pipeline
// (lib/conceptWidgetGeneration.ts), which stays in place for every other
// subject/unit. Checked here (not via the WidgetSpec/getWidgetForConcept
// data path) since these are bespoke multi-phase components, not generic
// spec renderers.
export const DECIMAL_PILOT_UNIT_KEY = 'cambridge-4-math-1';
export const DECIMAL_PILOT_CONCEPT_ID = '1.1';

const UNIT1_PLAYERS: Record<string, React.FC<{ onSuccess?: () => void; onAttempt?: (correct: boolean) => void; onNarrate?: (text: string) => void }>> = {
  '1.1': DecimalPlaceValuePlayer,
  '1.2': ComposingDecomposingPlayer,
  '1.3': MultiplyDivideShiftPlayer,
  '1.4': NegativeNumberLinePlayer,
  '1.5': LinearSequencePlayer,
};

/** Every concept ID with a bespoke Unit1 player - lets UnitView.tsx check membership without duplicating this list. */
export const UNIT1_PLAYER_CONCEPT_IDS = Object.keys(UNIT1_PLAYERS);

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
  /** AI-generated fallback (lib/conceptWidgetGeneration.ts) for a concept with no hand-authored English widget - see lib/interactiveWidgets.ts's subject-scoping comment. */
  generatedWidget?: ((TraitMatcherSpec | PredictiveBrancherSpec) & { instruction?: string }) | null;
  /** Real user request 2026-09-09: Ezy's voice should narrate the widget's own phase transitions, not leave it as a silent island. Only DecimalPlaceValuePlayer reports phases today. */
  onWidgetPhase?: (message: string) => void;
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
  generatedWidget,
  onWidgetPhase,
}) => {
  const id = conceptId || conceptTested || '';

  if (unitKey === DECIMAL_PILOT_UNIT_KEY && UNIT1_PLAYERS[id]) {
    const Player = UNIT1_PLAYERS[id];
    return (
      <div className="w-full h-full p-2 flex items-center justify-center animate-fade-in">
        <Player
          onAttempt={onAttempt}
          onSuccess={onSuccess}
          onNarrate={(text) => onWidgetPhase?.(text)}
        />
      </div>
    );
  }

  const authoredWidget = getWidgetForConcept(id, unitKey);
  const widget: InteractiveWidget | undefined =
    authoredWidget ??
    (generatedWidget
      ? { id: `generated-${id}`, title: generatedWidget.kind, instruction: generatedWidget.instruction ?? '', spec: generatedWidget }
      : undefined);

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
