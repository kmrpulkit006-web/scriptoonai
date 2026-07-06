function CharacterReview({ characters, onChange, onContinue, onCancel }) {
    function updateField(index, field, value) {
        const updated = characters.map((c, i) => (i === index ? { ...c, [field]: value } : c));
        onChange(updated);
    }

    return (
        <div className="review-overlay">
            <div className="review-modal">
                <h3>Review Your Characters</h3>
                <p>Edit any details before generating images — this saves time if something looks off.</p>

                <div className="review-list">
                    {characters.map((char, index) => (
                        <div key={index} className="review-card">
                            <label className="field-label">Name</label>
                            <input value={char.name || ""} onChange={(e) => updateField(index, "name", e.target.value)} />

                            <div className="review-grid">
                                <div>
                                    <label className="field-label">Age</label>
                                    <input value={char.age || ""} onChange={(e) => updateField(index, "age", e.target.value)} />
                                </div>
                                <div>
                                    <label className="field-label">Gender</label>
                                    <input value={char.gender || ""} onChange={(e) => updateField(index, "gender", e.target.value)} />
                                </div>
                                <div>
                                    <label className="field-label">Hair</label>
                                    <input value={char.hair || ""} onChange={(e) => updateField(index, "hair", e.target.value)} />
                                </div>
                                <div>
                                    <label className="field-label">Eyes</label>
                                    <input value={char.eyes || ""} onChange={(e) => updateField(index, "eyes", e.target.value)} />
                                </div>
                            </div>

                            <label className="field-label">Outfit</label>
                            <input value={char.outfit || ""} onChange={(e) => updateField(index, "outfit", e.target.value)} />

                            <label className="field-label">Accessories</label>
                            <input value={char.accessories || ""} onChange={(e) => updateField(index, "accessories", e.target.value)} />
                        </div>
                    ))}
                </div>

                <div className="review-actions">
                    <button className="review-continue-btn" onClick={onContinue}>✅ Continue to Generate Images</button>
                    <button className="review-cancel" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default CharacterReview;