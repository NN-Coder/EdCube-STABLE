"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const email = (formData.get("email") as string)?.trim();

  if (!username || !password || !email) {
    return { error: "Username, email, and password are required." };
  }

  if (username.length < 3 || username.length > 24) {
    return { error: "Username must be between 3 and 24 characters." };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { error: "Username can only contain letters, numbers, hyphens, and underscores." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  // Check if username is already taken
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (existing) {
    return { error: "Username is already taken." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/auth/confirm`,
    },
  });

  if (error) {
    // Handle duplicate email
    if (error.message.includes("already registered")) {
      return { error: "An account with this email already exists." };
    }
    return { error: error.message };
  }

  // Store the email in the profile
  if (data?.user) {
    await supabase
      .from("profiles")
      .update({ email })
      .eq("id", data.user.id);
  }

  redirect("/home");
}
