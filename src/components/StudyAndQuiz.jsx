import { useState } from 'react';
import { BookOpen, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { BOHR_POSTULATES, TEXTBOOK_FORMULAS, QUIZ_QUESTIONS } from '../data/pectaaContent';

export default function StudyAndQuiz() {
    const [answers, setAnswers] = useState({});

    const answeredCount = Object.keys(answers).length;
    const score = QUIZ_QUESTIONS.reduce(
        (acc, q) => (answers[q.id] === q.correctIndex ? acc + 1 : acc),
        0
    );

    const handleSelectOption = (questionId, optionIndex) => {
        if (answers[questionId] !== undefined) return;
        setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Column: PECTAA Postulates & Formulas */}
            <div className="space-y-5 lg:col-span-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl">
                    <div className="mb-4 flex items-center gap-2.5">
                        <BookOpen className="h-5 w-5 text-sky-400" />
                        <h2 className="text-base font-bold text-slate-100">
                            Bohr’s Three Postulates (PECTAA Class 12)
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {BOHR_POSTULATES.map((item) => (
                            <div
                                key={item.number}
                                className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                                        {item.number}: {item.title}
                                    </span>
                                </div>
                                <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{item.statement}</p>
                                <div className="mt-2 rounded-lg bg-slate-900 px-3 py-1.5 font-mono text-xs text-amber-300">
                                    {item.equation}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl">
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-400">
                        Key Textbook Equations & Constants
                    </h3>
                    <div className="space-y-2.5">
                        {TEXTBOOK_FORMULAS.map((f) => (
                            <div
                                key={f.label}
                                className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-3"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-xs font-semibold text-slate-200">{f.label}</span>
                                    <span className="font-mono text-xs font-semibold text-sky-300">{f.formula}</span>
                                </div>
                                <p className="mt-1 text-[11px] text-slate-400">{f.note}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Interactive MCQ Self-Test */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl lg:col-span-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h2 className="text-base font-bold text-slate-100">
                            Board Exam Self-Test (6 MCQs)
                        </h2>
                        <p className="text-xs text-slate-400">
                            Test your understanding of quantized orbits, energy levels, and spectral series
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-mono text-xs font-semibold text-sky-300">
                            Score: {score} / {QUIZ_QUESTIONS.length}
                        </span>
                        {answeredCount > 0 && (
                            <button
                                type="button"
                                onClick={() => setAnswers({})}
                                className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700"
                            >
                                <RotateCcw className="h-3.5 w-3.5" /> Reset
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    {QUIZ_QUESTIONS.map((q, idx) => {
                        const chosen = answers[q.id];
                        const isAnswered = chosen !== undefined;

                        return (
                            <div
                                key={q.id}
                                className="rounded-xl border border-slate-800 bg-slate-950/80 p-4"
                            >
                                <p className="text-xs font-semibold leading-relaxed text-slate-100">
                                    <span className="mr-1.5 font-mono text-sky-400">Q{idx + 1}.</span>
                                    {q.question}
                                </p>

                                <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {q.options.map((opt, optIdx) => {
                                        let btnClass =
                                            'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-600';
                                        if (isAnswered) {
                                            if (optIdx === q.correctIndex) {
                                                btnClass = 'border-emerald-500 bg-emerald-500/15 text-emerald-200';
                                            } else if (optIdx === chosen) {
                                                btnClass = 'border-rose-500 bg-rose-500/15 text-rose-200';
                                            } else {
                                                btnClass = 'border-slate-800/60 bg-slate-950/50 text-slate-500';
                                            }
                                        }

                                        return (
                                            <button
                                                key={opt}
                                                type="button"
                                                disabled={isAnswered}
                                                onClick={() => handleSelectOption(q.id, optIdx)}
                                                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left font-mono text-xs transition ${btnClass}`}
                                            >
                                                <span>{opt}</span>
                                                {isAnswered && optIdx === q.correctIndex && (
                                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                                                )}
                                                {isAnswered && optIdx === chosen && optIdx !== q.correctIndex && (
                                                    <XCircle className="h-4 w-4 shrink-0 text-rose-400" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {isAnswered && (
                                    <p className="mt-2.5 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-[11px] leading-relaxed text-slate-300">
                                        <span className="font-semibold text-sky-400">Explanation: </span>
                                        {q.explanation}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}