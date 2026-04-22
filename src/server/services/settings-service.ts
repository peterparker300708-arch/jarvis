import { prisma } from "@/lib/prisma";

export async function getUserSettings(userId: string) {
  const [settings, avatar] = await Promise.all([
    prisma.userSettings.upsert({
      where: { userId },
      create: { userId },
      update: {},
    }),
    prisma.avatarPreference.upsert({
      where: { userId },
      create: { userId },
      update: {},
    }),
  ]);

  return { settings, avatar };
}

export async function updateUserSettings(
  userId: string,
  input: {
    model?: string;
    voiceEnabled?: boolean;
    avatarEnabled?: boolean;
    selectedVoice?: string;
    language?: string;
    animationIntensity?: number;
    avatarStyle?: string;
    avatarId?: string;
    emotionIntensity?: number;
  },
) {
  const settings = await prisma.userSettings.upsert({
    where: { userId },
    create: {
      userId,
      model: input.model,
      voiceEnabled: input.voiceEnabled,
      avatarEnabled: input.avatarEnabled,
      selectedVoice: input.selectedVoice,
      language: input.language,
      animationIntensity: input.animationIntensity,
    },
    update: {
      model: input.model,
      voiceEnabled: input.voiceEnabled,
      avatarEnabled: input.avatarEnabled,
      selectedVoice: input.selectedVoice,
      language: input.language,
      animationIntensity: input.animationIntensity,
    },
  });

  const avatar = await prisma.avatarPreference.upsert({
    where: { userId },
    create: {
      userId,
      avatarStyle: input.avatarStyle,
      avatarId: input.avatarId,
      emotionIntensity: input.emotionIntensity,
    },
    update: {
      avatarStyle: input.avatarStyle,
      avatarId: input.avatarId,
      emotionIntensity: input.emotionIntensity,
    },
  });

  return { settings, avatar };
}
