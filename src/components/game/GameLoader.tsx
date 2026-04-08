"use client"
import * as React from "react"
import { ThumbsUp, ThumbsDown, Share2, Bug, Maximize, Minimize } from "lucide-react"

interface GameLoaderProps {
  gameName: string;
  gameUrl: string;
}

export function GameLoader({ gameName, gameUrl }: GameLoaderProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (iframeRef.current?.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  React.useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto border border-border/50 rounded-xl overflow-hidden shadow-2xl bg-black/50">
      <div className="relative w-full aspect-video bg-black/80 flex items-center justify-center">
        <iframe
          ref={iframeRef}
          src={gameUrl}
          className="w-full h-full border-none"
          title={gameName}
          allow="fullscreen; autoplay; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
      
      {/* Options Bar */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-card border-t border-border gap-4">
        <h1 className="text-xl font-bold text-foreground">{gameName}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md border border-border hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors">
            <ThumbsUp className="w-4 h-4" /> <span className="hidden sm:inline">Like</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md border border-border hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors">
            <ThumbsDown className="w-4 h-4" /> <span className="hidden sm:inline">Dislike</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md border border-border hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors">
            <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md border border-border hover:bg-destructive hover:text-destructive-foreground text-muted-foreground transition-colors">
            <Bug className="w-4 h-4" /> <span className="hidden sm:inline">Report Bug</span>
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors ml-auto sm:ml-2"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
