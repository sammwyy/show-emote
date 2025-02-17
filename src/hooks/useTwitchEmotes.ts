import { useEffect, useState } from "react";

import { Emote, EmoteProvider } from "@/types";

// Global cache for emotes
const emoteCache: { [key: string]: Emote[] } = {};

async function fetchEmotes(username: string, providers: EmoteProvider[]) {
  const response = await fetch(
    `https://open.staroverlay.com/twitch/emotes?username=${username}&providers=${providers.join(
      ","
    )}`
  );
  const json = await response.json();
  return json.emotes as Emote[];
}

export function useTwitchEmotes(username: string, providers: EmoteProvider[]) {
  const [emotes, setEmotes] = useState<Emote[]>([]);
  const cacheKey = `${username}-${providers.sort().join(",")}`;

  useEffect(() => {
    // Check if emotes are already cached
    if (emoteCache[cacheKey]) {
      setEmotes(emoteCache[cacheKey]);
      return;
    }

    // Fetch emotes if not in cache
    fetchEmotes(username, providers)
      .then((data) => {
        emoteCache[cacheKey] = data;
        setEmotes(data);
      })
      .catch(console.error);
  }, [username, providers, cacheKey]);

  return emotes;
}
