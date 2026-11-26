
import { Trash2 } from 'lucide-react';

// Reference Hydrogen lines across UV, Visible (Balmer), and IR
const REFERENCE_LINES = [
    { label: 'Ly-β', nm: 102.6, series: 'Lyman (UV)', color: '#c084fc' },
    { label: 'Ly-α', nm: 121.6, series: 'Lyman (UV)', color: '#c084fc' },
    { label: 'Hδ', nm: 410.2, series: 'Balmer', color: '#7c3aed' },
    { label: 'Hγ', nm: 434.0, series: 'Balmer', color: '#3b82f6' },
    { label: 'Hβ', nm: 486.1, series: 'Balmer', color: '#06b6d4' },
    { label: 'Hα', nm: 656.3, series: 'Balmer', color: '#ef4444' },
    { label: 'Pa-α', nm: 1875.1, series: 'Paschen (IR)', color: '#fb7185' },
];

// Maps UV (90-380nm), Visible (380-750nm), and IR (750-2000nm) onto a 0-100% spectrometer scale
function wavelengthToPercent(nm) {
    if (nm <= 380) {
        return Math.max(3, ((nm - 90) / (380 - 90)) * 24);
    }
    if (nm <= 750) {
        return 24 + ((nm - 380) / (750 - 380)) * 52;
    }
    return Math.min(97, 76 + ((nm - 750) / (2000 - 750)) * 21);
}

export default function Spectrometer({ history, onClearHistory }) {
    const emittedWavelengths = history
        .filter((item) => item.type === 'emission')
        .map((item) => Math.round(item.wavelengthNm * 10) / 10);

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                        3. Hydrogen Emission Spectrometer & Transition Log
                    </h2>
                    <p className="text-xs text-slate-400">
                        Lines light up brightly when emitted in the simulator (Lyman UV • Balmer Visible • Paschen IR)
                    </p>
                </div>
                {history.length > 0 && (
                    <button
                        type="button"
                        onClick={onClearHistory}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 transition hover:border-rose-500/50 hover:text-rose-300"
                    >
                        <Trash2 className="h-3.5 w-3.5" /> Clear Log
                    </button>
                )}
            </div>

            {/* Spectrometer Bar */}
            <div className="relative mb-4 rounded-xl border border-slate-800 bg-slate-950 p-3">
                <div className="mb-1.5 flex justify-between font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    <span className="text-purple-400">← Ultraviolet (Lyman)</span>
                    <span className="text-sky-300">Visible Spectrum (Balmer 380–750 nm)</span>
                    <span className="text-rose-400">Infrared (Paschen+) →</span>
                </div>

                <div className="relative h-14 w-full overflow-hidden rounded-lg border border-slate-800 bg-black">
                    {/* Subtle Visible Rainbow Band Background */}
                    <div
                        className="absolute inset-y-0 opacity-15"
                        style={{
                            left: '24%',
                            width: '52%',
                            background:
                                'linear-gradient(90deg, #7c3aed 0%, #2563eb 25%, #06b6d4 45%, #22c55e 65%, #eab308 80%, #ef4444 100%)',
                        }}
                    />

                    {/* Reference Spectral Lines */}
                    {REFERENCE_LINES.map((line) => {
                        const leftPct = wavelengthToPercent(line.nm);
                        const isLit = emittedWavelengths.some((w) => Math.abs(w - line.nm) < 1.5);

                        return (
                            <div
                                key={line.label}
                                style={{ left: `${leftPct}%` }}
                                className="absolute inset-y-0 -translate-x-1/2 flex flex-col items-center justify-between py-1"
                            >
                                <div
                                    style={{
                                        backgroundColor: line.color,
                                        boxShadow: isLit ? `0 0 12px 2px ${line.color}` : 'none',
                                        opacity: isLit ? 1 : 0.25,
                                    }}
                                    className={`h-full transition-all duration-300 ${isLit ? 'w-1' : 'w-0.5'}`}
                                />
                                <span
                                    style={{ color: isLit ? line.color : '#64748b' }}
                                    className="absolute bottom-1 rounded bg-slate-950/90 px-1 font-mono text-[10px] font-semibold"
                                >
                                    {line.label}
                                </span>
                            </div>
                        );
                    })}

                    {/* Dynamic Emitted Lines from User Jumps */}
                    {history
                        .filter((item) => item.type === 'emission')
                        .slice(0, 12)
                        .map((item) => {
                            const leftPct = wavelengthToPercent(item.wavelengthNm);
                            return (
                                <div
                                    key={item.id}
                                    style={{
                                        left: `${leftPct}%`,
                                        backgroundColor: item.color.hex,
                                        boxShadow: `0 0 14px 2px ${item.color.hex}`,
                                    }}
                                    className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2"
                                />
                            );
                        })}
                </div>
            </div>

            {/* Transition Log Table */}
            {history.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-800 py-5 text-center text-xs text-slate-400">
                    No quantum transitions recorded yet. Trigger an experiment or click a shell to log spectral lines.
                </div>
            ) : (
                <div className="max-h-44 overflow-y-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs">
                        <thead className="sticky top-0 bg-slate-950 font-mono text-[11px] uppercase text-slate-400">
                            <tr>
                                <th className="px-3 py-2">Jump</th>
                                <th className="px-3 py-2">Process</th>
                                <th className="px-3 py-2">Series</th>
                                <th className="px-3 py-2">ΔE (eV)</th>
                                <th className="px-3 py-2">Wavelength (λ)</th>
                                <th className="px-3 py-2">Frequency (f)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 bg-slate-900/40 font-mono">
                            {history.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-800/40">
                                    <td className="px-3 py-2 font-semibold text-slate-100">
                                        n={item.nInitial} → n={item.nFinal}
                                    </td>
                                    <td className="px-3 py-2">
                                        <span
                                            className={`rounded px-1.5 py-0.5 text-[10px] font-sans font-semibold ${item.type === 'emission'
                                                ? 'bg-emerald-500/15 text-emerald-300'
                                                : 'bg-purple-500/15 text-purple-300'
                                                }`}
                                        >
                                            {item.type === 'emission' ? 'Emission' : 'Absorption'}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 font-sans text-slate-300">
                                        {item.series.name}
                                        {item.balmerLine ? ` (${item.balmerLine})` : ''}
                                    </td>
                                    <td className="px-3 py-2 text-slate-200">{item.deltaEEv.toFixed(2)} eV</td>
                                    <td className="px-3 py-2 font-semibold" style={{ color: item.color.hex }}>
                                        {item.wavelengthNm.toFixed(1)} nm
                                    </td>
                                    <td className="px-3 py-2 text-slate-400">
                                        {(item.frequencyHz / 1e14).toFixed(2)} × 10¹⁴ Hz
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}