import { Ghost } from "lucide-react";

export default function ProxyPage() {
  return (
    <div className="container mx-auto py-24 px-4 text-center max-w-2xl flex-col flex items-center min-h-[80vh]">
      <div className="w-full">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-accent/10 text-accent mb-6">
          <Ghost className="w-8 h-8" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-wide text-foreground">
          STEALTH <span className="text-accent">PROXY</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-10 font-light max-w-lg mx-auto">
          Experimental stealth navigation module. Bypass filters and leave no trace. Slated for system update v5.3.
        </p>
        
        <div className="bg-card border border-border rounded-xl p-8 text-left">
          <div className="space-y-4">
            <div className="space-y-2 group">
              <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase group-focus-within:text-accent transition-colors">Target URL</label>
              <input 
                disabled 
                placeholder="HTTPS://..." 
                className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground/50 opacity-50 cursor-not-allowed" 
              />
            </div>
            
            <button 
              disabled 
              className="w-full flex items-center justify-center rounded-md text-sm font-bold tracking-widest uppercase bg-accent text-accent-foreground h-12 mt-6 opacity-50 cursor-not-allowed"
            >
              Initiate Override
            </button>
          </div>
          
          <div className="mt-6 flex items-start gap-2 text-xs text-muted-foreground font-mono">
            <span>&gt;</span>
            <p>WARNING: Module currently offline. Awaiting Ultraviolet / Scramjet integration.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
