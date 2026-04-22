"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group, Mesh, Color } from "three";
import { useAvatarStore } from "@/store/avatar-store";

const emotionColors: Record<string, string> = {
  friendly: "#6d6cff",
  excited: "#c46dff",
  calm: "#53c2ff",
  serious: "#7b7b8f",
  confused: "#ff9f6d",
  happy: "#ffd36d",
  apologetic: "#79c08d",
  thinking: "#6da3ff",
};

export function AvatarCharacter() {
  const group = useRef<Group>(null);
  const mouth = useRef<Mesh>(null);
  const leftEye = useRef<Mesh>(null);
  const rightEye = useRef<Mesh>(null);

  const { mouthOpen, state, emotion, intensity } = useAvatarStore();
  const color = useMemo(() => new Color(emotionColors[emotion] ?? emotionColors.friendly), [emotion]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const idleWave = Math.sin(t * 1.4) * 0.04;

    if (group.current) {
      group.current.rotation.y = idleWave * (0.8 + intensity);
      group.current.position.y = Math.sin(t * 1.8) * 0.03;
    }

    if (mouth.current) {
      const talk = state === "speaking" ? Math.max(0.1, mouthOpen) : 0.05;
      mouth.current.scale.y += (talk - mouth.current.scale.y) * 0.22;
    }

    const blink = Math.sin(t * 2.2) > 0.99 ? 0.08 : 0.2;
    if (leftEye.current) leftEye.current.scale.y = blink;
    if (rightEye.current) rightEye.current.scale.y = blink;
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.25} />
      </mesh>

      <mesh ref={leftEye} position={[-0.35, 0.2, 0.85]}>
        <sphereGeometry args={[0.08, 24, 24]} />
        <meshStandardMaterial color="#0b0b14" />
      </mesh>
      <mesh ref={rightEye} position={[0.35, 0.2, 0.85]}>
        <sphereGeometry args={[0.08, 24, 24]} />
        <meshStandardMaterial color="#0b0b14" />
      </mesh>

      <mesh ref={mouth} position={[0, -0.35, 0.86]} scale={[1, 0.05, 1]}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial color="#101019" />
      </mesh>

      <mesh position={[0, -1.3, 0]} scale={[1.6, 0.6, 1]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial color={color.clone().multiplyScalar(0.8)} />
      </mesh>
    </group>
  );
}
