import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
import mammoth from "mammoth";
import JSZip from "jszip";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

async function parsePdf(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map((item) => item.str).join(" ") + "\n\n";
    }

    return fullText.trim();
}

async function parseDocx(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
}

async function parseEpub(file) {
    const zip = await JSZip.loadAsync(file);

    const containerXml = await zip.file("META-INF/container.xml").async("text");
    const containerDoc = new DOMParser().parseFromString(containerXml, "application/xml");
    const opfPath = containerDoc.querySelector("rootfile").getAttribute("full-path");

    const opfXml = await zip.file(opfPath).async("text");
    const opfDoc = new DOMParser().parseFromString(opfXml, "application/xml");
    const opfDir = opfPath.includes("/") ? opfPath.substring(0, opfPath.lastIndexOf("/") + 1) : "";

    const manifestItems = {};
    opfDoc.querySelectorAll("manifest > item").forEach((item) => {
        manifestItems[item.getAttribute("id")] = item.getAttribute("href");
    });

    const spineIds = Array.from(opfDoc.querySelectorAll("spine > itemref")).map((el) => el.getAttribute("idref"));

    let fullText = "";
    for (const id of spineIds) {
        const href = manifestItems[id];
        if (!href) continue;

        const fileEntry = zip.file(opfDir + href);
        if (!fileEntry) continue;

        const content = await fileEntry.async("text");
        const doc = new DOMParser().parseFromString(content, "text/html");
        fullText += (doc.body ? doc.body.textContent : "") + "\n\n";
    }

    return fullText.trim();
}

export async function extractTextFromFile(file) {
    const name = file.name.toLowerCase();

    if (name.endsWith(".txt")) return await file.text();
    if (name.endsWith(".pdf")) return await parsePdf(file);
    if (name.endsWith(".docx")) return await parseDocx(file);
    if (name.endsWith(".epub")) return await parseEpub(file);

    throw new Error("Unsupported file type. Please use .txt, .pdf, .docx, or .epub.");
}