import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * OAuth callback handler.
 * After a user authenticates with an OAuth provider (Google, Discord, GitHub),
 * Supabase redirects here with a `code` query parameter.
 * We exchange that code for a session.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // After OAuth, ensure the profile has a username set
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        // If no username yet (first OAuth login), redirect to account page to set one
        if (!profile?.username) {
          // Set a temporary username from the OAuth provider
          const providerUsername =
            user.user_metadata?.preferred_username ||
            user.user_metadata?.user_name ||
            user.user_metadata?.name?.replace(/\s+/g, "_") ||
            `user_${user.id.slice(0, 8)}`;

          await supabase
            .from("profiles")
            .update({
              username: providerUsername,
              email: user.email,
              avatar_url: user.user_metadata?.avatar_url || null,
            })
            .eq("id", user.id);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
