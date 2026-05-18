"use client";

import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Camera, Check, AlertCircle, KeyRound, LogOut } from "lucide-react";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  email: string | null;
  updated_at: string | null;
}

interface AccountFormProps {
  user: User;
  profile: Profile | null;
}

function StatusMessage({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div className={`mt-3 p-3 rounded-lg text-sm flex items-center gap-2 ${
      type === "success" 
        ? "bg-primary/10 border border-primary/30 text-primary" 
        : "bg-destructive/10 border border-destructive/30 text-destructive"
    }`}>
      {type === "success" ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      {message}
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center border border-border">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-heading font-semibold text-foreground uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function AccountForm({ user, profile }: AccountFormProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Username state
  const [username, setUsername] = useState(profile?.username || "");
  const [savingUsername, setSavingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{ message: string; type: "success" | "error" } | null>(null);


  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setAvatarStatus(null);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/avatar/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json() as { error?: string; avatarUrl?: string };

      if (!res.ok) {
        setAvatarStatus({ message: data.error || "Upload failed.", type: "error" });
        return;
      }

      // Cache-bust the avatar URL
      setAvatarUrl(`${data.avatarUrl}?t=${Date.now()}`);
      setAvatarStatus({ message: "Avatar updated.", type: "success" });
    } catch {
      setAvatarStatus({ message: "Upload failed. Please try again.", type: "error" });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ── Username Update ────────────────────────────────────
  const handleUsernameUpdate = async () => {
    if (!username.trim() || username === profile?.username) return;

    if (username.length < 3 || username.length > 24) {
      setUsernameStatus({ message: "Username must be between 3 and 24 characters.", type: "error" });
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setUsernameStatus({ message: "Username can only contain letters, numbers, hyphens, and underscores.", type: "error" });
      return;
    }

    setSavingUsername(true);
    setUsernameStatus(null);

    // Check if username is taken
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", user.id)
      .single();

    if (existing) {
      setUsernameStatus({ message: "Username is already taken.", type: "error" });
      setSavingUsername(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ username, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (error) {
      setUsernameStatus({ message: "Failed to update username.", type: "error" });
    } else {
      setUsernameStatus({ message: "Username updated.", type: "success" });
    }
    setSavingUsername(false);
  };



  // ── Sign Out ───────────────────────────────────────────
  const handleSignOut = async () => {
    await fetch("/auth/signout", { method: "POST" });
    window.location.href = "/home";
  };

  return (
    <div className="space-y-0">
      {/* ── Profile Picture ─────────────────────────────────── */}
      <SectionCard title="Profile Picture" icon={Camera}>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 bg-muted flex items-center justify-center">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <span className="text-3xl text-muted-foreground font-heading">
                  {(profile?.username || "?")[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-border bg-background/50 text-foreground hover:border-primary/50 hover:bg-muted/50 transition-all disabled:opacity-50"
            >
              {uploadingAvatar ? "Uploading..." : "Change Avatar"}
            </button>
            <p className="text-xs text-muted-foreground mt-2">JPG, PNG, or WebP. Max 2MB.</p>
          </div>
        </div>
        {avatarStatus && <StatusMessage {...avatarStatus} />}
      </SectionCard>

      {/* ── Username ────────────────────────────────────────── */}
      <SectionCard title="Username" icon={Camera}>
        <div className="flex gap-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 h-11 rounded-lg border border-input bg-background/50 px-4 text-sm text-foreground transition-all duration-300 focus:outline-none focus:border-primary"
            placeholder="username"
            minLength={3}
            maxLength={24}
          />
          <button
            onClick={handleUsernameUpdate}
            disabled={savingUsername || username === profile?.username}
            className="px-5 h-11 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savingUsername ? "Saving..." : "Save"}
          </button>
        </div>
        {usernameStatus && <StatusMessage {...usernameStatus} />}
      </SectionCard>






      {/* ── Sign Out ────────────────────────────────────────── */}
      <div className="pt-4">
        <button
          onClick={handleSignOut}
          className="w-full h-12 rounded-lg text-sm font-bold tracking-widest uppercase border border-destructive text-destructive hover:bg-destructive/10 transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
