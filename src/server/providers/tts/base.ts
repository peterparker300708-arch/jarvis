export type TTSResult = {
  audioBase64: string;
  mimeType: string;
  visemes: Array<{ time: number; value: number }>;
};

export type TTSProvider = {
  id: string;
  synthesize(text: string, voice?: string): Promise<TTSResult>;
};
