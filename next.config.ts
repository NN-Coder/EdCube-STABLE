import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Enable Cloudflare bindings during local `next dev` only.
// Must NOT run during `opennextjs-cloudflare build` / deploy — those use
// the real Wrangler runtime which handles bindings natively.
if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
