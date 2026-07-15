import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// The user provided NEXT_PUBLIC_SUPABASE_ANON_KEY but the guide suggested NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY. I will use ANON_KEY for standard requests as it is standard and safe with RLS, though Publishable key is preferred by the copied prompt, let's stick to NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY as per the prompt instructions.

// Let's rewrite:
const keyToUse = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl!,
    keyToUse!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
