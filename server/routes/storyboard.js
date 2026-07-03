import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

router.post("/", async (req, res) => {

    try {

        const { story } = req.body;

        const prompt = `
Convert the following story into a storyboard.

Return ONLY valid JSON in this format:

{
  "project": "Project Name",
  "scenes":[
    {
      "id":1,
      "title":"",
      "description":"",
      "characters":[],
      "camera":"",
      "mood":""
    }
  ]
}

Story:
${story}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const cleanResponse = response.text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        res.json({
            output: cleanResponse
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Something went wrong."
        });

    }

});


export default router;