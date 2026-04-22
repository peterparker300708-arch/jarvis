"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SettingsPayload = {
  model: string;
  voiceEnabled: boolean;
  avatarEnabled: boolean;
  selectedVoice: string;
  animationIntensity: number;
  avatarStyle: string;
  emotionIntensity: number;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsPayload>({
    model: "mock-default",
    voiceEnabled: true,
    avatarEnabled: true,
    selectedVoice: "alloy",
    animationIntensity: 0.6,
    avatarStyle: "anime-minimal",
    emotionIntensity: 0.7,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((response) => response.json())
      .then((data) => {
        setSettings((current) => ({
          ...current,
          ...data.settings,
          ...data.avatar,
        }));
      })
      .catch(() => null);
  }, []);

  const update = <K extends keyof SettingsPayload>(key: K, value: SettingsPayload[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const save = async () => {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-zinc-100">
      <div className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Assistant settings</h1>
          <Link href="/" className="text-sm text-indigo-400">
            Back to chat
          </Link>
        </div>

        <label className="block text-sm">
          <span className="mb-1 block text-zinc-400">Model (placeholder for provider model)</span>
          <input
            value={settings.model}
            onChange={(event) => update("model", event.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
          />
        </label>

        <label className="flex items-center justify-between rounded-lg border border-zinc-800 px-3 py-2 text-sm">
          <span>Enable voice</span>
          <input
            type="checkbox"
            checked={settings.voiceEnabled}
            onChange={(event) => update("voiceEnabled", event.target.checked)}
          />
        </label>

        <label className="flex items-center justify-between rounded-lg border border-zinc-800 px-3 py-2 text-sm">
          <span>Enable avatar</span>
          <input
            type="checkbox"
            checked={settings.avatarEnabled}
            onChange={(event) => update("avatarEnabled", event.target.checked)}
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-zinc-400">Voice preset</span>
          <select
            value={settings.selectedVoice}
            onChange={(event) => update("selectedVoice", event.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
          >
            <option value="alloy">Alloy</option>
            <option value="nova">Nova</option>
            <option value="luna">Luna</option>
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-zinc-400">Avatar style</span>
          <select
            value={settings.avatarStyle}
            onChange={(event) => update("avatarStyle", event.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
          >
            <option value="anime-minimal">Anime Minimal</option>
            <option value="cartoon-soft">Cartoon Soft</option>
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-zinc-400">Animation intensity</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={settings.animationIntensity}
            onChange={(event) => update("animationIntensity", Number(event.target.value))}
            className="w-full"
          />
        </label>

        <button onClick={save} type="button" className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">
          Save settings
        </button>

        {saved && <p className="text-sm text-emerald-400">Saved.</p>}
      </div>
    </div>
  );
}
