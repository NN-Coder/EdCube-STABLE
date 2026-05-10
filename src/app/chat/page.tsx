import { createClient } from "@/utils/supabase/server";
import ChatContainer from "@/components/chat/ChatContainer";

export const metadata = {
  title: "Global Chat | EdCube",
  description: "Real-time global communication network.",
};

export default async function ChatPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = data;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-2 sm:px-[5%] w-full">
      <div className="w-full text-center mb-6">
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary neon-glow uppercase tracking-wider">
          Global Chat
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto mt-2 font-mono">
          [SECURE CONNECTION ESTABLISHED]
        </p>
      </div>

      <ChatContainer user={user} profile={profile} />
    </div>
  );
}
