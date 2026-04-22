"use client";

import { Canvas } from "@react-three/fiber";
import { AvatarCharacter } from "@/components/avatar/avatar-character";
import { useAvatarStore } from "@/store/avatar-store";

export function AvatarPanel({ enabled }: { enabled: boolean }) {
  const { state, emotion } = useAvatarStore();

  if (!enabled) {
    return (
      <aside className="hidden w-80 border-l border-zinc-800 bg-zinc-950 p-4 lg:block">
        <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-zinc-700 text-zinc-500">
          Avatar disabled
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden w-80 border-l border-zinc-800 bg-zinc-950 p-4 lg:block">
      <div className="h-full overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <Canvas camera={{ position: [0, 0.3, 3.8], fov: 50 }}>
          <ambientLight intensity={1.3} />
          <directionalLight position={[2, 2, 2]} intensity={1.2} />
          <AvatarCharacter />
        </Canvas>

        <div className="border-t border-zinc-800 p-3 text-xs text-zinc-300">
          <div className="flex items-center justify-between">
            <span>State</span>
            <span className="rounded bg-zinc-800 px-2 py-1">{state}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span>Emotion</span>
            <span className="rounded bg-zinc-800 px-2 py-1">{emotion}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
