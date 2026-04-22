"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import type { ChatMessage, ConversationSummary } from "@/types";
import { useAvatarStore } from "@/store/avatar-store";

type Settings = {
  model?: string;
  voiceEnabled?: boolean;
  avatarEnabled?: boolean;
  selectedVoice?: string;
};

function detectEmotion(content: string) {
  const lowered = content.toLowerCase();
  if (lowered.includes("sorry") || lowered.includes("apolog")) return "apologetic" as const;
  if (lowered.includes("!") || lowered.includes("great") || lowered.includes("awesome")) return "excited" as const;
  if (lowered.includes("?") || lowered.includes("unclear")) return "confused" as const;
  if (lowered.includes("think") || lowered.includes("consider")) return "thinking" as const;
  if (lowered.includes("happy") || lowered.includes("glad")) return "happy" as const;
  if (lowered.includes("important") || lowered.includes("must")) return "serious" as const;
  return "friendly" as const;
}

export function useChatAssistant() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>({
    model: "mock-default",
    voiceEnabled: true,
    avatarEnabled: true,
    selectedVoice: "alloy",
  });
  const { setEmotion, setState, setSpeaking, setMouthOpen } = useAvatarStore();

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === conversationId) ?? null,
    [conversationId, conversations],
  );

  const refreshConversations = useCallback(async () => {
    const response = await fetch("/api/conversations");
    if (!response.ok) throw new Error("Failed to load conversations");
    const data = await response.json();
    setConversations(data.conversations ?? []);

    if (!conversationId && data.conversations?.length) {
      setConversationId(data.conversations[0].id);
    }
  }, [conversationId]);

  const loadSettings = useCallback(async () => {
    const response = await fetch("/api/settings");
    if (!response.ok) return;
    const data = await response.json();
    setSettings({
      model: data.settings?.model,
      voiceEnabled: data.settings?.voiceEnabled,
      avatarEnabled: data.settings?.avatarEnabled,
      selectedVoice: data.settings?.selectedVoice,
    });
  }, []);

  const fetchConversation = useCallback(async (id: string) => {
    const response = await fetch(`/api/conversations/${id}`);
    if (!response.ok) throw new Error("Failed to load conversation");

    const data = await response.json();
    setConversationId(id);
    setMessages(data.messages ?? []);
  }, []);

  useEffect(() => {
    refreshConversations().catch(() => setError("Failed to load conversations"));
    loadSettings().catch(() => setError("Failed to load settings"));
  }, [loadSettings, refreshConversations]);

  useEffect(() => {
    if (conversationId) {
      fetchConversation(conversationId).catch(() => setError("Failed to load messages"));
    }
  }, [conversationId, fetchConversation]);

  const createNewConversation = useCallback(async () => {
    const response = await fetch("/api/conversations", { method: "POST" });
    if (!response.ok) throw new Error("Failed to create conversation");

    const data = await response.json();
    setConversations((prev) => [data.conversation, ...prev]);
    setConversationId(data.conversation.id);
    setMessages([]);
  }, []);

  const deleteConversation = useCallback(
    async (id: string) => {
      const response = await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete conversation");

      setConversations((prev) => prev.filter((item) => item.id !== id));
      if (conversationId === id) {
        setConversationId(null);
        setMessages([]);
      }
    },
    [conversationId],
  );

  const renameConversation = useCallback(async (id: string, title: string) => {
    const response = await fetch(`/api/conversations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) throw new Error("Failed to rename conversation");
    const data = await response.json();

    setConversations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: data.conversation.title } : item)),
    );
  }, []);

  const speak = useCallback(
    async (text: string) => {
      if (!settings.voiceEnabled || typeof window === "undefined") return;

      setSpeaking(true);
      setState("speaking");

      const ttsResponse = await fetch("/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: settings.selectedVoice }),
      });

      const ttsData = ttsResponse.ok ? await ttsResponse.json() : null;
      if (ttsData?.visemes?.length) {
        for (const viseme of ttsData.visemes) {
          await new Promise((resolve) => setTimeout(resolve, 120));
          setMouthOpen(viseme.value);
        }
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onboundary = () => {
        setMouthOpen(Math.random() * 0.8 + 0.2);
      };
      utterance.onend = () => {
        setMouthOpen(0);
        setSpeaking(false);
        setState("idle");
      };

      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    },
    [setMouthOpen, setSpeaking, setState, settings.selectedVoice, settings.voiceEnabled],
  );

  const sendMessage = useCallback(
    async (overrideInput?: string) => {
      const message = (overrideInput ?? input).trim();
      if (!message || loading) return;

      setError(null);
      setLoading(true);
      setState("thinking");

      let targetConversationId = conversationId;
      if (!targetConversationId) {
        const response = await fetch("/api/conversations", { method: "POST" });
        const data = await response.json();
        targetConversationId = data.conversation.id;
        setConversationId(targetConversationId);
        setConversations((prev) => [data.conversation, ...prev]);
      }

      const userMessage: ChatMessage = {
        id: uuid(),
        role: "user",
        content: message,
        createdAt: new Date().toISOString(),
      };
      const assistantId = uuid();
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setInput("");

      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: targetConversationId,
          message,
          model: settings.model,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to stream response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setMessages((prev) =>
          prev.map((entry) => (entry.id === assistantId ? { ...entry, content: fullText } : entry)),
        );
      }

      setEmotion(detectEmotion(fullText));
      setState("speaking");
      await speak(fullText);
      setState("idle");
      refreshConversations().catch(() => null);
      setLoading(false);
    },
    [conversationId, input, loading, refreshConversations, setEmotion, setState, settings.model, speak],
  );

  const regenerate = useCallback(async () => {
    if (!conversationId || loading) return;

    const withoutLastAssistant = [...messages].filter(
      (message, index, all) =>
        !(message.role === "assistant" && index === all.map((item) => item.role).lastIndexOf("assistant")),
    );
    const assistantId = uuid();

    setMessages([
      ...withoutLastAssistant,
      { id: assistantId, role: "assistant", content: "", createdAt: new Date().toISOString() },
    ]);
    setLoading(true);

    const response = await fetch("/api/chat/regenerate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, model: settings.model }),
    });

    if (!response.ok || !response.body) {
      setLoading(false);
      throw new Error("Failed to regenerate");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      fullText += decoder.decode(value, { stream: true });
      setMessages((prev) =>
        prev.map((entry) => (entry.id === assistantId ? { ...entry, content: fullText } : entry)),
      );
    }

    await speak(fullText);
    setLoading(false);
    refreshConversations().catch(() => null);
  }, [conversationId, loading, messages, refreshConversations, settings.model, speak]);

  return {
    conversations,
    conversationId,
    activeConversation,
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
  };
}
