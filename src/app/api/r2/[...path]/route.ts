import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";

/**
 * MIME type mapping for serving game assets from R2 with correct Content-Type headers.
 * Covers all common web game asset types (HTML5 games, Unity WebGL, etc.)
 */
const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  // Images
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".bmp": "image/bmp",
  ".avif": "image/avif",
  // Fonts
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".eot": "application/vnd.ms-fontobject",
  // Audio
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".aac": "audio/aac",
  ".flac": "audio/flac",
  ".m4a": "audio/mp4",
  // Video
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogv": "video/ogg",
  // Binary / Game-specific
  ".wasm": "application/wasm",
  ".data": "application/octet-stream",
  ".unityweb": "application/octet-stream",
  ".mem": "application/octet-stream",
  ".pck": "application/octet-stream",
  ".bin": "application/octet-stream",
  ".br": "application/octet-stream",
  ".gz": "application/gzip",
  ".zip": "application/zip",
  ".pdf": "application/pdf",
  ".swf": "application/x-shockwave-flash",
  // Manifest
  ".manifest": "text/cache-manifest",
  ".webmanifest": "application/manifest+json",
};

function getMimeType(path: string): string {
  const dotIndex = path.lastIndexOf(".");
  if (dotIndex === -1) return "application/octet-stream";
  const ext = path.substring(dotIndex).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

/**
 * Catch-all API route that proxies R2 bucket content.
 * Used to serve game assets (HTML, JS, CSS, images, audio, etc.) from the
 * `assets` R2 bucket without exposing a public R2 URL.
 *
 * Example: GET /api/r2/game_sources/basket-random/index.html
 *   → Fetches key "game_sources/basket-random/index.html" from the R2 bucket
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const key = path.join("/");

    if (!key) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    const { env } = getCloudflareContext();
    const bucket = env.GAME_ASSETS_BUCKET;
    const object = await bucket.get(key);

    if (!object) {
      return NextResponse.json(
        { error: `Asset not found: ${key}` },
        { status: 404 }
      );
    }

    const contentType = getMimeType(key);
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    // Long-lived cache for immutable game assets
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    // Cross-origin isolation headers needed for some game engines (e.g. Unity WebGL with SharedArrayBuffer)
    headers.set("Cross-Origin-Embedder-Policy", "credentialless");
    headers.set("Cross-Origin-Resource-Policy", "cross-origin");

    if (object.httpEtag) {
      headers.set("ETag", object.httpEtag);
    }
    if (object.size !== undefined) {
      headers.set("Content-Length", String(object.size));
    }

    // Stream the R2 object body directly to the response
    return new NextResponse(object.body as ReadableStream, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("R2 proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
