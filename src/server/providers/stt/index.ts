import { MockSTTProvider } from "@/server/providers/stt/mock-provider";

export function getSTTProvider() {
  return new MockSTTProvider();
}
