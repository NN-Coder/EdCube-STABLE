#!/usr/bin/env node
/**
 * deploy.mjs — EdCube deploy helper
 *
 * Loads .dev.vars into process.env BEFORE calling opennextjs-cloudflare deploy,
 * so that CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE is available
 * to wrangler's getPlatformProxy (which explicitly disables envFiles loading).
 *
 * Usage: node scripts/deploy.mjs
 */

import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const devVarsPath = resolve(__dirname, '../.dev.vars');

// Parse .dev.vars and inject into process.env
try {
  const content = readFileSync(devVarsPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
  console.log('✅ Loaded .dev.vars into environment');
} catch {
  console.warn('⚠️  .dev.vars not found — skipping (CI env vars should be set externally)');
}

// Run the deploy
try {
  execSync('npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy', {
    stdio: 'inherit',
    env: process.env,
  });
} catch (err) {
  process.exit(err.status ?? 1);
}
