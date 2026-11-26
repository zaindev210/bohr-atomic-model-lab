import { useState } from 'react';
import { calculateTransition, getShellState } from '../utils/bohrPhysics';

const LEVELS = [6, 5, 4, 3, 2, 1];

export default function EnergyLadder({ currentShell, onSelectShell, activeTransition }) {
    const [hoveredShell, setHoveredShell] = useState(null);

    const previewTransition =
        hoveredShell && hoveredShell !== currentShell
            ? calculateTransition(currentShell, hoveredShell)
            : null;

    return (
        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl">
            <div>
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                            2. Quantized Energy Ladder
                        </h2>
                        <p className="text-xs text-slate-400">
                            <span className="font-mono">Eₙ = −13.6 / n² eV</span> — Hover to preview, click to jump
                        </p>
                    </div>
                    <span className="rounded-md bg-slate-800 px-2 py-1 font-mono text-[11px] text-slate-300">
                        Ionization: 0.00 eV
                    </span>
                </div>

                {/* Energy Levels Stack */}
                <div className="space-y-2">
                    {LEVELS.map((n) => {
                        const state = getShellState(n);
                        const isCurrent = n === currentShell;
                        const isHovered = n === hoveredShell;
                        const barWidthPercent = 35 + n * 10;

                        return (
                            <button
                                key={n}
                                type="button"
                                onMouseEnter={() => setHoveredShell(n)}
                                onMouseLeave={() => setHoveredShell(null)}
                                onClick={() => onSelectShell(n)}
                                className={`group relative flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition-all ${isCurrent
                                    ? 'border-sky-400 bg-sky-500/15 shadow-sm shadow-sky-500/20'
                                    : isHovered
                                        ? 'border-amber-400/70 bg-slate-800/90'
                                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold ${isCurrent
                                            ? 'bg-sky-400 text-slate-950'
                                            : 'bg-slate-800 text-slate-300 group-hover:bg-amber-400 group-hover:text-slate-950'
                                            }`}
                                    >
                                        n={n}
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm font-semibold text-slate-100">
                                                {state.energyEv.toFixed(2)} eV
                                            </span>
                                            {n === 1 && (
                                                <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300">
                                                    Ground State
                                                </span>
                                            )}
                                            {isCurrent && (
                                                <span className="rounded bg-sky-400/20 px-1.5 py-0.5 text-[10px] font-semibold text-sky-300">
                                                    ● Electron Here
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-slate-800 sm:w-44">
                                            <div
                                                className={`h-full rounded-full transition-all ${isCurrent ? 'bg-sky-400' : 'bg-slate-600 group-hover:bg-amber-400'
                                                    }`}
                                                style={{ width: `${barWidthPercent}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right font-mono text-xs">
                                    <div className="text-slate-400">r = {state.radiusNm.toFixed(3)} nm</div>
                                    {!isCurrent && (
                                        <div className="mt-0.5 text-[11px] font-medium text-amber-400 opacity-80 group-hover:opacity-100">
                                            {n < currentShell ? '↓ Emit Photon' : '↑ Absorb Photon'}
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Live Hover or Active Transition Preview Box */}
            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/90 p-3">
                {previewTransition ? (
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div>
                            <span className="font-semibold text-amber-300">
                                Preview ({previewTransition.type === 'emission' ? 'Emission' : 'Absorption'}):{' '}
                            </span>
                            <span className="font-mono text-slate-200">
                                n={previewTransition.nInitial} → n={previewTransition.nFinal}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 font-mono">
                            <span className="text-slate-300">ΔE = {previewTransition.deltaEEv.toFixed(2)} eV</span>
                            <span style={{ color: previewTransition.color.hex }} className="font-semibold">
                                λ = {previewTransition.wavelengthNm.toFixed(1)} nm ({previewTransition.series.name})
                            </span>
                        </div>
                    </div>
                ) : activeTransition ? (
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div>
                            <span
                                className={`font-semibold ${activeTransition.type === 'emission' ? 'text-emerald-400' : 'text-purple-400'
                                    }`}
                            >
                                Last Jump ({activeTransition.type === 'emission' ? 'Emitted' : 'Absorbed'}):{' '}
                            </span>
                            <span className="font-mono text-slate-200">
                                n={activeTransition.nInitial} → n={activeTransition.nFinal}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 font-mono">
                            <span className="text-slate-300">ΔE = {activeTransition.deltaEEv.toFixed(2)} eV</span>
                            <span style={{ color: activeTransition.color.hex }} className="font-semibold">
                                λ = {activeTransition.wavelengthNm.toFixed(1)} nm
                                {activeTransition.balmerLine ? ` • ${activeTransition.balmerLine}` : ''}
                            </span>
                        </div>
                    </div>
                ) : (
                    <p className="text-xs text-slate-400">
                        Select any energy level above to excite the electron or trigger photon emission.
                    </p>
                )}
            </div>
        </div>
    );
}