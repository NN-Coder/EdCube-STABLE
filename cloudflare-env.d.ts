// Generated type definitions for Cloudflare Worker bindings.
// Regenerate with: npm run cf-typegen

interface CloudflareEnv {
  ASSETS: Fetcher;
  WORKER_SELF_REFERENCE: Fetcher;
  NEXT_INC_CACHE_R2_BUCKET: R2Bucket;
  GAME_ASSETS_BUCKET: R2Bucket;
  /**
   * Hyperdrive binding for optimized Postgres connections.
   * Provides a managed connection pool at the edge.
   * Configured in wrangler.jsonc under [[hyperdrive]].
   */
  HYPERDRIVE: Hyperdrive;
}
