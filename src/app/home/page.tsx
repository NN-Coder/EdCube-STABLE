"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getGameThumbnail } from "@/utils/r2";
import gamesData from "@/data/games.json";

interface Game {
  id: string;
  title: string;
  description: string;
}

const allGames: Game[] = gamesData as Game[];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const featuredGames = allGames.slice(0, 3);

  const filteredGames = allGames.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredGames.length);
    }, 5000);
  }, [featuredGames.length]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const moveSlide = (step: number) => {
    setCurrentSlide((prev) => (prev + step + featuredGames.length) % featuredGames.length);
    resetTimer();
  };

  return (
    <div className="flex flex-col items-center px-[5%] py-10">
      {/* Hero Banner */}
      <section className="text-center py-12">
        <h1
          className="neon-glow mb-2 font-heading font-bold"
          style={{ fontSize: "clamp(1.5rem, 5vw, 3rem)" }}
        >
          Welcome to EdCube!
        </h1>
        <p className="text-muted-foreground text-base">
          Be sure to join the{" "}
          <a
            href="https://discord.gg/WkhHFKq8Z3"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-accent transition-colors underline"
          >
            Discord
          </a>{" "}
          server for news and exclusive updates!
        </p>
      </section>

      {/* Featured Games Carousel */}
      <section className="w-full max-w-[1200px] mb-14">
        <h2 className="text-2xl font-heading font-bold text-primary uppercase tracking-[3px] text-center mb-10">
          Featured Games
        </h2>

        <div className="relative w-full h-[420px] max-sm:h-[280px] rounded-2xl overflow-hidden border-2 border-border bg-black">
          {/* Slides */}
          <div className="relative h-full w-full">
            {featuredGames.map((game, index) => (
              <div
                key={game.id}
                className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${getGameThumbnail(game.id)}')`,
                }}
              >
                <div className="flex justify-center items-end w-full h-full pb-12 z-[2]">
                  <div className="slide-info-box px-8 py-4 rounded-2xl text-center max-w-[350px] max-sm:max-w-[85%]">
                    <h3 className="text-2xl font-heading font-bold text-primary neon-glow m-0">
                      {game.title}
                    </h3>
                    <div className="slide-expandable">
                      <p className="text-sm mt-2 text-white/80">
                        {game.description || "Experience this amazing game. Try it now!"}
                      </p>
                      <Link
                        href={`/game/${game.id}`}
                        className="inline-flex items-center mt-3 px-5 py-2 rounded-full text-sm font-heading text-primary border border-border-glow-heavy bg-white/5 hover:bg-primary/10 hover:border-primary hover:shadow-[0_0_15px_rgba(0,255,204,0.4)] transition-all duration-400"
                      >
                        Play Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={() => moveSlide(-1)}
            className="absolute left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 border-2 border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,204,0.4)]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => moveSlide(1)}
            className="absolute right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 border-2 border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,204,0.4)]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* All Games Section */}
      <section className="w-full max-w-[1200px]">
        <h2 className="text-2xl font-heading font-bold text-primary uppercase tracking-[3px] text-center mb-10">
          All Games
        </h2>

        {/* Search Bar */}
        <div className="w-full flex justify-center mb-10">
          <div className="flex items-center bg-white/5 border-2 border-border-glow-heavy rounded-full px-6 py-3 w-full max-w-[500px] transition-all duration-300 focus-within:border-primary focus-within:shadow-[0_0_15px_rgba(0,255,204,0.4)]">
            <Search className="w-5 h-5 text-primary/40 mr-5 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-primary font-heading text-base w-full outline-none search-input"
            />
          </div>
        </div>

        {/* No Results */}
        {filteredGames.length === 0 && (
          <p className="text-center text-primary/70 mt-5">
            No games found matching your search.
          </p>
        )}

        {/* Game Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6 w-full">
          {filteredGames.map((game) => (
            <Link
              key={game.id}
              href={`/game/${game.id}`}
              className="game-card relative rounded-2xl transition-transform duration-300 hover:-translate-y-2 no-underline"
            >
              <div className="relative w-full aspect-square bg-white/[0.03] overflow-hidden rounded-[51px] border-[3px] border-border transition-all duration-400 hover:shadow-[0_0_25px_rgba(0,255,204,0.2)]">
                <Image
                  src={getGameThumbnail(game.id)}
                  alt={game.title}
                  fill
                  sizes="(max-width: 600px) 50vw, 200px"
                  className="game-card-thumb object-cover bg-[#222]"
                  unoptimized
                />
                <div className="game-card-overlay absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 flex items-end p-5">
                  <span className="text-primary text-lg font-semibold font-heading">
                    {game.title}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
