"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import MessageFeed from "./MessageFeed";
import ChatInput from "./ChatInput";
import OnlineUsers from "./OnlineUsers";
import { Settings, Shield, ShieldAlert } from "lucide-react";

const ADMIN_UUID = "1ff896ac-ee93-4e70-8c75-d98cb41f3c69";

export default function ChatContainer({ user, profile }: { user: any; profile: any }) {
  const [safeMode, setSafeMode] = useState(true);
  const [isFrozen, setIsFrozen] = useState(false);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    // Fetch initial chat settings
    const fetchSettings = async () => {
      const { data } = await supabase.from("chat_settings").select("is_frozen").eq("id", "global").single();
      if (data) setIsFrozen(data.is_frozen);
    };
    fetchSettings();

    // Subscribe to chat_settings changes
    const settingsSub = supabase
      .channel("public:chat_settings")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_settings" }, (payload) => {
        if (payload.new && "is_frozen" in payload.new) {
          setIsFrozen((payload.new as any).is_frozen);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(settingsSub);
    };
  }, [supabase]);

  const isAdmin = user?.id === ADMIN_UUID;

  return (
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto h-[80vh] bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-white/10">
        {/* Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/60">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-primary neon-glow uppercase tracking-wider">
              Global Comm-Link
            </h2>
            {isFrozen && (
              <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full border border-red-500/50 flex items-center gap-1 font-mono uppercase">
                <ShieldAlert size={12} />
                Network Frozen
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSafeMode(!safeMode)}
              className={`flex items-center gap-2 text-sm transition-colors ${
                safeMode ? "text-green-400" : "text-muted-foreground hover:text-white"
              }`}
            >
              <Shield size={16} />
              <span className="hidden sm:inline">Safe Mode {safeMode ? "ON" : "OFF"}</span>
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-hidden relative bg-black/20">
          <MessageFeed safeMode={safeMode} user={user} isAdmin={isAdmin} supabase={supabase} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/60 border-t border-white/10">
          <ChatInput isFrozen={isFrozen} isAdmin={isAdmin} user={user} />
        </div>
      </div>

      {/* Sidebar - Online Users */}
      <div className="w-full md:w-64 flex flex-col bg-black/40 hidden md:flex">
        <div className="h-16 border-b border-white/10 flex items-center px-4 bg-black/60">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Active Users
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          <OnlineUsers user={user} profile={profile} supabase={supabase} />
        </div>
      </div>
    </div>
  );
}
