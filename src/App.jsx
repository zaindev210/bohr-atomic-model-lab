import { useRef, useState } from 'react';
import {
  Atom,
  BookOpen,
  Play,
  Pause,
  Waves,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import BohrCanvas from './components/BohrCanvas';
import EnergyLadder from './components/EnergyLadder';
import Spectrometer from './components/Spectrometer';
import StudyAndQuiz from './components/StudyAndQuiz';
import { calculateTransition, getShellState } from './utils/bohrPhysics';
import { GUIDED_EXPERIMENTS } from './data/pectaaContent';

export default function App() {
  const [activeTab, setActiveTab] = useState('lab');
  const [currentShell, setCurrentShell] = useState(3);
  const [activeTransition, setActiveTransition] = useState(null);
  const [history, setHistory] = useState([]);
  const [showDeBroglieWave, setShowDeBroglieWave] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const nextHistoryId = useRef(1);

  const shellState = getShellState(currentShell);

  const triggerJump = (targetShell) => {
    if (targetShell === currentShell) return;
    const transition = calculateTransition(currentShell, targetShell);
    if (!transition) return;

    const record = {
      ...transition,
      id: nextHistoryId.current++,
    };

    setCurrentShell(targetShell);
    setActiveTransition(record);
    setHistory((prev) => [record, ...prev]);
  };

  const runGuidedExperiment = (exp) => {
    const transition = calculateTransition(exp.from, exp.to);
    if (!transition) return;

    const record = {
      ...transition,
      id: nextHistoryId.current++,
    };

    setCurrentShell(exp.to);
    setActiveTransition(record);
    setHistory((prev) => [record, ...prev]);
    setActiveTab('lab');
  };

  const resetLab = () => {
    setCurrentShell(1);
    setActiveTransition(null);
    setHistory([]);
    setIsPaused(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Header */}
      <header className="border-b border-slate-800/90 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/15 text-sky-400">
              <Atom className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                  Bohr’s Atomic Model & Hydrogen Spectra Lab
                </h1>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                  PECTAA Class 12 • Atomic Spectra
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Interactive Quantized Orbits, Energy Transitions & Rydberg Emission Spectrometer
              </p>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('lab')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${activeTab === 'lab'
                ? 'bg-sky-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
                }`}
            >
              <Atom className="h-4 w-4" /> Interactive Lab
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('study')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${activeTab === 'study'
                ? 'bg-sky-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
                }`}
            >
              <BookOpen className="h-4 w-4" /> Postulates & Self-Test
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">
        {/* Guided Textbook Quick Experiments Bar */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
              <Sparkles className="h-4 w-4" /> Guided Textbook Transitions (One-Click Demos)
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDeBroglieWave((v) => !v)}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${showDeBroglieWave
                  ? 'border-purple-400 bg-purple-500/20 text-purple-200'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
              >
                <Waves className="h-3.5 w-3.5" />
                {showDeBroglieWave ? 'Hide de Broglie Wave' : 'Show de Broglie Wave (2πr = nλ)'}
              </button>
              <button
                type="button"
                onClick={() => setIsPaused((p) => !p)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-slate-600"
              >
                {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                type="button"
                onClick={resetLab}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-slate-600"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Ground State (n=1)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {GUIDED_EXPERIMENTS.map((exp) => (
              <button
                key={exp.id}
                type="button"
                onClick={() => runGuidedExperiment(exp)}
                className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-left transition hover:border-sky-500/60 hover:bg-slate-900"
              >
                <div className="text-xs font-bold text-slate-100">{exp.title}</div>
                <div className="mt-0.5 font-mono text-[11px] text-sky-400">{exp.subtitle}</div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">{exp.description}</p>
              </button>
            ))}
          </div>
        </section>

        {activeTab === 'lab' ? (
          <>
            {/* Live Quantized Orbit Telemetry Cards */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                <div className="text-[11px] font-medium text-slate-400">Quantum Number (n)</div>
                <div className="mt-1 font-mono text-lg font-bold text-sky-400">n = {shellState.n}</div>
                <div className="text-[10px] text-slate-500">{shellState.label}</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                <div className="text-[11px] font-medium text-slate-400">Total Energy (Eₙ)</div>
                <div className="mt-1 font-mono text-lg font-bold text-amber-400">
                  {shellState.energyEv.toFixed(2)} eV
                </div>
                <div className="text-[10px] text-slate-500">−13.6 / {shellState.n}² eV</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                <div className="text-[11px] font-medium text-slate-400">Orbit Radius (rₙ)</div>
                <div className="mt-1 font-mono text-lg font-bold text-slate-100">
                  {shellState.radiusNm.toFixed(3)} nm
                </div>
                <div className="text-[10px] text-slate-500">{shellState.n}² × 0.0529 nm</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                <div className="text-[11px] font-medium text-slate-400">Orbital Speed (vₙ)</div>
                <div className="mt-1 font-mono text-lg font-bold text-emerald-400">
                  {(shellState.speedMs / 1e6).toFixed(2)} × 10⁶ m/s
                </div>
                <div className="text-[10px] text-slate-500">v₁ / {shellState.n}</div>
              </div>

              <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3 sm:col-span-1">
                <div className="text-[11px] font-medium text-slate-400">Angular Momentum (L)</div>
                <div className="mt-1 font-mono text-lg font-bold text-purple-400">
                  {shellState.n} ℏ
                </div>
                <div className="text-[10px] text-slate-500">
                  {(shellState.angularMomentum * 1e34).toFixed(2)} × 10⁻³⁴ J·s
                </div>
              </div>
            </section>

            {/* Main Interactive Split View */}
            <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <BohrCanvas
                  currentShell={currentShell}
                  onSelectShell={triggerJump}
                  activeTransition={activeTransition}
                  showDeBroglieWave={showDeBroglieWave}
                  isPaused={isPaused}
                />
              </div>
              <div className="lg:col-span-6">
                <EnergyLadder
                  currentShell={currentShell}
                  onSelectShell={triggerJump}
                  activeTransition={activeTransition}
                />
              </div>
            </section>

            {/* Emission Spectrometer & Transition History */}
            <section>
              <Spectrometer history={history} onClearHistory={() => setHistory([])} />
            </section>
          </>
        ) : (
          <StudyAndQuiz />
        )}
      </main>
    </div>
  );
}