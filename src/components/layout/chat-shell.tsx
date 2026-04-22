"use client";

import { useRouter } from "next/navigation";
import { useChatAssistant } from "@/hooks/use-chat-assistant";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatWindow } from "@/components/chat/chat-window";
import { ChatInput } from "@/components/chat/chat-input";
import { AvatarPanel } from "@/components/avatar/avatar-panel";
import { useAvatarStore } from "@/store/avatar-store";

export function ChatShell() {
  const router = useRouter();
  const { setState } = useAvatarStore();

  const {
    conversations,
    conversationId,
    messages,
    input,
    loading,
    error,
    settings,
    setInput,
    setConversationId,
    sendMessage,
    regenerate,
    createNewConversation,
    deleteConversation,
    renameConversation,
  } = useChatAssistant();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <ChatSidebar
        items={conversations}
        activeId={conversationId}
        onSelect={setConversationId}
        onNew={() => createNewConversation().catch(() => null)}
        onDelete={(id) => deleteConversation(id).catch(() => null)}
        onRename={(id, title) => renameConversation(id, title).catch(() => null)}
        onLogout={logout}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <div>
            <h1 className="text-sm font-semibold text-zinc-100">Jarvis Assistant</h1>
            <p className="text-xs text-zinc-400">Emotion-aware AI companion</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => regenerate().catch(() => null)}
              className="rounded-lg border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
            >
              Regenerate
            </button>
            <button
              type="button"
              onClick={() => router.push("/settings")}
              className="rounded-lg border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
            >
              Settings
            </button>
          </div>
        </header>

        {error && (
          <div className="mx-4 mt-3 rounded-lg border border-rose-700/40 bg-rose-900/20 px-3 py-2 text-xs text-rose-200">
            {error}
          </div>
        )}

        <ChatWindow messages={messages} loading={loading} />

        <ChatInput
          value={input}
          disabled={loading}
          onChange={setInput}
          onSend={() => sendMessage().catch((err) => console.error(err))}
          onVoiceTranscript={(transcript) => {
            setState("listening");
            setInput(transcript);
            sendMessage(transcript).catch((err) => console.error(err));
          }}
        />
      </main>

      <AvatarPanel enabled={settings.avatarEnabled ?? true} />
    </div>
  );
}
