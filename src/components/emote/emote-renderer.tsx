import { useEffect, useState } from "react";

import { Emote, EmoteAnimation, EmoteMovement } from "@/types";

// Utilities
const EMOTE_SIZE = 64;

const animationClassesIn = {
  fade: "animate-fade-in",
  pop: "animate-pop-in",
};

const animationClassesOut = {
  fade: "animate-fade-out",
  pop: "animate-pop-out",
};

function getEmoteURL(emote: Emote) {
  return emote.url.high || emote.url.mid || emote.url.low;
}

type Vec2 = { x: number; y: number };

type Display = {
  position: Vec2;
  direction: Vec2;
};

// Component
export interface EmoteRendererProps {
  emote: Emote;
  animation: EmoteAnimation;
  movement: EmoteMovement;
  containerRef: React.RefObject<HTMLDivElement>;
  embedded?: boolean;
  duration: number;
}

export default function EmoteRenderer({
  emote,
  animation,
  movement,
  containerRef,
  embedded,
  duration,
}: EmoteRendererProps) {
  const [isIn, setIsIn] = useState(true);
  const animationClass = isIn
    ? animationClassesIn[animation]
    : animationClassesOut[animation];
  const [display, setDisplay] = useState<Display>({
    position: { x: 0, y: 0 },
    direction: { x: 0, y: 0 },
  });

  useEffect(() => {
    setIsIn(true);
    const timeout = setTimeout(() => setIsIn(false), duration * 1000 - 500);
    return () => clearTimeout(timeout);
  }, [duration]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const x = Math.random() * (containerWidth - EMOTE_SIZE);
    const y = Math.random() * (containerHeight - EMOTE_SIZE);

    let direction: Vec2 = { x: 0, y: 0 };

    if (movement === "dvd") {
      direction = {
        x: Math.random() > 0.5 ? 2 : -2,
        y: Math.random() > 0.5 ? 2 : -2,
      };
    }

    setDisplay({
      position: { x, y },
      direction,
    });
  }, [movement, containerRef]);

  useEffect(() => {
    if (movement !== "dvd") return;

    const interval = setInterval(() => {
      setDisplay((prev) => {
        if (!containerRef.current) return prev;

        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        let nextX = prev.position.x + prev.direction.x;
        let nextY = prev.position.y + prev.direction.y;
        const nextDir = { ...prev.direction };

        if (nextX <= 0 || nextX + EMOTE_SIZE >= containerWidth) {
          nextDir.x *= -1;
          nextX = Math.max(0, Math.min(nextX, containerWidth - EMOTE_SIZE));
        }

        if (nextY <= 0 || nextY + EMOTE_SIZE >= containerHeight) {
          nextDir.y *= -1;
          nextY = Math.max(0, Math.min(nextY, containerHeight - EMOTE_SIZE));
        }

        return {
          position: { x: nextX, y: nextY },
          direction: nextDir,
        };
      });
    }, 16);

    return () => clearInterval(interval);
  }, [containerRef, movement]);

  return (
    <div
      className={`${
        embedded ? "w-full h-full" : "absolute w-screen h-screen"
      } transition-opacity`}
      style={{
        left: `${display.position.x}px`,
        top: `${display.position.y}px`,
      }}
    >
      <img
        src={getEmoteURL(emote)}
        alt={emote.code}
        className={animationClass}
        style={{ height: `${EMOTE_SIZE}px` }}
      />
    </div>
  );
}
