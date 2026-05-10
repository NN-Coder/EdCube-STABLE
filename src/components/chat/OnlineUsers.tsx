"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

export default function OnlineUsers({ user, profile, supabase }: { user: any; profile: any; supabase: any }) {
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    let displayName = "Unknown";
    let avatar = "";
    
    if (profile) {
      if (profile.is_anonymous_mode) {
        displayName = `Anonymous User [${user.id.slice(-4)}]`;
      } else if (user.id.startsWith("guest-") || !profile.username) {
        displayName = `Guest User [${user.id.slice(-4)}]`;
      } else {
        displayName = profile.username;
        avatar = profile.avatar_url;
      }
    } else {
      displayName = `Guest User [${user.id.slice(-4)}]`;
    }

    const room = supabase.channel("online-users", {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    room
      .on("presence", { event: "sync" }, () => {
        const state = room.presenceState();
        const users = Object.keys(state).map((key) => {
          return state[key][0]; // get the first instance of this user
        });
        
        // Remove duplicates by ID (in case of multiple tabs)
        const uniqueUsers = Array.from(new Map(users.map(item => [item.id, item])).values());
        setOnlineUsers(uniqueUsers);
      })
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          await room.track({
            id: user.id,
            name: displayName,
            avatar: avatar,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(room);
    };
  }, [supabase, user, profile]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 px-2">
        <Users size={14} />
        <span>{onlineUsers.length} Online</span>
      </div>

      <div className="flex flex-col gap-1">
        {onlineUsers.map((u) => (
          <div key={u.id} className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/5 border border-white/5">
            <div className="w-6 h-6 rounded-full bg-white/10 flex-shrink-0 overflow-hidden border border-white/10 relative">
              {u.avatar ? (
                <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                  {u.name.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Online Indicator */}
              <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-black"></div>
            </div>
            <span className="text-xs text-white truncate font-medium">{u.name}</span>
          </div>
        ))}
        {onlineUsers.length === 0 && (
          <div className="text-xs text-muted-foreground px-2 italic">Waiting for connection...</div>
        )}
      </div>
    </div>
  );
}
