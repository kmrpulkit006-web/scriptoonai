const BASE_MANHWA_STYLE = `Korean webtoon manhwa art style, clean digital linework, vibrant cel-shaded coloring, sharp outlines.`;

function describeCharacter(character) {
    const fields = [
        ["Age", character.age],
        ["Gender", character.gender],
        ["Hair", character.hair],
        ["Eyes", character.eyes],
        ["Outfit", character.outfit],
        ["Accessories", character.accessories]
    ]
        .filter(([, value]) => value && value.trim() !== "")
        .map(([label, value]) => `${label}: ${value}`)
        .join(", ");

    return `${character.name} (${fields})`;
}

function summarizeCharacterForScene(character) {
    const details = [character.hair, character.eyes, character.outfit]
        .filter(value => value && value.trim() !== "" && value.toLowerCase() !== "none" && value.toLowerCase() !== "n/a")
        .join(", ");

    return details ? `${character.name} (${details})` : character.name;
}

export function buildPrompt(scene, characters = []) {
    const sceneCharacters = (scene.characters || [])
        .map(name => characters.find(c => c.name === name))
        .filter(Boolean);

    const characterDescription = sceneCharacters
        .map(summarizeCharacterForScene)
        .join("; ");

    const parts = [
        BASE_MANHWA_STYLE,
        "Single cinematic manhwa panel, single camera perspective, full scene illustration.",
        scene.description ? `Scene: ${scene.description}` : "",
        scene.environment ? `Environment: ${scene.environment}` : "",
        scene.action ? `Action: ${scene.action}` : "",
        characterDescription ? `Characters in scene: ${characterDescription}` : "",
        scene.camera ? `Camera shot: ${scene.camera}` : "",
        scene.lighting ? `Lighting: ${scene.lighting}` : "",
        scene.mood ? `Mood: ${scene.mood}` : "",
        "Single unified image, one frame, no multiple panels, no split screen, no character sheet, no model turnaround grid, no sketches, no panel borders, no text, no speech bubbles, no watermark."
    ].filter(Boolean);

    return parts.join("\n\n");
}

export function buildCharacterPortraitPrompt(character) {
    const parts = [
        BASE_MANHWA_STYLE,
        "Single solo character reference portrait, front-facing, waist-up view, plain neutral background, clear view of face and outfit, single subject.",
        describeCharacter(character),
        "Single unified portrait, no multiple panels, no character sheet grid, no sketches, no turnaround collage, no text, no watermark."
    ].filter(Boolean);

    return parts.join("\n\n");
}