/**
 * R2 Asset Utilities
 *
 * Generates internal API route URLs that proxy content from the R2 `assets` bucket
 * via Cloudflare Worker bindings. No public R2 URLs are exposed.
 *
 * R2 Bucket Structure:
 *   assets/
 *     game_sources/
 *       {game-slug}/
 *         index.html
 *         thumbnail.jpg (optional)
 *         ... (other game files)
 */

/**
 * Returns the internal API route URL for a game's entry point.
 * The game iframe should load this URL.
 *
 * @example getGameUrl("basket-random") → "/api/r2/game_sources/basket-random/index.html"
 */
export const getGameUrl = (urlPath: string): string => {
  return `/api/r2/game_sources/${urlPath}/index.html`;
};

/**
 * Returns the internal API route URL for a game's thumbnail image.
 *
 * @example getGameThumbnail("basket-random") → "/api/r2/game_sources/basket-random/thumbnail.jpg"
 */
export const getGameThumbnail = (urlPath: string): string => {
  return `/api/r2/game_sources/${urlPath}/thumbnail.jpg`;
};

/**
 * Returns the base internal API route URL for a game's asset directory.
 * Useful for constructing custom asset paths.
 *
 * @example getGameAssetsBase("basket-random") → "/api/r2/game_sources/basket-random"
 */
export const getGameAssetsBase = (urlPath: string): string => {
  return `/api/r2/game_sources/${urlPath}`;
};
