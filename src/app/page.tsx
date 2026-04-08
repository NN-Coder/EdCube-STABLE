"use client";

import Link from "next/link";
import { Play, Star, TrendingUp, Clock } from "lucide-react";

// Placeholder data since we don't have Supabase hooked up to the games UI yet.
const MOCK_GAMES = [
  { id: "fire-boy-water-girl", title: "Fireboy & Watergirl" },
  { id: "hollow-knight", title: "Hollow Knight" },
  { id: "retro-bowl", title: "Retro Bowl" },
  { id: "run-3", title: "Run 3" },
  { id: "slope", title: "Slope" },
  { id: "smash-karts", title: "Smash Karts" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-24 pt-8">
      {/* Hero Banner */}
      <section className="w-full px-4 md:px-8 text-center relative z-10 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground mb-6">
            <Star className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wide uppercase">New Era of Gaming</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6 text-foreground leading-tight">
            Level Up Your <br />
            <span className="text-primary">
              Experience
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto font-light">
            Immerse yourself in EdCube’s unblocked gaming universe. Pure gameplay, zero distractions, absolute performance.
          </p>
          
          <div>
            <Link 
              href="#library" 
              className="inline-flex items-center justify-center h-12 px-8 py-3 rounded-md text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors uppercase tracking-widest"
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              Start Playing
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="container mx-auto px-4 md:px-8 z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-heading font-bold flex items-center gap-3 text-foreground">
            <TrendingUp className="text-accent" /> Trending Now
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_GAMES.slice(0, 3).map((game) => (
            <div key={game.id}>
              <Link 
                href={`/game/${game.id}`} 
                className="group block relative overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary"
              >
                <div className="aspect-square w-full bg-muted flex items-center justify-center relative z-0">
                  <span className="text-5xl font-black text-muted-foreground/30 uppercase tracking-widest">{game.title.slice(0,2)}</span>
                </div>
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end bg-gradient-to-t from-background/90 to-transparent">
                  <h3 className="font-heading font-bold text-2xl text-foreground group-hover:text-primary transition-colors">{game.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 fill-current" /> Play Now
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Game Library Showcase */}
      <section id="library" className="container mx-auto px-4 md:px-8 z-10 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-heading font-bold flex items-center gap-3 text-foreground">
            <Clock className="text-primary" /> All Games
          </h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {MOCK_GAMES.map((game) => (
            <div key={game.id}>
              <Link 
                href={`/game/${game.id}`} 
                className="group block overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary"
              >
                <div className="aspect-square w-full flex items-center justify-center bg-muted relative">
                  <div className="w-full h-full flex items-center justify-center text-4xl font-black text-muted-foreground/20 uppercase transition-transform group-hover:scale-105">
                    {game.title.slice(0, 2)}
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                    <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center bg-primary text-primary-foreground">
                      <Play className="w-5 h-5 fill-current ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-border bg-card">
                  <h3 className="font-semibold text-sm line-clamp-1 text-foreground group-hover:text-primary transition-colors">{game.title}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
