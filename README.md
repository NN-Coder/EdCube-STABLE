# EdCube

EdCube is a Next.js 16 gaming platform focused on fast access to browser games, account-based personalization, and edge-first delivery on Cloudflare.

## Highlights

- 🎮 Dynamic game library with featured carousel and searchable catalog
- ☁️ Cloudflare R2-backed game assets served through internal API proxy routes
- 🔐 Supabase authentication (email/password + OAuth) and account management
- ⚡ Edge-ready deployment with OpenNext for Cloudflare Workers
- 📜 Built-in legal pages and DMCA request flow

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript
- **Styling/UI:** Tailwind CSS v4, shadcn/ui, lucide-react
- **Auth & Data:** Supabase (Auth + Postgres)
- **Infrastructure:** Cloudflare Workers, R2, Hyperdrive, Wrangler
- **Build/Deploy:** OpenNext Cloudflare adapter

## Quick Start

### 1) Prerequisites

- Node.js 20+
- npm
- Cloudflare + Supabase accounts (for full local parity and deployment)

### 2) Install dependencies

```bash
npm ci
```

### 3) Configure environment

Create a `.dev.vars` file in the repository root for local runtime values (or set equivalent environment variables in your shell/CI):

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
POSTGRES_CONNECTION_STRING=your_postgres_connection_string
CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=******localhost:5432/dummy
```

> `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are also supported as fallback key names.

### 4) Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start local Next.js development server |
| `npm run build` | Build production app |
| `npm run start` | Start production server locally |
| `npm run lint` | Run ESLint |
| `npm run preview` | Build and preview with OpenNext + Cloudflare runtime |
| `npm run upload` | Build and upload OpenNext bundle |
| `npm run deploy` | Run project deploy helper (`scripts/deploy.mjs`) |
| `npm run cf-typegen` | Generate Cloudflare environment TypeScript types |

## Deployment (Cloudflare)

The repository is configured for OpenNext + Cloudflare Workers:

1. Ensure Wrangler is authenticated and required bindings are configured.
2. Build and deploy:

```bash
npm run deploy
```

For previewing the Cloudflare runtime locally:

```bash
npm run preview
```

## Project Structure

```text
src/
  app/          Next.js app routes, pages, API handlers
  components/   Reusable UI and layout components
  data/         Static game metadata
  lib/          App-specific helper libraries
  utils/        Shared utilities (R2, DB, Supabase)
docs/
  roadmap.md    Product and infrastructure roadmap
scripts/
  deploy.mjs    Deploy wrapper for OpenNext + Cloudflare
```

## Roadmap

See [`/docs/roadmap.md`](./docs/roadmap.md) for current priorities and implementation status.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run lint/build checks
5. Open a pull request

## License

No license file is currently defined in this repository.
