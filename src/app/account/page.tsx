import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AccountForm } from "./account-form";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex-1 flex flex-col items-center py-12 px-4 relative z-10 w-full min-h-[80vh]">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-heading font-bold text-primary neon-glow mb-2 uppercase tracking-wider text-center">
          Account
        </h1>
        <p className="text-muted-foreground text-center mb-10">
          Manage your profile and security settings.
        </p>
        <AccountForm
          user={user}
          profile={profile}
        />
      </div>
    </div>
  );
}
