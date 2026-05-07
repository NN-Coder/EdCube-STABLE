"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const identifier = formData.get("identifier") as string; // username or email
  const password = formData.get("password") as string;

  if (!identifier || !password) {
    return { error: "Username/email and password are required." };
  }

  let authEmail = identifier;

  // If the identifier doesn't look like an email, treat it as a username
  // and look up the corresponding auth email
  if (!identifier.includes("@")) {
    // Look up the profile to find their auth email
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("username", identifier)
      .single();

    if (!profile) {
      return { error: "Invalid username or password." };
    }

    // If they have a real email stored, use it. Otherwise use the placeholder.
    authEmail = profile.email || `${identifier}@edcube.net`;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: authEmail,
    password,
  });

  if (error) {
    return { error: "Invalid username or password." };
  }

  redirect("/home");
}
