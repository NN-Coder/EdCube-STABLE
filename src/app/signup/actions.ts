"use server";

import { createClient } from "@/utils/supabase/server";

export async function checkUsername(username: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  
  if (username.length < 3 || username.length > 24) {
    return { error: "Username must be between 3 and 24 characters." };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { error: "Username can only contain letters, numbers, hyphens, and underscores." };
  }

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (existing) {
    return { error: "Username is already taken." };
  }

  return {};
}


