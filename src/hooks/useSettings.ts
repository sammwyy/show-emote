import {
  EmoteAnimation,
  EmoteCanUse,
  EmoteMovement,
  EmoteProvider,
  EmoteSettings,
} from "@/types";

export const defaultSettings: Required<EmoteSettings> = {
  username: "",
  providers: ["7tv", "twitch", "bttv", "ffz"],
  canUse: "any",
  animation: "fade",
  movement: "static",
  command: "!showemote",
  maxEmotes: 1,
  duration: 5,
};

export function encodeSettings(settings: Partial<EmoteSettings>): string {
  const mergedSettings = { ...defaultSettings, ...settings };
  return btoa(JSON.stringify(mergedSettings));
}

function decodeSettings(encoded: string): Required<EmoteSettings> {
  try {
    return { ...defaultSettings, ...JSON.parse(atob(encoded)) };
  } catch {
    return defaultSettings;
  }
}

function parseLegacySettings(): Required<EmoteSettings> {
  const params = new URLSearchParams(window.location.search);

  const username = params.get("username") || "";
  const providers = (params.get("providers") || "7tv,twitch,bttv,ffz").split(
    ","
  ) as EmoteProvider[];
  const canUse = (params.get("canUse") || "any") as EmoteCanUse;
  const animation = (params.get("animation") || "fade") as EmoteAnimation;
  const movement = (params.get("movement") || "static") as EmoteMovement;
  const command = params.get("command") || "!showemote";
  const maxEmotes = parseInt(params.get("maxEmotes") || "1", 10);
  const duration = parseInt(params.get("duration") || "5", 10);

  return {
    username,
    providers,
    canUse,
    animation,
    movement,
    command,
    maxEmotes: isNaN(maxEmotes) ? 1 : maxEmotes,
    duration: isNaN(duration) ? 5 : duration,
  };
}

export const useSettings = () => {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("settings");

  if (encoded) {
    return decodeSettings(encoded);
  }

  return parseLegacySettings();
};
