"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ConversationSummary } from "@/types";

type Props = {
  items: ConversationSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onLogout: () => void;
};

export function ChatSidebar({ items, activeId, onSelect, onNew, onDelete, onRename, onLogout }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [value, setValue] = useState("");

  return (
    <aside className="flex h-full w-full flex-col border-r border-zinc-800 bg-zinc-950 md:w-72">
      <div className="space-y-2 p-3">
        <button
          type="button"
          onClick={onNew}
          className="w-full rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
        >
          + New chat
        </button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-2">
        {items.map((conversation) => {
          const selected = activeId === conversation.id;
          const isEditing = editing === conversation.id;

          return (
            <div
              key={conversation.id}
              className={cn(
                "group rounded-xl border p-2 text-sm",
                selected ? "border-indigo-500 bg-zinc-900" : "border-zinc-800 bg-zinc-900/40",
              )}
            >
              {isEditing ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    onRename(conversation.id, value);
                    setEditing(null);
                  }}
                >
                  <input
                    autoFocus
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    className="w-full rounded bg-zinc-800 px-2 py-1 text-zinc-100 outline-none"
                  />
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelect(conversation.id)}
                  className="w-full text-left text-zinc-100"
                >
                  {conversation.title}
                </button>
              )}

              {!isEditing && (
                <div className="mt-2 flex gap-2 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    className="text-xs text-zinc-400 hover:text-zinc-100"
                    onClick={() => {
                      setEditing(conversation.id);
                      setValue(conversation.title);
                    }}
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    className="text-xs text-rose-400 hover:text-rose-300"
                    onClick={() => onDelete(conversation.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-zinc-800 p-3">
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
