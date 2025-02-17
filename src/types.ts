export type EmoteProvider = "7tv" | "twitch" | "bttv" | "ffz";
export type EmoteAnimation = "fade" | "pop";
export type EmoteMovement = "static" | "dvd";
export type EmoteCanUse = "any" | "mod" | "vip+mod" | "vip+mod+sub";

export interface EmoteSettings {
  username?: string;
  providers?: EmoteProvider[];
  canUse?: EmoteCanUse;
  animation?: EmoteAnimation;
  movement?: EmoteMovement;
  command?: string;
  maxEmotes?: number;
  duration?: number;
}

export interface Emote {
  code: string;
  id: string;
  owner: string;
  type: EmoteProvider;
  url: {
    low: string;
    mid?: string;
    high?: string;
  };
}
