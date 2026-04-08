"use client";

import { MessageSquareOff } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="container mx-auto py-24 px-4 text-center max-w-2xl relative z-10 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full">
        <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-8 border border-border relative overflow-hidden">
          <MessageSquareOff className="w-10 h-10 text-muted-foreground" />
        </div>

        <h1 className="text-4xl md:text-5xl font-heading font-black mb-4 tracking-wide text-foreground">
          GLOBAL <span className="text-primary">COMMS</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-10 font-light max-w-md mx-auto">
          Establish real-time connections with other operatives across the matrix.
        </p>

        <div className="w-full aspect-[21/9] bg-card border border-border rounded-2xl flex flex-col items-center justify-center relative">
          <div className="absolute top-4 left-4 flex gap-2 items-center">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Status: Offline</span>
          </div>
          
          <span className="text-muted-foreground font-bold uppercase tracking-[0.3em] font-heading text-xl md:text-2xl mt-4">
            {"// Comms Link Severed"}
          </span>
          <p className="text-xs font-mono text-muted-foreground/60 mt-2">AWAITING SUPABASE REALTIME PROTOCOL</p>
        </div>
      </div>
    </div>
  )
}
