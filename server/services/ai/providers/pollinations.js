import { saveImageAndGetUrl } from "../imageStorage.js";

export async function generatePollinationsImage(prompt, seed, model = "flux") {
    const apiKey = process.env.POLLINATIONS_API_KEY;
    if (!apiKey) {
        throw new Error("POLLINATIONS_API_KEY is required to use Pollinations as an image fallback.");
    }

    const encodedPrompt = encodeURIComponent(prompt);
    const seedParam = seed !== undefined ? `&seed=${seed}` : "";
    const url = `https://gen.pollinations.ai/image/${encodedPrompt}?model=${model}&width=1024&height=768&nologo=true${seedParam}`;
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` }
    });

    if (!response.ok) {
        throw new Error(`Pollinations image generation failed (${response.status}).`);
    }

    const mimeType = response.headers.get("content-type") || "";
    if (!mimeType.startsWith("image/")) {
        throw new Error("Pollinations did not return an image.");
    }

    return saveImageAndGetUrl(Buffer.from(await response.arrayBuffer()), mimeType);
}