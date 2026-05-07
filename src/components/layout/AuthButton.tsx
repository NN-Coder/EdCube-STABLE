"use client";

import { useEffect, useState, useRef } from "react";
import { UserCircle, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { getAvatarUrl } from "@/utils/r2";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function AuthButton() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        setAvatarUrl(getAvatarUrl(user.id));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        setAvatarUrl(getAvatarUrl(currentUser.id));
      } else {
        setAvatarUrl(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await fetch("/auth/signout", { method: "POST" });
    window.location.href = "/home";
  };

  // Not logged in — show login link
  if (!user) {
    return (
      <Link
        href="/login"
        className="flex flex-col items-center gap-1 text-primary transition-all duration-300 hover:text-accent hover:drop-shadow-[0_0_15px_rgba(0,255,204,0.4)] hover:-translate-y-0.5"
      >
        <UserCircle className="w-5 h-5" />
        <span className="text-[0.75rem] font-medium uppercase tracking-wider font-heading">
          Login
        </span>
      </Link>
    );
  }

  // Logged in — show profile icon with dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex flex-col items-center gap-1 text-primary transition-all duration-300 hover:text-accent hover:drop-shadow-[0_0_15px_rgba(0,255,204,0.4)] hover:-translate-y-0.5 bg-transparent border-none p-0 font-heading"
      >
        {avatarUrl ? (
          <div className="w-5 h-5 rounded-full overflow-hidden border border-primary/50">
            <Image
              src={avatarUrl}
              alt="Profile"
              width={20}
              height={20}
              className="object-cover w-full h-full"
              onError={(e) => {
                // Fallback to icon if avatar doesn't exist
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).parentElement!.innerHTML = "";
              }}
              unoptimized
            />
          </div>
        ) : (
          <UserCircle className="w-5 h-5" />
        )}
        <span className="text-[0.75rem] font-medium uppercase tracking-wider">
          Profile
        </span>
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-3 w-48 bg-card border border-border rounded-xl overflow-hidden shadow-lg shadow-black/50 z-[100]">
          <div className="py-1">
            <Link
              href="/account"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted/50 hover:text-primary transition-all"
            >
              <User className="w-4 h-4" />
              Account
            </Link>
            <Link
              href="/settings"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted/50 hover:text-primary transition-all"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <div className="border-t border-border" />
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-all w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
