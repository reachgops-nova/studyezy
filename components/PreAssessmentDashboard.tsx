import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  ArrowRight, 
  Play, 
  Volume2, 
  Calendar, 
  Clock,
  ShieldAlert,
  HelpCircle,
  BarChart3
} from 'lucide-react';

// Mock Data representing Viban's Diagnostic Benchmark and Active Mastery Telemetry
const DIAGNOSTIC_BENCHMARK = {
  testedAt: "August 20, 2026",
  initialScore: 54, // 54% represents the initial unguided score
  currentScore: 82, // current cumulative score after using StudyEzy
  totalQuestions: 15,
  completedProfiles: 1,
  timeTakenMinutes: 18,
  strengths: ["Literal Retrieval", "Chronological Timelines"],
  focusAreas: ["Implicit Meaning", "Idiomatic Phrases", "Prefixes & Suffixes"]
};

const CONCEPTUAL_TELEMETRY = [
  {
    unitId: "english-u1",
    unitTitle: "Unit 1: Fiction and Fables",
    concepts: [
      { id: "1.2", name: "Implicit Meaning", baseline: 40, current: 85, status: "Mastered", attempts: 3, lastTested: "2 days ago", priority: "LOW", reviewDate: "Sep 15, 2026" },
      { id: "1.7", name: "Fact vs. Opinion", baseline: 60, current: 90, status: "Mastered", attempts: 2, lastTested: "1 day ago", priority: "LOW", reviewDate: "Sep 14, 2026" },
      { id: "1.9", name: "Sentence Connections", baseline: 50, current: 65, status: "Brush-up", attempts: 4, lastTested: "3 hours ago", priority: "MED", reviewDate: "Sep 4, 2026" }
    ]
  },
  {
    unitId: "english-u2",
    unitTitle: "Unit 2: Biography & Lifes",
    concepts: [
      { id: "2.1", name: "Biography Features", baseline: 45, current: 55, status: "Reteach Needed", attempts: 2, lastTested: "4 days ago", priority: "HIGH", reviewDate: "Tomorrow" },
      { id: "2.2", name: "Chronological Timeline", baseline: 70, current: 85, status: "Mastered", attempts: 1, lastTested: "2 days ago", priority: "LOW", reviewDate: "Sep 12, 2026" },
      { id: "2.5", name: "Prefixes & Suffixes", baseline: 30, current: 50, status: "Reteach Needed", attempts: 3, lastTested: "Today", priority: "HIGH", reviewDate: "Tomorrow" }
    ]
  },
  {
    unitId: "math-u6",
    unitTitle: "Math Unit 6: Fractions & Decimals",
    concepts: [
      { id: "6.1", name: "Fraction Shading", baseline: 65, current: 75, status: "Brush-up", attempts: 2, lastTested: "Yesterday", priority: "MED", reviewDate: "Sep 5, 2026" },
      { id: "6.4", name: "Decimal Equivalents", baseline: 35, current: 40, status: "Reteach Needed", attempts: 1, lastTested: "Just Now", priority: "HIGH", reviewDate: "Tomorrow" }
    ]
  }
];

const REASONING_LOGS = [
  {
    id: "log-1",
    concept: "1.2 Implicit Meaning",
    timestamp: "10 mins ago",
    transcript: "I saw that Jo was grinning and winking, which means she is naughty and trying to place the chewing gum as a prank. The writer didn't say she was cheeky, but her face tells us she is cheeky!",
    classification: "Correct Reasoning",
    claudesFeedback: "Brilliant synthesis! Viban successfully identified that 'winking' and 'grinning' are implicit physical cues denoting playful mischief, demonstrating deep comprehension without explicit textual statements.",
    starsEarned: 10
  },
  {
    id: "log-2",
    concept: "1.9 Sentence Connectors",
    timestamp: "1 hour ago",
    transcript: "The wombats loved the cold because they burrowed... wait, no, the wombats lived in burrows and the magpies lived in trees because... I used 'and' but they are opposites.",
    classification: "Careless Slip / Sentence Misread",
    claudesFeedback: "Viban recognized that both clauses were related but missed the contrast boundary. Encourage him to check if the two clauses show similarities or differences before choosing a conjunction.",
    starsEarned: 2
  }
];

export default function PreAssessmentDashboard() {
  const [activeUnitTab, setActiveUnitTab] = useState("all");
  const [selectedLog, setSelectedLog] = useState<typeof REASONING_LOGS[0] | null>(REASONING_LOGS[0]);

  // Calculations for KPI Cards
  const totalConcepts = CONCEPTUAL_TELEMETRY.flatMap(u => u.concepts).length;
  const masteredCount = CONCEPTUAL_TELEMETRY.flatMap(u => u.concepts).filter(c => c.status === "Mastered").length;
  const brushUpCount = CONCEPTUAL_TELEMETRY.flatMap(u => u.concepts).filter(c => c.status === "Brush-up").length;
  const reteachCount = CONCEPTUAL_TELEMETRY.flatMap(u => u.concepts).filter(c => c.status === "Reteach Needed").length;

  const masteredPercent = Math.round((masteredCount / totalConcepts) * 100);

  return (
    <div className="min-h-screen bg-[#FFFEEA] p-4 sm:p-8 font-nunito text-[#16241f]">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-8 bg-white rounded-3xl border-2 border-[#16241f] p-6 shadow-[4px_4px_0px_0px_#16241f] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#FF9F0A]/20 text-[#D46B08] px-3 py-1 rounded-full text-xs font-bold border border-[#FF9F0A]/30">Parent-Portal Dashboard</span>
            <span className="bg-brand-ink/10 text-[#16241f] px-3 py-1 rounded-full text-xs font-bold">Stage 5 Pathway</span>
          </div>
          <h1 className="text-3xl font-black font-fredoka tracking-tight text-[#16241f]">
            Viban's Learning Journey 🦘
          </h1>
          <p className="text-sm text-slate-500 mt-1">Grounded telemetry and live parent metrics compiled from physical textbook page flips.</p>
        </div>
        
        {/* Quick Date Badge */}
        <div className="flex items-center gap-3 bg-[#16241f]/5 px-4 py-2.5 rounded-2xl border border-[#16241f]/10">
          <Calendar className="w-5 h-5 text-[#16241f]/70" />
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Last Sync</p>
            <p className="text-xs font-black text-[#16241f]">September 1, 2026</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Core Baseline Benchmark & Progress Summary */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          
          {/* Diagnostic Benchmark Card */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl border-2 border-[#16241f] p-6 text-white shadow-[4px_4px_0px_0px_#16241f] relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-10">
              <Activity className="w-32 h-32" />
            </div>
            
            <h3 className="text-xl font-bold font-fredoka mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#FFFEEA]" /> Baseline Benchmark
            </h3>

            <p className="text-sm text-[#FFFEEA]/90 mb-6">
              Viban's initial unguided Diagnostic Warm-up taken on <strong>{DIAGNOSTIC_BENCHMARK.testedAt}</strong> established our baseline.
            </p>

            {/* Score Comparison Visual */}
            <div className="flex items-center justify-between mb-6 bg-white/10 p-4 rounded-2xl border border-white/20">
              <div className="text-center">
                <span className="text-xs text-[#FFFEEA]/80 font-bold uppercase tracking-wider block">Baseline</span>
                <span className="text-3xl font-black font-fredoka text-[#FFFEEA]">{DIAGNOSTIC_BENCHMARK.initialScore}%</span>
              </div>
              
              <div className="h-8 w-px bg-white/20" />
              
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs text-[#FFFEEA]/80 font-bold uppercase tracking-wider block">Star Progress</span>
                <span className="text-xs bg-[#FFFEEA] text-orange-600 font-extrabold px-2 py-0.5 rounded-full mt-1">
                  +{DIAGNOSTIC_BENCHMARK.currentScore - DIAGNOSTIC_BENCHMARK.initialScore}% Growth
                </span>
              </div>

              <div className="h-8 w-px bg-white/20" />

              <div className="text-center">
                <span className="text-xs text-[#FFFEEA]/85 font-bold uppercase tracking-wider block">Current</span>
                <span className="text-3xl font-black font-fredoka text-[#FFFEEA]">{DIAGNOSTIC_BENCHMARK.currentScore}%</span>
              </div>
            </div>

            {/* Progress Bar Visualizer */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Learning Pathway Coverage</span>
                <span>{masteredPercent}% Mastered</span>
              </div>
              <div className="w-full bg-[#16241f]/20 rounded-full h-3 p-0.5 border border-white/20">
                <div 
                  className="bg-[#FFFEEA] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${masteredPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cognitive Strengths and Focus areas */}
          <div className="bg-white rounded-3xl border-2 border-[#16241f] p-6 shadow-[4px_4px_0px_0px_#16241f]">
            <h3 className="text-lg font-bold font-fredoka mb-4 text-[#16241f] flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" /> Cognitive Insight
            </h3>

            {/* Strengths */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase text-emerald-600 mb-2 tracking-wider">🎉 Active Strengths (Baseline Met)</p>
              <div className="flex flex-wrap gap-2">
                {DIAGNOSTIC_BENCHMARK.strengths.map((str, i) => (
                  <span key={i} className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {str}
                  </span>
                ))}
              </div>
            </div>

            {/* Focus areas */}
            <div>
              <p className="text-xs font-bold uppercase text-orange-600 mb-2 tracking-wider">⏳ Highlighted Focus Areas (Need Practice)</p>
              <div className="flex flex-col gap-2">
                {DIAGNOSTIC_BENCHMARK.focusAreas.map((foc, i) => (
                  <div key={i} className="bg-orange-50/50 border border-orange-200 p-3 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#16241f]">{foc}</p>
                      <p className="text-[11px] text-slate-500">Scheduled for visual in-app warmups next lesson.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Center & Right Column: Interactive Concept Matrix & Dialogue Logs */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Spaced Repetition Mastery Scheduler */}
          <div className="bg-white rounded-3xl border-2 border-[#16241f] p-6 shadow-[4px_4px_0px_0px_#16241f]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold font-fredoka text-[#16241f] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-500" /> Dynamic Spaced Repetition Matrix
                </h3>
                <p className="text-xs text-slate-500">Ezy dynamically updates these retest cadences based on Viban's voice answers.</p>
              </div>

              {/* Filtering tabs */}
              <div className="flex gap-1.5 bg-[#16241f]/5 p-1 rounded-xl">
                {["all", "HIGH", "MED", "LOW"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveUnitTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeUnitTab === tab 
                        ? 'bg-orange-500 text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-200/50'
                    }`}
                  >
                    {tab === "all" ? "All" : tab === "HIGH" ? "Reteach" : tab === "MED" ? "Brush-up" : "Mastered"}
                  </button>
                ))}
              </div>
            </div>

            {/* List of units and concepts */}
            <div className="flex flex-col gap-4">
              {CONCEPTUAL_TELEMETRY.map((unit, uIdx) => {
                // Filter concepts based on tab priority
                const filteredConcepts = unit.concepts.filter(
                  c => activeUnitTab === "all" || c.priority === activeUnitTab
                );

                if (filteredConcepts.length === 0) return null;

                return (
                  <div key={uIdx} className="border-2 border-[#16241f]/5 rounded-2xl p-4 bg-[#16241f]/[0.01]">
                    <h4 className="text-xs font-black uppercase text-slate-500 mb-3 tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" /> {unit.unitTitle}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredConcepts.map((concept, cIdx) => (
                        <div 
                          key={cIdx} 
                          className={`p-4 rounded-xl border-2 flex flex-col justify-between transition-all hover:scale-[1.01] ${
                            concept.priority === "HIGH" 
                              ? 'bg-rose-50/50 border-rose-300' 
                              : concept.priority === "MED"
                                ? 'bg-amber-50/50 border-amber-300'
                                : 'bg-emerald-50/50 border-emerald-300'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <div>
                              <span className="text-[10px] font-bold text-slate-500 block">Concept {concept.id}</span>
                              <span className="text-sm font-black text-[#16241f]">{concept.name}</span>
                            </div>
                            
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                              concept.priority === "HIGH" 
                                ? 'bg-rose-100 text-rose-800' 
                                : concept.priority === "MED"
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {concept.status}
                            </span>
                          </div>

                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200/50 text-xs">
                            <span className="text-slate-500 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> Retest: <strong>{concept.reviewDate}</strong>
                            </span>
                            <span className="bg-white/80 border border-slate-200 text-slate-700 font-extrabold px-2 py-0.5 rounded-lg">
                              Attempts: {concept.attempts}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Parental Voice Reasoning Logs */}
          <div className="bg-white rounded-3xl border-2 border-[#16241f] p-6 shadow-[4px_4px_0px_0px_#16241f] grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Logs List */}
            <div className="border-r border-slate-100 pr-0 md:pr-6">
              <h3 className="text-lg font-bold font-fredoka text-[#16241f] flex items-center gap-2 mb-1">
                <Volume2 className="w-5 h-5 text-orange-500 animate-pulse" /> Verbal Reasoning Telemetry
              </h3>
              <p className="text-xs text-slate-500 mb-4">Click to inspect active audio responses and Claude's diagnostics.</p>

              <div className="flex flex-col gap-3">
                {REASONING_LOGS.map((log) => (
                  <button
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-1.5 ${
                      selectedLog?.id === log.id 
                        ? 'border-orange-500 bg-orange-50/30' 
                        : 'border-slate-100 hover:border-slate-300 bg-slate-50/20'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-black text-[#16241f]">{log.concept}</span>
                      <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                    </div>
                    
                    <p className="text-xs text-slate-600 line-clamp-2 italic font-nunito">
                      "{log.transcript}"
                    </p>

                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        log.classification.includes("Correct") 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {log.classification}
                      </span>
                      <span className="text-[10px] text-orange-600 font-extrabold flex items-center gap-0.5">
                        ⭐ +{log.starsEarned} Stars
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Diagnostic Feedback Detail Panel */}
            <div className="flex flex-col justify-between bg-slate-50/40 p-4 rounded-2xl border border-slate-100">
              {selectedLog ? (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[#16241f] text-white text-[10px] font-black px-2 py-0.5 rounded-full">Transcript Analysis</span>
                      <span className="text-xs text-slate-400">ID: {selectedLog.id}</span>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">🎙️ What Viban said:</p>
                      <div className="bg-white p-3 rounded-xl border border-slate-200/50 relative">
                        <p className="text-xs text-slate-700 italic font-nunito">
                          "{selectedLog.transcript}"
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">🦉 Ezy's Companion Insight:</p>
                      <p className="text-xs text-[#16241f] font-nunito leading-relaxed bg-[#FFFEEA] border border-orange-200 p-3.5 rounded-xl">
                        {selectedLog.claudesFeedback}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/50 flex justify-between items-center">
                    <span className="text-xs text-slate-500">Classification: <strong>{selectedLog.classification}</strong></span>
                    <button className="text-xs font-extrabold text-orange-600 hover:underline flex items-center gap-1">
                      Play Voice Buffer <Play className="w-3 h-3 fill-current" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-slate-400 p-6">
                  <HelpCircle className="w-12 h-12 mb-2 text-slate-300" />
                  <p className="text-xs text-center">Select an exercise transcript to view detailed diagnostic feedback.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
