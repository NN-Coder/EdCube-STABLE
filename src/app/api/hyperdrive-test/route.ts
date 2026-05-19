import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import { query } from "@/utils/db";

export async function GET() {
  try {
    const { env } = getCloudflareContext();
    
    // Execute a minimal test query via Hyperdrive connection pool
    const startTime = Date.now();
    const rows = await query(env as any, "SELECT 1 as hyperdrive_status, current_setting('server_version') as pg_version");
    const durationMs = Date.now() - startTime;

    return NextResponse.json({ 
      success: true, 
      message: "Hyperdrive connection successful!",
      hyperdrive_usage: "Check Cloudflare dashboard for +1 query usage",
      latency_ms: durationMs,
      data: rows 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Hyperdrive test error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
