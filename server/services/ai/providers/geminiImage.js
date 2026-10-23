import { GoogleGenAI } from "@google/genai";
import { saveImageAndGetUrl } from "../imageStorage.js";

let ai;

function getGeminiClient() {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is required for Gemini image generation.");
    }

    ai ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    return ai;
}

async function urlToInlinePart(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch reference image (${response.status}).`);
    }
    const mimeType = response.headers.get("content-type") || "image/png";
    const buffer = Buffer.from(await response.arrayBuffer());
    return {
        inlineData: {
            mimeType,
            data: buffer.toString("base64")
        }
    };
}

export async function generateGeminiImage(prompt, referenceImageUrls = []) {
    const parts = [];

    for (const url of referenceImageUrls) {
        parts.push(await urlToInlinePart(url));
    }

    parts.push({ text: prompt });

    const response = await getGeminiClient().models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: parts,
        config: {
            responseModalities: ["IMAGE"]
        }
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

    if (!imagePart) {
        throw new Error("Gemini did not return an image for this prompt.");
    }

    return await saveImageAndGetUrl(
        Buffer.from(imagePart.inlineData.data, "base64"),
        imagePart.inlineData.mimeType
    );
}