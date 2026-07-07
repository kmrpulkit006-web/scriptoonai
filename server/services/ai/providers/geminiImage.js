import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY_2 });

async function urlToInlinePart(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch reference image: ${url}`);
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

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function saveImageAndGetUrl(base64Data, mimeType) {
    const uploadResult = await cloudinary.uploader.upload(
        `data:${mimeType};base64,${base64Data}`,
        { folder: "scriptoonai-generated" }
    );
    return uploadResult.secure_url;
}

export async function generateGeminiImage(prompt, referenceImageUrls = []) {
    const parts = [];

    for (const url of referenceImageUrls) {
        parts.push(await urlToInlinePart(url));
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: parts
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

    if (!imagePart) {
        throw new Error("Gemini did not return an image for this prompt.");
    }

    return await saveImageAndGetUrl(imagePart.inlineData.data, imagePart.inlineData.mimeType);
}