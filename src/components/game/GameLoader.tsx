"use client";

import * as React from "react";
import { Maximize, Minimize, Share2, Flag } from "lucide-react";

interface GameLoaderProps {
  gameName: string;
  gameUrl: string;
}

export function GameLoader({ gameName, gameUrl }: GameLoaderProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const toggleFullscreen = React.useCallback(() => {
    if (!document.fullscreenElement) {
      iframeRef.current?.requestFullscreen().catch((err) => {
        console.error(`Fullscreen Error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  React.useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "f") toggleFullscreen();
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [toggleFullscreen]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch {
        // Share cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      {/* Game Title */}
      <h1
        className="text-center font-heading font-bold uppercase tracking-[4px] neon-glow mb-8"
        style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
      >
        {gameName}
      </h1>

      {/* Game Frame Container */}
      <div className="w-full rounded-2xl overflow-hidden bg-black border-2 border-primary/20 neon-border-glow transition-shadow duration-500 focus-within:shadow-[0_0_40px_rgba(0,255,204,0.4)]">
        <iframe
          ref={iframeRef}
          src={gameUrl}
          className="w-full border-none block"
          style={{ aspectRatio: "16 / 9" }}
          title={gameName}
          allow="fullscreen; autoplay; encrypted-media; gyroscope; picture-in-picture"
        />

        {/* Options Bar */}
        <div className="bg-[rgba(15,15,25,1)] px-6 py-3 flex justify-end gap-6 border-t-2 border-primary/20">
          <button
            onClick={toggleFullscreen}
            title="Fullscreen (F)"
            className="flex flex-col items-center gap-1 text-primary bg-transparent border-none p-0 font-heading transition-all duration-300 hover:text-accent hover:-translate-y-0.5"
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleShare}
            title="Share"
            className="flex flex-col items-center gap-1 text-primary bg-transparent border-none p-0 font-heading transition-all duration-300 hover:text-accent hover:-translate-y-0.5"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <a
            href="https://github.com/NN-Coder/EdCube-STABLE/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            title="Report Bug"
            className="flex flex-col items-center gap-1 text-primary transition-all duration-300 hover:text-accent hover:-translate-y-0.5"
          >
            <Flag className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
