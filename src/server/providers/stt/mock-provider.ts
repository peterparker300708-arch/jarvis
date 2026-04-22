import type { STTProvider } from "@/server/providers/stt/base";

export class MockSTTProvider implements STTProvider {
  id = "mock";

  async transcribe(_audio: ArrayBuffer, _language = "en") {
    void _audio;
    void _language;
    return {
      text: "Mock transcription result. Connect a real STT provider for production voice recognition.",
      confidence: 0.5,
    };
  }
}
