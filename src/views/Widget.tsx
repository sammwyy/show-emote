import EmoteRenderer from "@/components/emote/emote-renderer";
import { useSettings } from "@/hooks/useSettings";
import { useTwitchChat } from "@/hooks/useTwitchChat";
import { useTwitchEmotes } from "@/hooks/useTwitchEmotes";
import { useEffect, useRef, useState } from "react";
import { Emote } from "../types";

interface EmoteDisplay {
  emote: Emote;
  id: string;
}

export default function Widget() {
  const [displayedEmotes, setDisplayedEmotes] = useState<EmoteDisplay[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const userCooldowns = useRef<Map<string, number>>(new Map());
  const lastGlobalUse = useRef<number>(0);
  const settings = useSettings();
  const emotes = useTwitchEmotes(settings.username, settings.providers);
  const chat = useTwitchChat(settings.username);

  useEffect(() => {
    chat?.on("message", (_channel, tags, message, self) => {
      if (self) return;

      // Check permissions
      const isMod = tags.mod;
      const isVip = tags.badges?.vip;
      const isSub = tags.subscriber;

      if (settings.canUse === "mod" && !isMod) return;
      if (settings.canUse === "vip+mod" && !isMod && !isVip) return;
      if (settings.canUse === "vip+mod+sub" && !isMod && !isVip && !isSub)
        return;

      const command = settings.command === "" ? "!showemote" : settings.command;
      if (!message.startsWith(command.trim())) return;

      const isEmptyCommand = command.trim() === "";
      const emoteName = message.split(" ")[isEmptyCommand ? 0 : 1]?.trim();

      if (!emoteName) return;

      let canBypass = false;
      if (settings.bypassCooldownBy !== "none") {
        if (settings.bypassCooldownBy === "mod" && isMod) canBypass = true;
        else if (settings.bypassCooldownBy === "vip+mod" && (isMod || isVip)) canBypass = true;
        else if (settings.bypassCooldownBy === "vip+mod+sub" && (isMod || isVip || isSub)) canBypass = true;
      }

      if (!canBypass) {
        const now = Date.now();
        // Check global cooldown
        if (now - lastGlobalUse.current < (settings.globalCooldown || 0)) {
          return;
        }

        // Check user cooldown
        if (tags.username) {
          const lastUsed = userCooldowns.current.get(tags.username) || 0;
          if (now - lastUsed < (settings.cooldown || 1000)) {
            return;
          }
          userCooldowns.current.set(tags.username, now);
        }

        lastGlobalUse.current = now;
      }

      // Check local emotes first
      let emote = emotes.find((e) => e.code === emoteName);

      // Check Twitch emotes from tags
      if (!emote && tags.emotes) {
        const emoteId = Object.keys(tags.emotes)[0];
        if (emoteId) {
          emote = {
            id: emoteId,
            code: emoteName,
            owner: "@",
            url: {
              low: `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/3.0`,
            },
            type: "twitch",
          };
        }
      }

      if (emote) {
        const id = Math.random().toString(36);
        setDisplayedEmotes((prev) => {
          if (prev.length < settings.maxEmotes) {
            // Remove emote after animation
            setTimeout(() => {
              setDisplayedEmotes((prev) => prev.filter((e) => e.id !== id));
            }, settings.duration * 1000);

            return [...prev, { emote, id }];
          }

          return prev;
        });
      }
    });

    return () => {
      chat?.removeAllListeners();
    };
  }, [chat, settings, emotes]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
    >
      {displayedEmotes.map(({ emote, id }) => (
        <EmoteRenderer
          key={id}
          emote={emote}
          animation={settings.animation}
          movement={settings.movement}
          duration={settings.duration}
          containerRef={containerRef}
        />
      ))}
    </div>
  );
}
