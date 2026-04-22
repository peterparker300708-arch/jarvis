export type STTResult = {
  text: string;
  confidence?: number;
};

export type STTProvider = {
  id: string;
  transcribe(audio: ArrayBuffer, language?: string): Promise<STTResult>;
};
