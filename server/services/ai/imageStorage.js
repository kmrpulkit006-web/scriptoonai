import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function saveImageAndGetUrl(buffer, mimeType) {
    const cloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME
        && process.env.CLOUDINARY_API_KEY
        && process.env.CLOUDINARY_API_SECRET;

    if (!cloudinaryConfigured) {
        const ext = (mimeType.split("/")[1] || "png").split("+")[0];
        const filename = `${Date.now()}-${Math.floor(Math.random() * 1e6)}.${ext}`;
        const filepath = path.join(__dirname, "..", "..", "public", "generated", filename);
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, buffer);
        const publicApiUrl = (process.env.PUBLIC_API_URL || "https://scriptoonai.onrender.com").replace(/\/$/, "");
        return `${publicApiUrl}/generated/${filename}`;
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const uploadResult = await cloudinary.uploader.upload(
        `data:${mimeType};base64,${buffer.toString("base64")}`,
        { folder: "scriptoonai-generated" }
    );
    return uploadResult.secure_url;
}
