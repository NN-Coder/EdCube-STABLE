/**
 * Hyperdrive-aware Postgres client utility.
 *
 * In production (Cloudflare Workers), connections are routed through
 * Hyperdrive for low-latency connection pooling.
 *
 * In local development, falls back to POSTGRES_CONNECTION_STRING.
 *
 * Usage (Server Actions / Route Handlers only):
 *   import { getDb, releaseDb } from '@/utils/db';
 *   const client = await getDb(env);
 *   const result = await client.query('SELECT * FROM games LIMIT 10');
 *   releaseDb(client);
 */

import { Pool, PoolClient } from 'pg';

// Module-level pool singleton (persists across requests within a Worker isolate)
let _pool: Pool | null = null;

/**
 * Returns the connection string to use:
 * - Production: uses env.HYPERDRIVE.connectionString (Cloudflare Hyperdrive)
 * - Development: uses POSTGRES_CONNECTION_STRING env var
 */
function getConnectionString(env?: CloudflareEnv): string {
  // Workers runtime: use Hyperdrive binding
  if (env && 'HYPERDRIVE' in env && (env as { HYPERDRIVE?: Hyperdrive }).HYPERDRIVE) {
    return (env as { HYPERDRIVE: Hyperdrive }).HYPERDRIVE.connectionString;
  }

  // Local development fallback
  const devString = process.env.POSTGRES_CONNECTION_STRING;
  if (!devString) {
    throw new Error(
      'POSTGRES_CONNECTION_STRING is not set. ' +
      'Add it to .dev.vars for local development or verify the HYPERDRIVE binding is configured in wrangler.jsonc.'
    );
  }
  return devString;
}

/**
 * Returns a pg Pool, creating one if it doesn't exist.
 * Hyperdrive handles the actual connection pooling in production,
 * so we keep this pool small (max: 1) to avoid overhead.
 */
function getPool(env?: CloudflareEnv): Pool {
  if (!_pool) {
    const connectionString = getConnectionString(env);
    _pool = new Pool({
      connectionString,
      // Keep the pool minimal — Hyperdrive handles real pooling at the edge.
      // In dev, a single connection is sufficient.
      max: 1,
      // Disable SSL certificate verification for Hyperdrive
      // (Hyperdrive terminates TLS internally)
      ssl: env && 'HYPERDRIVE' in env ? false : { rejectUnauthorized: false },
    });

    _pool.on('error', (err) => {
      console.error('[db] Unexpected pool error:', err.message);
      _pool = null; // Reset so next call creates a fresh pool
    });
  }
  return _pool;
}

/**
 * Acquires a client from the pool.
 * Always call releaseDb(client) in a finally block.
 */
export async function getDb(env?: CloudflareEnv): Promise<PoolClient> {
  const pool = getPool(env);
  return pool.connect();
}

/**
 * Releases a client back to the pool.
 */
export function releaseDb(client: PoolClient): void {
  client.release();
}

/**
 * Convenience helper for one-shot queries.
 * Handles acquire/release automatically.
 *
 * Example:
 *   const rows = await query(env, 'SELECT id, name FROM games WHERE active = $1', [true]);
 */
export async function query<T extends object = Record<string, unknown>>(
  env: CloudflareEnv | undefined,
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const client = await getDb(env);
  try {
    const result = await client.query<T>(text, params);
    return result.rows;
  } finally {
    releaseDb(client);
  }
}
