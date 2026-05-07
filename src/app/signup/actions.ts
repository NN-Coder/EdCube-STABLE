"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const email = (formData.get("email") as string)?.trim() || null;

  if (!username || !password) {
    return { error: "Username and password are required." };
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

  // Supabase Auth requires an email. If user didn't provide one,
  // generate a placeholder so they can still sign up with just username+password.
  const authEmail = email || `${username}@edcube.net`;

  const { error } = await supabase.auth.signUp({
    email: authEmail,
    password,
    options: {
      data: {
        username,
      },
      // If using a real email, Supabase will send a confirmation email.
      // If using placeholder, no email is sent (it's not a real address).
      emailRedirectTo: email
        ? `${process.env.NEXT_PUBLIC_SITE_URL || ""}/auth/confirm`
        : undefined,
    },
  });

  if (error) {
    // Handle duplicate email
    if (error.message.includes("already registered")) {
      return { error: "An account with this email already exists." };
    }
    return { error: error.message };
  }

  // If they used a real email, Supabase may require confirmation
  // depending on dashboard settings. For placeholder emails, the
  // user is logged in immediately.
  if (email) {
    // Store the real email in the profile
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ email })
        .eq("id", user.id);
    }
  }

  redirect("/home");
}
