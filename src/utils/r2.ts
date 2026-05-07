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
 *         ... (other game files)
 *     game_images/
 *       {game-slug}.jpg
 *     avatars/
 *       {user-id}.jpg
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
 * @example getGameThumbnail("basket-random") → "/api/r2/game_images/basket-random.jpg"
 */
export const getGameThumbnail = (urlPath: string): string => {
  return `/api/r2/game_images/${urlPath}.jpg`;
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

/**
 * Returns the internal API route URL for a user's avatar image.
 *
 * @example getAvatarUrl("abc-123") → "/api/r2/avatars/abc-123.jpg"
 */
export const getAvatarUrl = (userId: string): string => {
  return `/api/r2/avatars/${userId}.jpg`;
};
