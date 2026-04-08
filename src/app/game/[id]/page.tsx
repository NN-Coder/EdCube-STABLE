import { GameLoader } from "@/components/game/GameLoader";
import { getGameUrl } from "@/utils/r2";

type Params = Promise<{ id: string }>

export default async function GamePage(props: { params: Params }) {
  const params = await props.params;
  const gameId = params.id;
  
  // Format game title simple for display
  const title = gameId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const gameUrl = getGameUrl(gameId);

  return (
    <div className="container mx-auto py-12 px-4 md:px-8 flex flex-col gap-8">
      <GameLoader gameName={title} gameUrl={gameUrl} />
      
      {/* Recommended row placeholder */}
      <section className="w-full max-w-5xl mx-auto mt-8">
        <h3 className="text-xl font-semibold mb-4 text-foreground">Recommended Games</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className="aspect-square bg-card rounded-xl border border-border animate-pulse"></div>
          ))}
        </div>
      </section>
    </div>
  )
}
