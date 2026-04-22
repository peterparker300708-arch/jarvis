import type { TTSProvider } from "@/server/providers/tts/base";

export class MockTTSProvider implements TTSProvider {
  id = "mock";

  async synthesize(text: string, _voice?: string) {
    void _voice;
    const words = Math.max(1, text.split(/\s+/).length);
    const visemes = Array.from({ length: words }).map((_, index) => ({
      time: index * 0.2,
      value: Math.max(0.2, Math.sin(index) * 0.5 + 0.5),
    }));

    return {
      audioBase64: "",
      mimeType: "audio/mpeg",
      visemes,
    };
  }
}
