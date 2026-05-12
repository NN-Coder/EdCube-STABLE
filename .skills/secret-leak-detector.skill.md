# Secret Leak Detector Skill

## Overview
Automated scanning and prevention of secret leaks in code, configuration files, and environment variables.

## Capabilities
- Scan `.env`, `.env.local`, `wrangler.jsonc`, and `next.config.ts` for patterns matching API keys, secrets, and private keys.
- Identify common prefixes like `sb_publishable_`, `ghp_`, `sk_test_`, etc.
- Verify that sensitive files are listed in `.gitignore`.

## Rules
- SCAN before every commit.
- BLOCK any process that attempts to commit a plaintext secret.
- RECOMMEND the use of `dotenvx` for encrypted secrets where possible.
- NOTIFY the user immediately if a potential leak is detected.

## Patterns to Watch
- `NEXT_PUBLIC_` (Publicly exposed in Next.js)
- `SUPABASE_SERVICE_ROLE_KEY` (EXTREMELY SENSITIVE)
- `CLOUDFLARE_API_TOKEN`
- `GITHUB_TOKEN`
