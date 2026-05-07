"use server";

import { createClient } from "@/utils/supabase/server";

export async function lookupEmail(identifier: string): Promise<string | null> {
  const supabase = await createClient();

  if (identifier.includes("@")) {
    return identifier;
  }

  // Look up the profile to find their auth email
  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("username", identifier)
    .single();

  return profile?.email || null;
}

