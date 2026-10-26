import dotenv from "dotenv";
dotenv.config();

import { generatePollinationsImage } from "./providers/pollinations.js";

export async function generateImage(prompt, seed, model) {
    // Kontext is not available on the Pollinations image endpoint.
    const pollinationsModel = (model && model !== "kontext") ? model : "flux";
    return generatePollinationsImage(prompt, seed, pollinationsModel);
}