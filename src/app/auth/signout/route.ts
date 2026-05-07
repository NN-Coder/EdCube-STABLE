import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://edcube.edcube.workers.dev";
  return NextResponse.redirect(new URL("/home", siteUrl), {
    status: 302,
  });
}
