"use client";

import { useVoiceMode } from "@/hooks/use-voice-mode";

type Props = {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
  onVoiceTranscript: (text: string) => void;
};

export function ChatInput({ value, disabled, onChange, onSend, onVoiceTranscript }: Props) {
  const { isListening, supported, startListening, stopListening } = useVoiceMode();

  return (
    <div className="sticky bottom-0 border-t border-zinc-800 bg-zinc-950/90 p-4 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-end gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSend();
            }
          }}
          rows={2}
          placeholder="Message your assistant..."
          className="max-h-40 min-h-12 flex-1 resize-y bg-transparent text-sm text-zinc-100 outline-none"
        />
        <button
          type="button"
          disabled={disabled}
          onClick={onSend}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Send
        </button>
        <button
          type="button"
          onClick={() => (isListening ? stopListening() : startListening(onVoiceTranscript))}
          className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-100"
          title={supported ? "Voice input" : "Speech recognition unsupported"}
        >
          {isListening ? "Stop" : "Mic"}
        </button>
      </div>
    </div>
  );
}
