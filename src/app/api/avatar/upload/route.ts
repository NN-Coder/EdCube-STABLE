import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/avatar/upload
 * Uploads a user's avatar image to the R2 `assets` bucket under `avatars/{user-id}.jpg`.
 * Requires authentication.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be under 2MB" }, { status: 400 });
    }

    const { env } = getCloudflareContext();
    const bucket = env.GAME_ASSETS_BUCKET;

    // Convert file to ArrayBuffer and upload to R2
    const arrayBuffer = await file.arrayBuffer();
    const key = `avatars/${user.id}.jpg`;

    await bucket.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: "image/jpeg",
      },
    });

    // Update the profile with the avatar URL
    const avatarUrl = `/api/r2/avatars/${user.id}.jpg`;
    await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    return NextResponse.json({ success: true, avatarUrl });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
