"use client";

import { create } from "zustand";
import type { AssistantEmotion, AvatarState } from "@/types";

type AvatarStore = {
  state: AvatarState;
  emotion: AssistantEmotion;
  mouthOpen: number;
  intensity: number;
  speaking: boolean;
  setState: (state: AvatarState) => void;
  setEmotion: (emotion: AssistantEmotion) => void;
  setMouthOpen: (value: number) => void;
  setIntensity: (value: number) => void;
  setSpeaking: (value: boolean) => void;
};

export const useAvatarStore = create<AvatarStore>((set) => ({
  state: "idle",
  emotion: "friendly",
  mouthOpen: 0,
  intensity: 0.6,
  speaking: false,
  setState: (state) => set({ state }),
  setEmotion: (emotion) => set({ emotion }),
  setMouthOpen: (mouthOpen) => set({ mouthOpen }),
  setIntensity: (intensity) => set({ intensity }),
  setSpeaking: (speaking) => set({ speaking }),
}));
