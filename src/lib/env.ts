import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/jarvis"),
  JWT_SECRET: z.string().default("dev-only-secret-change-me-please-32-chars"),
  LLM_PROVIDER: z.string().default("mock"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  APP_BASE_URL: z.string().url().default("http://localhost:3000"),
  STT_PROVIDER: z.string().default("mock"),
  TTS_PROVIDER: z.string().default("mock"),
});

export const env = envSchema.parse(process.env);
