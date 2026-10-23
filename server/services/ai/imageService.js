import dotenv from "dotenv";
dotenv.config();

import { generatePollinationsImage } from "./providers/pollinations.js";
import { generateGeminiImage } from "./providers/geminiImage.js";

const USE_GEMINI_IMAGES = process.env.USE_GEMINI_IMAGES === "true"
    || (process.env.USE_GEMINI_IMAGES !== "false" && Boolean(process.env.GEMINI_API_KEY));

export async function generateImage(prompt, seed, model, referenceImages = []) {
    if (USE_GEMINI_IMAGES) {
        try {
            const url = await generateGeminiImage(prompt, referenceImages);
            console.log("✅ Gemini image generation succeeded");
            return url;
        } catch (err) {
            if (!process.env.POLLINATIONS_API_KEY) {
                throw new Error(`Gemini image generation failed: ${err.message}`);
            }
            console.warn("⚠️ Gemini image generation failed, falling back to Pollinations:", err.message);
        }
    }

    // Kontext is not available on the Pollinations image endpoint.
    const pollinationsModel = (model && model !== "kontext") ? model : "flux";
    return await generatePollinationsImage(prompt, seed, pollinationsModel);
}