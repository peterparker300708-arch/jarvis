"use client";

import type { ChatMessage } from "@/types";
import { MessageBubble } from "@/components/chat/message-bubble";

export function ChatWindow({ messages, loading }: { messages: ChatMessage[]; loading: boolean }) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-8">
      {messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/50 p-8 text-center text-zinc-400">
          Start a conversation with your virtual assistant.
        </div>
      ) : (
        messages.map((message) => <MessageBubble key={message.id} message={message} />)
      )}

      {loading && (
        <div className="w-fit animate-pulse rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-400">
          Thinking...
        </div>
      )}
    </div>
  );
}
