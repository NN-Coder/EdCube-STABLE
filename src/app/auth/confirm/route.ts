import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Email confirmation handler.
 * When a user clicks the confirmation link in their email,
 * Supabase redirects here with token_hash and type parameters.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "email" | "recovery" | "email_change" | "signup";
  const next = searchParams.get("next") ?? "/home";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // For email changes, update the profile email too
      if (type === "email_change") {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          await supabase
            .from("profiles")
            .update({ email: user.email })
            .eq("id", user.id);
        }
      }

      // For password recovery, redirect to account page to set new password
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/account?reset=true`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=verification_failed`);
}
