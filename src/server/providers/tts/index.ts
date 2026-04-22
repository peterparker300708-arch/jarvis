import { MockTTSProvider } from "@/server/providers/tts/mock-provider";

export function getTTSProvider() {
  return new MockTTSProvider();
}
