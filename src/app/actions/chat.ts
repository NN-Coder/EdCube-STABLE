"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const TURNSTILE_SECRET_KEY = "0x4AAAAAADMPZUnX4v_rR9Kl_tQKRyFL-no";
const ADMIN_UUID = "1ff896ac-ee93-4e70-8c75-d98cb41f3c69";

// Extremely basic slur list (placeholder for actual filtering logic)
// You can expand this list based on preferred moderation strictness
const EXTREME_SLURS = [
  "nigger",
  "nigga",
  "faggot",
  "dyke",
  "kike",
  "chink",
  "tranny",
];

function containsSlur(text: string): boolean {
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  const words = normalized.split(/\s+/);
  return EXTREME_SLURS.some(slur => words.includes(slur));
}

export async function sendMessage(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to send a message." };
  }

  const content = formData.get("content") as string;
  const turnstileToken = formData.get("cf-turnstile-response") as string;

  if (!content || !content.trim()) {
    return { error: "Message cannot be empty." };
  }

  if (content.length > 500) {
    return { error: "Message is too long. Max 500 characters." };
  }

  // 1. Verify Turnstile
  if (!turnstileToken) {
    return { error: "Turnstile verification missing." };
  }

  const verifyEndpoint = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const verifyResponse = await fetch(verifyEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `secret=${TURNSTILE_SECRET_KEY}&response=${turnstileToken}`,
  });

  const verifyData = await verifyResponse.json();
  if (!verifyData.success) {
    return { error: "Turnstile verification failed. Are you a bot?" };
  }

  // 2. Check Global Freeze (Optional: can also be done via RLS or prior query, doing here for double check)
  const { data: settings } = await supabase
    .from("chat_settings")
    .select("is_frozen")
    .eq("id", "global")
    .single();

  if (settings?.is_frozen && user.id !== ADMIN_UUID) {
    return { error: "Chat is currently frozen by an admin." };
  }

  // 3. Admin Commands
  if (user.id === ADMIN_UUID && content.startsWith("/")) {
    return await handleAdminCommand(content, supabase);
  }

  // 4. Slur Filter
  if (containsSlur(content)) {
    return { error: "Your message contains blocked words and cannot be sent." };
  }

  // 5. Insert Message
  const { error } = await supabase.from("messages").insert({
    user_id: user.id,
    content: content.trim(),
  });

  if (error) {
    console.error("Error inserting message:", error);
    return { error: "Failed to send message. Please try again." };
  }

  return { success: true };
}

async function handleAdminCommand(commandText: string, supabase: any) {
  const args = commandText.trim().split(" ");
  const command = args[0].toLowerCase();

  switch (command) {
    case "/broadcast":
      const broadcastMsg = args.slice(1).join(" ");
      if (!broadcastMsg) return { error: "Broadcast message cannot be empty." };
      await supabase.from("messages").insert({
        user_id: ADMIN_UUID,
        content: broadcastMsg,
        is_announcement: true,
      });
      return { success: true, message: "Broadcast sent." };

    case "/freeze":
      await supabase
        .from("chat_settings")
        .update({ is_frozen: true, updated_at: new Date().toISOString() })
        .eq("id", "global");
      return { success: true, message: "Chat has been frozen." };

    case "/unfreeze":
      await supabase
        .from("chat_settings")
        .update({ is_frozen: false, updated_at: new Date().toISOString() })
        .eq("id", "global");
      return { success: true, message: "Chat has been unfrozen." };

    case "/tempmute":
      if (args.length < 3) return { error: "Usage: /tempmute [user_id] [minutes]" };
      const tempMuteId = args[1];
      const minutes = parseInt(args[2]);
      if (isNaN(minutes)) return { error: "Minutes must be a number." };
      const muteUntil = new Date(Date.now() + minutes * 60000).toISOString();
      await supabase
        .from("profiles")
        .update({ is_muted_until: muteUntil })
        .eq("id", tempMuteId);
      return { success: true, message: `User temporarily muted for ${minutes} minutes.` };

    case "/permamute":
      if (args.length < 2) return { error: "Usage: /permamute [user_id]" };
      const permaMuteId = args[1];
      // Set to year 9999
      await supabase
        .from("profiles")
        .update({ is_muted_until: "9999-12-31T23:59:59Z" })
        .eq("id", permaMuteId);
      return { success: true, message: "User permanently muted." };

    case "/unmute":
      if (args.length < 2) return { error: "Usage: /unmute [user_id]" };
      const unmuteId = args[1];
      await supabase
        .from("profiles")
        .update({ is_muted_until: null })
        .eq("id", unmuteId);
      return { success: true, message: "User unmuted." };

    default:
      return { error: "Unknown command." };
  }
}
