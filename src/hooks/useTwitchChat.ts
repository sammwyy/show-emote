import { useEffect, useRef } from "react";
import tmi from "tmi.js";

// Global cache to store client instances
const twitchClients: { [key: string]: tmi.Client } = {};

export function useTwitchChat(channel: string, username = "anonymous") {
  const clientRef = useRef<tmi.Client | null>(null);

  useEffect(() => {
    const key = `${channel}-${username}`;

    // Initialize client if not present
    if (!twitchClients[key]) {
      const client = new tmi.Client({
        options: { debug: true },
        identity: username !== "anonymous" ? { username } : undefined,
        channels: [channel],
      });

      client.connect().catch(console.error);
      twitchClients[key] = client;
    }

    clientRef.current = twitchClients[key];

    return () => {
      // Do not disconnect to persist instance across renders
    };
  }, [channel, username]);

  return clientRef.current;
}
