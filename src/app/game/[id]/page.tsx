import Link from "next/link";
import Image from "next/image";
import { GameLoader } from "@/components/game/GameLoader";
import { getGameUrl, getGameThumbnail } from "@/utils/r2";
import gamesData from "@/data/games.json";

type Params = Promise<{ id: string }>;

interface Game {
  id: string;
  title: string;
  description: string;
}

const allGames: Game[] = gamesData as Game[];

export default async function GamePage(props: { params: Params }) {
  const params = await props.params;
  const gameId = params.id;

  // Find game in catalog
  const gameData = allGames.find((g) => g.id === gameId);
  const title = gameData
    ? gameData.title
    : gameId
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

  const gameUrl = getGameUrl(gameId);

  // Get 3 random recommended games (excluding current)
  const recommended = allGames
    .filter((g) => g.id !== gameId)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <div className="flex flex-col items-center px-[5%] py-10">
      <GameLoader gameName={title} gameUrl={gameUrl} />

      {/* Recommended Games */}
      <section className="w-full max-w-[1200px] mt-24">
        <h2 className="text-2xl font-heading font-bold text-primary uppercase tracking-[3px] text-center mb-10">
          Recommended Games
        </h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6 w-full">
          {recommended.map((game) => (
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

      {/* Back to Home */}
      <Link href="/home" className="mt-20 mb-5 no-underline">
        <button className="px-10 py-4 text-lg bg-transparent text-primary border-2 border-primary rounded-full font-heading uppercase tracking-wider transition-all duration-300 hover:bg-primary hover:text-background hover:shadow-[0_0_15px_rgba(0,255,204,0.4)]">
          Back to Home
        </button>
      </Link>
    </div>
  );
}
