# Jarvis — Full-Stack Virtual AI Assistant

A production-minded starter for a ChatGPT-style assistant with:
- Next.js + TypeScript + Tailwind
- PostgreSQL + Prisma
- Auth (JWT + secure password hashing)
- Streaming chat responses
- Modular provider architecture (LLM/STT/TTS)
- Voice mode foundation
- Animated live avatar panel with emotion/state/lip-sync hooks
- Conversation persistence, settings, and rate limiting

## Tech Stack

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS
- **Backend:** Next.js Route Handlers with service/provider architecture
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT cookie session + bcrypt password hashing
- **Streaming:** Web `ReadableStream`
- **Markdown:** `react-markdown` + `remark-gfm`
- **Avatar:** React Three Fiber (3D runtime-ready avatar shell)
- **Tests:** Vitest

## Project Structure

```text
prisma/
src/
  app/
    api/
      auth/
      chat/
      conversations/
      settings/
      voice/
    login/
    signup/
    settings/
    page.tsx
  components/
    avatar/
    chat/
    layout/
  hooks/
  lib/
  server/
    providers/
      llm/
      stt/
      tts/
    services/
    utils/
  store/
  types/
  __tests__/
```

## Features Implemented

### Chat + UX
- ChatGPT-like dark interface
- Left sidebar with chat history
- New chat, rename, delete
- Streaming assistant responses
- Regenerate response
- Markdown rendering + code block copy button

### Voice + Avatar
- Voice input via Web Speech API (when supported)
- Voice output via SpeechSynthesis + backend TTS integration layer
- Avatar panel with state machine hooks:
  - idle / listening / thinking / speaking
- Emotion mapping and lip-sync-ready mouth animation pipeline
- Avatar module is replaceable for future Live2D/VRM characters

### Backend Architecture
- Modular services/providers separation
- API endpoints for auth, chat stream/regenerate, conversations, settings, STT, TTS
- Rate limiting utility
- Structured error helpers
- Provider abstraction supporting future OpenAI/Anthropic/Gemini/Groq/local expansion

### Auth + Data
- Signup/login/logout/me endpoints
- Secure bcrypt hashing
- JWT httpOnly session cookie
- User-isolated conversation and settings access

## Database Schema

Prisma models include:
- `User`
- `Conversation`
- `Message`
- `UserSettings`
- `AvatarPreference`

See: `prisma/schema.prisma`

## Environment Variables

Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
```

Required:
- `DATABASE_URL`
- `JWT_SECRET`

Optional/provider-specific:
- `LLM_PROVIDER` (`mock` or `openai`)
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `STT_PROVIDER`, `TTS_PROVIDER`

## Local Development

1) Install dependencies:
```bash
npm install
```

2) Start Postgres and set `DATABASE_URL`.

3) Generate client and run migration:
```bash
npm run prisma:generate
npm run prisma:migrate
```

4) Run app:
```bash
npm run dev
```

Open http://localhost:3000

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run test`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:studio`

## API Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/conversations`
- `POST /api/conversations`
- `GET /api/conversations/:id`
- `PATCH /api/conversations/:id`
- `DELETE /api/conversations/:id`
- `POST /api/chat/stream` (streaming)
- `POST /api/chat/regenerate` (streaming)
- `GET /api/settings`
- `PUT /api/settings`
- `POST /api/voice/stt`
- `POST /api/voice/tts`

## AI Provider Integration

LLM provider interface:
- `src/server/providers/llm/base.ts`

Implementations:
- `MockLLMProvider`
- `OpenAIProvider`

Switch provider with `LLM_PROVIDER` env var.

## Avatar System & Swapping Characters

Current avatar is a modular 3D character shell using R3F:
- Renderer: `src/components/avatar/avatar-panel.tsx`
- Character: `src/components/avatar/avatar-character.tsx`
- State/emotion store: `src/store/avatar-store.ts`

To swap avatar later:
1. Replace `AvatarCharacter` with Live2D/VRM renderer.
2. Keep store contract (`state`, `emotion`, `mouthOpen`) unchanged.
3. Wire viseme/lip events from TTS provider to new character rig.

## Testing

Run:
```bash
npm run test
```

Included basic tests for:
- Conversation title generation utility
- Rate limiter behavior

## Notes for Production Hardening

- Replace mock STT/TTS providers with real providers.
- Add Redis-based distributed rate limiting.
- Add robust observability (structured logs + tracing).
- Add CSRF defense strategy for cookie session endpoints.
- Add integration/e2e tests.
- Add background jobs for audio preprocessing and voice caching.
