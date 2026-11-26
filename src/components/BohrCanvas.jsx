import { useEffect, useRef } from 'react';
import { getShellState } from '../utils/bohrPhysics';

export default function BohrCanvas({
    currentShell,
    onSelectShell,
    activeTransition,
    showDeBroglieWave,
    isPaused,
}) {
    const canvasRef = useRef(null);
    const stateRef = useRef({
        angle: 0,
        visualRadius: 0,
        photonProgress: 0,
        lastTransitionId: null,
    });

    // Reset photon animation whenever a new transition fires
    useEffect(() => {
        if (activeTransition && activeTransition.id !== stateRef.current.lastTransitionId) {
            stateRef.current.photonProgress = 0;
            stateRef.current.lastTransitionId = activeTransition.id;
        }
    }, [activeTransition]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animFrameId;
        let lastTime = performance.now();

        const getOrbitPixelRadius = (n, maxRadius) => {
            // Scaled non-linear spacing so all 6 shells remain clickable & clear while reflecting n^2 growth
            const minR = maxRadius * 0.17;
            const span = maxRadius * 0.78;
            const ratio = Math.pow(n / 6, 1.35);
            return minR + span * ratio;
        };

        const render = (now) => {
            const dt = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;

            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
                canvas.width = Math.floor(rect.width * dpr);
                canvas.height = Math.floor(rect.height * dpr);
            }

            ctx.save();
            ctx.scale(dpr, dpr);

            const width = rect.width;
            const height = rect.height;
            const cx = width * 0.5;
            const cy = height * 0.5;
            const maxRadius = Math.min(width, height) * 0.48;

            // Clear background with subtle radial lab glow
            ctx.clearRect(0, 0, width, height);
            const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxRadius * 1.15);
            bgGrad.addColorStop(0, 'rgba(30, 41, 59, 0.55)');
            bgGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Smoothly interpolate visual radius toward target shell radius
            const targetRadius = getOrbitPixelRadius(currentShell, maxRadius);
            if (stateRef.current.visualRadius === 0) {
                stateRef.current.visualRadius = targetRadius;
            } else {
                stateRef.current.visualRadius += (targetRadius - stateRef.current.visualRadius) * Math.min(1, dt * 10);
            }

            // Update angular motion (v_n ∝ 1/n, ω_n ∝ 1/n^3 scaled for readability)
            if (!isPaused) {
                const angularSpeed = 2.6 / Math.pow(currentShell, 1.15);
                stateRef.current.angle = (stateRef.current.angle + angularSpeed * dt) % (Math.PI * 2);
                if (activeTransition && stateRef.current.photonProgress < 1) {
                    stateRef.current.photonProgress = Math.min(1, stateRef.current.photonProgress + dt * 1.15);
                }
            }

            // Draw quantized shells n = 1 .. 6
            for (let n = 1; n <= 6; n++) {
                const r = getOrbitPixelRadius(n, maxRadius);
                const isCurrent = n === currentShell;

                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.strokeStyle = isCurrent
                    ? 'rgba(56, 189, 248, 0.7)'
                    : 'rgba(148, 163, 184, 0.18)';
                ctx.lineWidth = isCurrent ? 2 : 1;
                if (!isCurrent) ctx.setLineDash([4, 4]);
                ctx.stroke();
                ctx.setLineDash([]);

                // Shell label at top-right arc
                const labelAngle = -Math.PI / 4;
                const lx = cx + r * Math.cos(labelAngle);
                const ly = cy + r * Math.sin(labelAngle);
                ctx.font = isCurrent ? '600 11px JetBrains Mono, monospace' : '500 10px JetBrains Mono, monospace';
                ctx.fillStyle = isCurrent ? '#38bdf8' : '#64748b';
                ctx.fillText(`n=${n}`, lx + 5, ly - 3);
            }

            // Optional de Broglie Standing Wave (2π r_n = n λ_dB) around current orbit
            const activeR = stateRef.current.visualRadius;
            if (showDeBroglieWave) {
                ctx.beginPath();
                const segments = 240;
                const waveAmp = Math.max(4, Math.min(11, activeR * 0.08));
                for (let i = 0; i <= segments; i++) {
                    const theta = (i / segments) * Math.PI * 2;
                    const waveOffset = waveAmp * Math.sin(currentShell * (theta - stateRef.current.angle));
                    const wr = activeR + waveOffset;
                    const wx = cx + wr * Math.cos(theta);
                    const wy = cy + wr * Math.sin(theta);
                    if (i === 0) ctx.moveTo(wx, wy);
                    else ctx.lineTo(wx, wy);
                }
                ctx.closePath();
                ctx.strokeStyle = 'rgba(168, 85, 247, 0.8)';
                ctx.lineWidth = 1.75;
                ctx.stroke();
            }

            // Draw Nucleus (Proton)
            const nucGlow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 22);
            nucGlow.addColorStop(0, 'rgba(244, 63, 94, 0.95)');
            nucGlow.addColorStop(0.5, 'rgba(244, 63, 94, 0.3)');
            nucGlow.addColorStop(1, 'rgba(244, 63, 94, 0)');
            ctx.fillStyle = nucGlow;
            ctx.beginPath();
            ctx.arc(cx, cy, 22, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(cx, cy, 9, 0, Math.PI * 2);
            ctx.fillStyle = '#f43f5e';
            ctx.fill();
            ctx.font = 'bold 10px Inter, sans-serif';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('p⁺', cx, cy + 0.5);
            ctx.textAlign = 'left';
            ctx.textBaseline = 'alphabetic';

            // Draw Electron
            const ex = cx + activeR * Math.cos(stateRef.current.angle);
            const ey = cy + activeR * Math.sin(stateRef.current.angle);

            const eGlow = ctx.createRadialGradient(ex, ey, 1, ex, ey, 16);
            eGlow.addColorStop(0, 'rgba(56, 189, 248, 1)');
            eGlow.addColorStop(0.5, 'rgba(56, 189, 248, 0.35)');
            eGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
            ctx.fillStyle = eGlow;
            ctx.beginPath();
            ctx.arc(ex, ey, 16, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(ex, ey, 5.5, 0, Math.PI * 2);
            ctx.fillStyle = '#e0f2fe';
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#0284c7';
            ctx.stroke();

            // Tangential velocity vector arrow
            const vx = -Math.sin(stateRef.current.angle);
            const vy = Math.cos(stateRef.current.angle);
            const vecLen = 36 / Math.sqrt(currentShell);
            const tx = ex + vx * vecLen;
            const ty = ey + vy * vecLen;

            ctx.beginPath();
            ctx.moveTo(ex, ey);
            ctx.lineTo(tx, ty);
            ctx.strokeStyle = '#34d399';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Draw Animated Photon Wave-Packet (Emission or Absorption)
            if (activeTransition && stateRef.current.photonProgress < 1) {
                const p = stateRef.current.photonProgress;
                const isEmission = activeTransition.type === 'emission';
                const rayAngle = -Math.PI * 0.22;
                const dirX = Math.cos(rayAngle);
                const dirY = Math.sin(rayAngle);
                const perpX = -dirY;
                const perpY = dirX;

                const packetLen = 58;
                const travelDist = maxRadius * 0.95;
                const headDist = isEmission
                    ? activeR + p * travelDist
                    : activeR + (1 - p) * travelDist;

                const startX = cx + headDist * dirX;
                const startY = cy + headDist * dirY;

                ctx.save();
                ctx.beginPath();
                const waveSteps = 45;
                const freqCycles = Math.max(3, Math.min(8, Math.round(2400 / activeTransition.wavelengthNm)));

                for (let i = 0; i <= waveSteps; i++) {
                    const t = i / waveSteps;
                    const distAlong = isEmission ? -t * packetLen : t * packetLen;
                    const envelope = Math.sin(t * Math.PI);
                    const amp = 7 * envelope * Math.sin(t * Math.PI * 2 * freqCycles - p * 18);
                    const px = startX + distAlong * dirX + amp * perpX;
                    const py = startY + distAlong * dirY + amp * perpY;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }

                ctx.strokeStyle = activeTransition.color.hex;
                ctx.lineWidth = 2.5;
                ctx.shadowColor = activeTransition.color.hex;
                ctx.shadowBlur = 10;
                ctx.stroke();

                // Arrowhead at leading edge of photon wave packet
                const tipX = startX;
                const tipY = startY;
                const arrowDir = isEmission ? 1 : -1;
                ctx.beginPath();
                ctx.moveTo(tipX, tipY);
                ctx.lineTo(tipX - arrowDir * 8 * dirX + 4 * perpX, tipY - arrowDir * 8 * dirY + 4 * perpY);
                ctx.lineTo(tipX - arrowDir * 8 * dirX - 4 * perpX, tipY - arrowDir * 8 * dirY - 4 * perpY);
                ctx.closePath();
                ctx.fillStyle = activeTransition.color.hex;
                ctx.fill();
                ctx.restore();
            }

            ctx.restore();
            animFrameId = requestAnimationFrame(render);
        };

        animFrameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animFrameId);
    }, [currentShell, activeTransition, showDeBroglieWave, isPaused]);

    // Allow clicking directly on any orbit ring in the canvas
    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width * 0.5;
        const y = e.clientY - rect.top - rect.height * 0.5;
        const clickDist = Math.hypot(x, y);
        const maxRadius = Math.min(rect.width, rect.height) * 0.48;

        let closestShell = currentShell;
        let bestDiff = Infinity;
        for (let n = 1; n <= 6; n++) {
            const minR = maxRadius * 0.17;
            const span = maxRadius * 0.78;
            const r = minR + span * Math.pow(n / 6, 1.35);
            const diff = Math.abs(clickDist - r);
            if (diff < bestDiff && diff < 22) {
                bestDiff = diff;
                closestShell = n;
            }
        }
        if (closestShell !== currentShell) {
            onSelectShell(closestShell);
        }
    };

    const shellInfo = getShellState(currentShell);

    return (
        <div className="relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-400">
                        1. Bohr Hydrogen Atom Visualizer
                    </h2>
                    <p className="text-xs text-slate-400">
                        Click any orbit ring (<span className="font-mono text-slate-200">n = 1…6</span>) to trigger a quantum jump
                    </p>
                </div>
                <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-mono text-xs text-sky-300">
                    {shellInfo.label}
                </span>
            </div>

            <div className="relative h-[340px] w-full cursor-pointer sm:h-[380px]">
                <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className="h-full w-full rounded-xl border border-slate-800/80 bg-slate-950/80"
                />

                {/* Legend Overlay */}
                <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-3 rounded-lg border border-slate-800 bg-slate-950/85 px-3 py-1.5 text-[11px] text-slate-300 backdrop-blur">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Proton (+e)
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-sky-300" /> Electron (−e)
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-0.5 w-3 bg-emerald-400" /> Velocity (vₙ)
                    </span>
                    {showDeBroglieWave && (
                        <span className="flex items-center gap-1.5">
                            <span className="h-0.5 w-3 bg-purple-400" /> Standing Wave (nλ)
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}