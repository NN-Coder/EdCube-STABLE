"use client";

import { SendIcon } from "lucide-react";

export default function RequestsPage() {
  return (
    <div className="container mx-auto py-24 px-4 text-center max-w-2xl relative z-10 flex flex-col items-center min-h-[80vh]">
      <div className="w-full">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-muted text-foreground mb-6 border border-border">
          <SendIcon className="w-8 h-8 ml={-2} mt={-1}" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-heading font-black mb-4 tracking-wide text-foreground">
          DATA <span className="text-primary">REQUEST</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-10 font-light max-w-lg mx-auto">
          Missing an essential training module? Submit a request to the admins.
        </p>

        <form className="bg-card border border-border rounded-2xl p-8 text-left space-y-6">
          <div className="space-y-2 group">
            <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase group-focus-within:text-primary transition-colors">Target Application Title</label>
            <input 
              className="flex h-12 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm text-foreground transition-all duration-300 placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary" 
              placeholder="e.g. Super Smash Flash 2" 
            />
          </div>
          <div className="space-y-2 group">
            <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase group-focus-within:text-primary transition-colors">Source Vector (URL) - Optional</label>
            <input 
              className="flex h-12 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm text-foreground transition-all duration-300 placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary" 
              placeholder="HTTPS://..." 
            />
          </div>
          
          <button 
            className="w-full flex items-center justify-center rounded-lg text-sm font-bold tracking-widest uppercase transition-all bg-primary text-primary-foreground h-12 mt-8 hover:bg-primary/90" 
            type="button"
          >
            Transmit Request
          </button>
        </form>
      </div>
    </div>
  )
}
