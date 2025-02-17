import { Coffee, Copy, Settings, Star, Twitch } from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import Select from "@/components/ui/select";
import { encodeSettings } from "@/hooks/useSettings";
import {
  EmoteAnimation,
  EmoteCanUse,
  EmoteMovement,
  EmoteProvider,
  EmoteSettings,
} from "../types";

function isString(value: unknown): value is string {
  return typeof value === "string" && value !== "";
}

export default function Dashboard() {
  const [settings, setSettings] = useState<Partial<EmoteSettings>>({});
  const [copied, setCopied] = useState(false);
  const enabled = isString(settings.username);

  const widgetUrl = `${window.location.origin}/widget?settings=${encodeSettings(
    settings
  )}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(widgetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-twitch-gradient text-gray-100 pt-2">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-purple-500 rounded-lg shadow-lg shadow-purple-500/20">
            <Twitch className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
            !ShowEmote
          </h1>
        </div>

        <div className="relative acrylic rounded-lg overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-purple-600"></div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold">Widget Settings</h2>
            </div>

            {/* Settings */}
            <div className="space-y-6">
              {/* First */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Channel Username</Label>

                  <Input
                    type="text"
                    value={settings.username || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, username: e.target.value })
                    }
                    placeholder="Enter your Twitch username"
                  />
                </div>

                <div>
                  <Label>Command Trigger</Label>
                  <Input
                    type="text"
                    value={settings.command}
                    onChange={(e) =>
                      setSettings({ ...settings, command: e.target.value })
                    }
                    placeholder="!showemote (leave space for none)"
                  />
                </div>
              </div>

              {/* Second */}
              <div>
                <Label>Emote Providers</Label>

                <div className="grid grid-cols-4 gap-3">
                  {["7tv", "twitch", "bettertv", "ffz"].map((provider) => (
                    <Checkbox
                      key={provider}
                      checked={
                        settings.providers?.includes(
                          provider as EmoteProvider
                        ) ?? true
                      }
                      onChange={(e) => {
                        const newProviders = e.target.checked
                          ? [...(settings.providers || []), provider]
                          : (settings.providers || []).filter(
                              (p) => p !== provider
                            );
                        setSettings({
                          ...settings,
                          providers: newProviders as EmoteProvider[],
                        });
                      }}
                    >
                      {provider}
                    </Checkbox>
                  ))}
                </div>
              </div>

              {/* Third */}
              <div className="grid grid-cols-3 gap-6">
                {/* settings.canUse */}
                <div>
                  <Label>Who Can Use</Label>

                  <Select
                    value={settings.canUse || "any"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        canUse: e.target.value as EmoteCanUse,
                      })
                    }
                  >
                    <option value="any">Anyone</option>
                    <option value="mod">Moderators Only</option>
                    <option value="vip+mod">VIPs and Moderators</option>
                    <option value="vip+mod+sub">
                      VIPs, Moderators and Subscribers
                    </option>
                  </Select>
                </div>

                {/* settings.animation */}
                <div>
                  <Label>Animation Style</Label>

                  <Select
                    value={settings.animation || "fade"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        animation: e.target.value as EmoteAnimation,
                      })
                    }
                  >
                    <option value="fade">Fade</option>
                    <option value="pop">Pop</option>
                  </Select>
                </div>

                {/* settings.movement */}
                <div>
                  <Label>Movement Pattern</Label>

                  <Select
                    value={settings.movement || "static"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        movement: e.target.value as EmoteMovement,
                      })
                    }
                  >
                    <option value="static">Static</option>
                    <option value="dvd">DVD Bounce</option>
                  </Select>
                </div>
              </div>

              {/* Fourth */}
              <div className="grid grid-cols-2 gap-6">
                {/* settings.maxEmotes */}
                <div>
                  <Label>Max Emotes on screen</Label>

                  <Input
                    type="number"
                    placeholder="1"
                    value={settings.maxEmotes}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const maxEmotes = parseInt(raw);
                      if (isNaN(maxEmotes) || maxEmotes < 0) return;

                      setSettings({
                        ...settings,
                        maxEmotes,
                      });
                    }}
                  />
                </div>

                {/* settings.duration */}
                <div>
                  <Label>Duration on screen (Secs)</Label>

                  <Input
                    type="number"
                    placeholder="5"
                    value={settings.duration}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const duration = parseInt(raw);
                      if (isNaN(duration) || duration < 0) return;

                      setSettings({
                        ...settings,
                        duration,
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-300">Widget URL</p>
                <Button onClick={copyUrl} disabled={!enabled}>
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy URL"}
                </Button>
              </div>
              <p className="text-sm text-gray-400 break-all font-mono p-3 bg-zinc-900 rounded border border-zinc-800">
                {widgetUrl}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://ko-fi.com/sammwy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors"
          >
            <Coffee className="w-4 h-4" />
            <span>Support the developer (sammwy) on Ko-fi</span>
          </a>
        </div>

        <div className="mt-1 text-center">
          <a
            href="https://staroverlay.com/?utm_source=showemote"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors"
          >
            <Star className="w-4 h-4" />
            <span>Powered by StarOverlay (Coming soon)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
