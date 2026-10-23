const BASE_MANHWA_STYLE = "Korean webtoon manhwa illustration, clean digital linework, vibrant cel-shaded coloring.";

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
        scene.camera ? `${scene.camera} of this scene:` : "A wide cinematic shot of this scene:",
        scene.description,
        scene.environment ? `Setting: ${scene.environment}.` : "",
        scene.action ? `Action: ${scene.action}.` : "",
        characterDescription ? `Characters in the scene: ${characterDescription}.` : "",
        scene.lighting ? `Lighting: ${scene.lighting}.` : "",
        scene.mood ? `Mood: ${scene.mood}.` : "",
        "One single continuous illustration filling the whole frame, characters placed naturally inside the detailed environment.",
        BASE_MANHWA_STYLE
    ].filter(Boolean);

    return parts.join(" ");
}

export function buildCharacterPortraitPrompt(character) {
    const parts = [
        "Portrait of one single person, front-facing, waist-up, centered, soft plain background.",
        describeCharacter(character),
        BASE_MANHWA_STYLE
    ].filter(Boolean);

    return parts.join(" ");
}