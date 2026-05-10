"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Trash2 } from "lucide-react";

// Basic profanity filter for "Safe Mode"
const COMMON_SWEARS = ["fuck", "shit", "bitch", "asshole", "cunt", "dick", "pussy", "damn", "crap"];

function applySafeMode(text: string): string {
  let filtered = text;
  COMMON_SWEARS.forEach((swear) => {
    const regex = new RegExp(`\\b${swear}\\b`, "gi");
    filtered = filtered.replace(regex, "***");
  });
  return filtered;
}

export default function MessageFeed({ safeMode, user, isAdmin, supabase }: { safeMode: boolean; user: any; isAdmin: boolean; supabase: any }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchProfiles = async (userIds: string[]) => {
    const missingIds = userIds.filter(id => !profiles[id]);
    if (missingIds.length === 0) return;

    const { data } = await supabase.from("profiles").select("*").in("id", missingIds);
    if (data) {
      const newProfiles = { ...profiles };
      data.forEach((p: any) => {
        newProfiles[p.id] = p;
      });
      setProfiles(newProfiles);
    }
  };

  useEffect(() => {
    const loadInitialMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .order("inserted_at", { ascending: false })
        .limit(50);

      if (data) {
        const sorted = data.reverse();
        setMessages(sorted);
        const userIds = [...new Set(sorted.map((m: any) => m.user_id))];
        await fetchProfiles(userIds);
        scrollToBottom();
      }
    };

    loadInitialMessages();

    const channel = supabase
      .channel("public:messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, async (payload) => {
        setMessages((prev) => {
          const newMsgs = [...prev, payload.new];
          // Restrict scroll up history to 100 messages
          if (newMsgs.length > 100) return newMsgs.slice(newMsgs.length - 100);
          return newMsgs;
        });
        if (payload.new.user_id && !profiles[payload.new.user_id]) {
          await fetchProfiles([payload.new.user_id]);
        }
        setTimeout(scrollToBottom, 100);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "messages" }, (payload) => {
        setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleDelete = async (id: string) => {
    await supabase.from("messages").delete().eq("id", id);
  };

  return (
    <div 
      ref={scrollContainerRef}
      className="absolute inset-0 overflow-y-auto p-4 custom-scrollbar flex flex-col space-y-4"
    >
      {messages.map((msg) => {
        const isMine = user?.id === msg.user_id;
        const profile = profiles[msg.user_id];
        
        let displayName = "Unknown";
        let avatar = "";
        
        if (profile) {
          if (profile.is_anonymous_mode) {
            displayName = `Anonymous User [${msg.user_id.slice(-4)}]`;
          } else if (msg.user_id.startsWith("guest-") || !profile.username) {
            // Usually anonymous users have no username or are handled specifically
            // We'll fallback to Guest User if no username and not anonymous_mode
            displayName = `Guest User [${msg.user_id.slice(-4)}]`;
          } else {
            displayName = profile.username;
            avatar = profile.avatar_url;
          }
        }

        const content = safeMode ? applySafeMode(msg.content) : msg.content;

        if (msg.is_announcement) {
          return (
            <div key={msg.id} className="w-full flex justify-center my-2">
              <div className="bg-primary/20 border border-primary/50 text-primary-foreground px-4 py-2 rounded-lg text-sm max-w-lg text-center font-mono">
                <span className="font-bold text-primary mr-2">[BROADCAST]</span>
                {content}
              </div>
            </div>
          );
        }

        return (
          <div key={msg.id} className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-[80%] ${isMine ? "flex-row-reverse" : "flex-row"} gap-3 items-end`}>
              {/* Avatar */}
              {!isMine && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0 overflow-hidden border border-white/20">
                  {avatar ? (
                    <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              )}
              
              {/* Message Bubble */}
              <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                <span className="text-xs text-muted-foreground mb-1 px-1">{displayName}</span>
                <div 
                  className={`px-4 py-2 rounded-2xl ${
                    isMine 
                      ? "bg-primary text-primary-foreground rounded-br-sm shadow-[0_0_15px_rgba(var(--primary),0.3)]" 
                      : "bg-white/10 text-white rounded-bl-sm border border-white/10"
                  }`}
                >
                  <p className="break-words whitespace-pre-wrap text-sm">{content}</p>
                </div>
              </div>

              {/* Delete button for mine or admin */}
              {(isMine || isAdmin) && (
                <button 
                  onClick={() => handleDelete(msg.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted-foreground hover:text-red-400"
                  title="Delete message"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
