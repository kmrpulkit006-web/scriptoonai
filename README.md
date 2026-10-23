# Storyboard AI

Transform Stories into Cinematic Storyboards.

## Features

- 📄 Upload screenplay, novel or script
- 🤖 AI-powered story analysis
- 🎬 Automatic scene detection
- 👥 Character extraction
- 🖼️ Storyboard generation
- ⚡ Beautiful animated UI

## Tech Stack

- React
- Vite
- Framer Motion
- CSS
- Lucide React

## Getting Started

```bash
npm install
npm run dev
```

## Image generation

The server uses Gemini image generation by default when `GEMINI_API_KEY` is set.
If Gemini is unavailable and `POLLINATIONS_API_KEY` is configured, it falls back
to Pollinations. Set `USE_GEMINI_IMAGES=false` to disable Gemini images, or
`USE_GEMINI_IMAGES=true` to request them explicitly.

Generated images are saved to Cloudinary when `CLOUDINARY_CLOUD_NAME`,
`CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are configured. Otherwise,
the server stores them under `server/public/generated`; set `PUBLIC_API_URL` to
the deployed server's public base URL when using this local-storage fallback.
