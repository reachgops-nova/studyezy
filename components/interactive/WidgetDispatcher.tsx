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
import { SymmetryPatternPlayer } from './SymmetryPatternPlayer';
import { AngleLinePlayer } from './AngleLinePlayer';
import { TriangleClassifyPlayer } from './TriangleClassifyPlayer';
import { NegativeCalcPlayer } from './NegativeCalcPlayer';
import { MentalMathPlayer } from './MentalMathPlayer';
import { EquationSolvePlayer } from './EquationSolvePlayer';
import { MentalMultiplyPlayer } from './MentalMultiplyPlayer';
import { PartialProductsPlayer } from './PartialProductsPlayer';
import { TimeDecimalPlayer } from './TimeDecimalPlayer';
import { TimeIntervalPlayer } from './TimeIntervalPlayer';
import { BarDotChartPlayer } from './BarDotChartPlayer';
import { FrequencyChartPlayer } from './FrequencyChartPlayer';
import { LineGraphPlayer } from './LineGraphPlayer';
import { FractionDivisionPlayer } from './FractionDivisionPlayer';
import { EquivalentFractionsPlayer } from './EquivalentFractionsPlayer';
import { MixedNumbersPlayer } from './MixedNumbersPlayer';
import { FractionOfQuantityPlayer } from './FractionOfQuantityPlayer';
import { RelatedFractionsPlayer } from './RelatedFractionsPlayer';
import { TenthsHundredthsPlayer } from './TenthsHundredthsPlayer';
import { DecomposeRegroupPlayer } from './DecomposeRegroupPlayer';
import { RoundingDecimalsPlayer } from './RoundingDecimalsPlayer';
import { ScalingDecimalsPlayer } from './ScalingDecimalsPlayer';
import { LinearSequencesRulesPlayer } from './LinearSequencesRulesPlayer';
import { LikelihoodScalePlayer } from './LikelihoodScalePlayer';
import { ProbabilityExperimentPlayer } from './ProbabilityExperimentPlayer';
import { MentalAdditionStrategiesPlayer } from './MentalAdditionStrategiesPlayer';
import { DecimalAdditionPlayer } from './DecimalAdditionPlayer';
import { TwoDigitMultiplicationPlayer } from './TwoDigitMultiplicationPlayer';
import { DivisionRemaindersPlayer } from './DivisionRemaindersPlayer';
import { OrderOfOperationsPlayer } from './OrderOfOperationsPlayer';
import { TranslatingShapesPlayer } from './TranslatingShapesPlayer';
import { CoordinateShapesPlayer } from './CoordinateShapesPlayer';
import { PercentageGridPlayer } from './PercentageGridPlayer';
import { FractionDecimalPercentPlayer } from './FractionDecimalPercentPlayer';
import { RCRTComparingOrderingPlayer } from './RCRTComparingOrderingPlayer';
import { RCRTFindingFractionsOfAmountsPlayer } from './RCRTFindingFractionsOfAmountsPlayer';
import { RCRTRatioProportionPlayer } from './RCRTRatioProportionPlayer';
import { RCRTPerimeterPolygonsPlayer } from './RCRTPerimeterPolygonsPlayer';
import { RCRTAreaRectanglesPlayer } from './RCRTAreaRectanglesPlayer';
import { RCRT3DNetsPlayer } from './RCRT3DNetsPlayer';
import { RCRTVisualising3DPlayer } from './RCRTVisualising3DPlayer';
import { RCRTSquareNumbersPlayer } from './RCRTSquareNumbersPlayer';
import { RCRTTriangularNumbersPlayer } from './RCRTTriangularNumbersPlayer';
import { RCRTDivisibilityRulesPlayer } from './RCRTDivisibilityRulesPlayer';
import { RCRTPrimeCompositePlayer } from './RCRTPrimeCompositePlayer';
import { RCRTReflectionsPlayer } from './RCRTReflectionsPlayer';
import { RCRTCompareTranslationReflectionPlayer } from './RCRTCompareTranslationReflectionPlayer';
import { RCRTMissingNumberPlayer } from './RCRTMissingNumberPlayer';
import { RCRTOrderOfOperationsPlayer } from './RCRTOrderOfOperationsPlayer';
import { RCRTWrittenMultiplicationDivisionPlayer } from './RCRTWrittenMultiplicationDivisionPlayer';
import { RCRTAddSubtractDecimalsPlayer } from './RCRTAddSubtractDecimalsPlayer';
import { RCRTMultiplyDecimalsPlayer } from './RCRTMultiplyDecimalsPlayer';
import { RCRTModeMedianPlayer } from './RCRTModeMedianPlayer';
import { RCRTWaffleDiagramsPlayer } from './RCRTWaffleDiagramsPlayer';
import { RCRTCompareOrderFDPPlayer } from './RCRTCompareOrderFDPPlayer';
import { RCRTAddSubtractRelatedFractionsPlayer } from './RCRTAddSubtractRelatedFractionsPlayer';
import { RCRTDivideUnitFractionsPlayer } from './RCRTDivideUnitFractionsPlayer';
import { RCRTMultiplyUnitFractionsPlayer } from './RCRTMultiplyUnitFractionsPlayer';
import { RCRTRatioProportionUnit17Player } from './RCRTRatioProportionUnit17Player';
import { getWidgetForConcept, type InteractiveWidget, type TraitMatcherSpec, type PredictiveBrancherSpec } from '@/lib/interactiveWidgets';

type BespokePlayer = React.FC<{ onSuccess?: () => void; onAttempt?: (correct: boolean) => void; onNarrate?: (text: string) => void }>;

// Bespoke, richer widgets per unit - started as a pilot for just concept
// 1.1 ("test this visual appealing graphical session along with our chat,
// in a separate link first", 2026-09-09), extended to the rest of Unit 1
// ("Rest of Math Unit 1 (recommended)"), then to Unit 2 and beyond ("start
// working on the other units... prepare those lessons for english and math
// cambridge", 2026-09-10). Real user request 2026-09-09: "please do not
// use gemini / openroute now.. use NotebookLLM for all of these as it
// generates intuitive images / screens and quiz as well" - every player
// here was generated via NotebookLM's chat (grounded in that unit's real
// content, same house style: phases visual_intro -> demo -> checkpoint_quiz
// -> passed, brand colors, onNarrate reporting the exact on-screen text)
// instead of the generic Gemini/OpenRouter widget-generation pipeline
// (lib/conceptWidgetGeneration.ts), which stays in place for every subject/
// unit not yet covered here. Checked here (not via the WidgetSpec/
// getWidgetForConcept data path) since these are bespoke multi-phase
// components, not generic spec renderers. Matching scene visuals for the
// same units/concepts live in lib/bespokeSceneRegistry.tsx.
const BESPOKE_PLAYERS: Record<string, Record<string, BespokePlayer>> = {
  'cambridge-4-math-1': {
    '1.1': DecimalPlaceValuePlayer,
    '1.2': ComposingDecomposingPlayer,
    '1.3': MultiplyDivideShiftPlayer,
    '1.4': NegativeNumberLinePlayer,
    '1.5': LinearSequencePlayer,
  },
  'cambridge-4-math-2': {
    '2.1': SymmetryPatternPlayer,
    '2.2': AngleLinePlayer,
    '2.3': TriangleClassifyPlayer,
  },
  'cambridge-4-math-3': {
    '3.1': NegativeCalcPlayer,
    '3.2': MentalMathPlayer,
    '3.3': EquationSolvePlayer,
    '3.4': MentalMultiplyPlayer,
    '3.5': PartialProductsPlayer,
  },
  'cambridge-4-math-4': {
    '4.1': TimeDecimalPlayer,
    '4.2': TimeIntervalPlayer,
  },
  'cambridge-4-math-5': {
    '5.1': BarDotChartPlayer,
    '5.2': FrequencyChartPlayer,
    '5.3': LineGraphPlayer,
  },
  'cambridge-4-math-6': {
    '6.1': FractionDivisionPlayer,
    '6.2': EquivalentFractionsPlayer,
    '6.3': MixedNumbersPlayer,
    '6.4': FractionOfQuantityPlayer,
    '6.5': RelatedFractionsPlayer,
  },
  'cambridge-4-math-7': {
    '7.1': TenthsHundredthsPlayer,
    '7.2': DecomposeRegroupPlayer,
    '7.3': RoundingDecimalsPlayer,
    '7.4': ScalingDecimalsPlayer,
    '7.5': LinearSequencesRulesPlayer,
  },
  'cambridge-4-math-8': {
    '8.1': LikelihoodScalePlayer,
    '8.2': ProbabilityExperimentPlayer,
  },
  'cambridge-4-math-9': {
    '9.1': MentalAdditionStrategiesPlayer,
    '9.2': DecimalAdditionPlayer,
    '9.3': TwoDigitMultiplicationPlayer,
    '9.4': DivisionRemaindersPlayer,
    '9.5': OrderOfOperationsPlayer,
  },
  'cambridge-4-math-10': {
    '10.1': TranslatingShapesPlayer,
    '10.2': CoordinateShapesPlayer,
  },
  // 11.3-11.5 pending - NotebookLM generation was interrupted by a service
  // outage; wire up the rest once it recovers.
  'cambridge-4-math-11': {
    '11.1': PercentageGridPlayer,
    '11.2': FractionDecimalPercentPlayer,
    // Built with the new RCRT (Read-Cover-Recite-Test) active-recall
    // pattern rather than the visual_intro/demo/checkpoint_quiz shape -
    // real user feedback 2026-09-13 ("earlier way of learning was very
    // dry and boring... make it interactive, not rushing with narration")
    // led to piloting this template; see the component's own phase names.
    '11.3': RCRTComparingOrderingPlayer,
    '11.4': RCRTFindingFractionsOfAmountsPlayer,
    '11.5': RCRTRatioProportionPlayer,
  },
  'cambridge-4-math-12': {
    '12.1': RCRTPerimeterPolygonsPlayer,
    '12.2': RCRTAreaRectanglesPlayer,
    '12.3': RCRT3DNetsPlayer,
    '12.4': RCRTVisualising3DPlayer,
  },
  'cambridge-4-math-13': {
    '13.1': RCRTSquareNumbersPlayer,
    '13.2': RCRTTriangularNumbersPlayer,
    '13.3': RCRTDivisibilityRulesPlayer,
    '13.4': RCRTPrimeCompositePlayer,
  },
  'cambridge-4-math-14': {
    '14.1': RCRTReflectionsPlayer,
    '14.2': RCRTCompareTranslationReflectionPlayer,
  },
  'cambridge-4-math-15': {
    '15.1': RCRTMissingNumberPlayer,
    '15.2': RCRTOrderOfOperationsPlayer,
    '15.3': RCRTWrittenMultiplicationDivisionPlayer,
    '15.4': RCRTAddSubtractDecimalsPlayer,
    '15.5': RCRTMultiplyDecimalsPlayer,
  },
  'cambridge-4-math-16': {
    '16.1': RCRTModeMedianPlayer,
    '16.2': RCRTWaffleDiagramsPlayer,
  },
  'cambridge-4-math-17': {
    '17.1': RCRTCompareOrderFDPPlayer,
    '17.2': RCRTAddSubtractRelatedFractionsPlayer,
    '17.3': RCRTDivideUnitFractionsPlayer,
    '17.4': RCRTMultiplyUnitFractionsPlayer,
    '17.5': RCRTRatioProportionUnit17Player,
  },
};

/** True when this exact unit+concept has a bespoke player - lets UnitView.tsx gate skipMicroCheck/banner-hiding/etc without duplicating the registry. */
export function hasBespokePlayer(unitKey: string | undefined, conceptId: string): boolean {
  return Boolean(unitKey && BESPOKE_PLAYERS[unitKey]?.[conceptId]);
}

// Kept for the one place that still needs the pilot concept specifically
// (the decimal-specific DecimalConceptScene variants, scoped to exactly
// 1.1 - see lib/bespokeSceneRegistry.tsx).
export const DECIMAL_PILOT_UNIT_KEY = 'cambridge-4-math-1';
export const DECIMAL_PILOT_CONCEPT_ID = '1.1';

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
  const Player = unitKey ? BESPOKE_PLAYERS[unitKey]?.[id] : undefined;

  if (Player) {
    return (
      <div className="w-full h-full p-2 flex items-center justify-center animate-fade-in">
        <Player
          onAttempt={onAttempt}
          onSuccess={onSuccess}
          onNarrate={onWidgetPhase}
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
