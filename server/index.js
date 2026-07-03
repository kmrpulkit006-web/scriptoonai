import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import storyboardRoute from "./routes/storyboard.js";

dotenv.config();
console.log(process.cwd());
console.log(process.env.GEMINI_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/storyboard", storyboardRoute);

app.get("/", (req, res) => {
  res.json({
    message: "NarraFrame API Running 🚀"
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});