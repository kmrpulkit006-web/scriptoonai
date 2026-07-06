function GenerationProgress({ phase, index, total, label, cached }) {
    if (!phase) return null;

    const percent = total > 0 ? Math.round((index / total) * 100) : 0;

    return (
        <div className="gen-progress">
            <p className="gen-progress-phase">
                {phase === "characters" ? "🧑 Generating character portraits" : "🎬 Generating scene panels"}
            </p>
            <div className="gen-progress-bar-track">
                <div className="gen-progress-bar-fill" style={{ width: `${percent}%` }} />
            </div>
            <p className="gen-progress-label">
                {index}/{total} — {label} {cached ? "(⚡ loaded from cache)" : "(generating...)"}
            </p>
        </div>
    );
}

export default GenerationProgress;