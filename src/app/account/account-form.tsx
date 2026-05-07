"use client";

import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Camera, Check, AlertCircle, KeyRound, Mail, Phone, Shield, LogOut } from "lucide-react";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  has_2fa: boolean;
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

  // Email state
  const [email, setEmail] = useState(profile?.email || "");
  const [emailPassword, setEmailPassword] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Phone state
  const [phone, setPhone] = useState(profile?.phone || "");
  const [savingPhone, setSavingPhone] = useState(false);
  const [phoneStatus, setPhoneStatus] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // 2FA state
  const [has2fa, setHas2fa] = useState(profile?.has_2fa || false);
  const [twoFaStatus, setTwoFaStatus] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Password reset state
  const [resetStatus, setResetStatus] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ── Avatar Upload ──────────────────────────────────────
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

      const data = await res.json();

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

  // ── Email Update ───────────────────────────────────────
  const handleEmailUpdate = async () => {
    if (!email.trim()) return;

    setSavingEmail(true);
    setEmailStatus(null);

    // Verify current password first
    if (emailPassword) {
      const currentEmail = profile?.email || `${profile?.username}@edcube.local`;
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentEmail,
        password: emailPassword,
      });

      if (signInError) {
        setEmailStatus({ message: "Current password is incorrect.", type: "error" });
        setSavingEmail(false);
        return;
      }
    } else {
      setEmailStatus({ message: "Please enter your current password.", type: "error" });
      setSavingEmail(false);
      return;
    }

    // Update email in Supabase Auth (triggers verification email)
    const { error } = await supabase.auth.updateUser({
      email,
    });

    if (error) {
      setEmailStatus({ message: error.message, type: "error" });
    } else {
      setEmailStatus({ message: "Verification email sent. Check your inbox to confirm.", type: "success" });
      setEmailPassword("");
    }
    setSavingEmail(false);
  };

  // ── Phone Update ───────────────────────────────────────
  const handlePhoneUpdate = async () => {
    if (!phone.trim()) return;

    setSavingPhone(true);
    setPhoneStatus(null);

    const { error } = await supabase.auth.updateUser({ phone });

    if (error) {
      setPhoneStatus({ message: error.message, type: "error" });
    } else {
      // Update profile
      await supabase
        .from("profiles")
        .update({ phone, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      setPhoneStatus({ message: "Verification code sent to your phone.", type: "success" });
    }
    setSavingPhone(false);
  };

  // ── Password Update ────────────────────────────────────
  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({ message: "All password fields are required.", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ message: "New passwords do not match.", type: "error" });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus({ message: "New password must be at least 6 characters.", type: "error" });
      return;
    }

    setSavingPassword(true);
    setPasswordStatus(null);

    // Verify current password
    const currentEmail = profile?.email || `${profile?.username}@edcube.local`;
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: currentEmail,
      password: currentPassword,
    });

    if (signInError) {
      setPasswordStatus({ message: "Current password is incorrect.", type: "error" });
      setSavingPassword(false);
      return;
    }

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordStatus({ message: error.message, type: "error" });
    } else {
      setPasswordStatus({ message: "Password updated.", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setSavingPassword(false);
  };

  // ── 2FA Toggle ─────────────────────────────────────────
  const handle2faToggle = async () => {
    setTwoFaStatus(null);

    if (!profile?.email && !profile?.phone) {
      setTwoFaStatus({ message: "You need a verified email or phone number to enable 2FA.", type: "error" });
      return;
    }

    const newState = !has2fa;

    const { error } = await supabase
      .from("profiles")
      .update({ has_2fa: newState, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (error) {
      setTwoFaStatus({ message: "Failed to update 2FA settings.", type: "error" });
    } else {
      setHas2fa(newState);
      setTwoFaStatus({
        message: newState
          ? "2FA enabled. OTP codes will be sent to your email or phone on login."
          : "2FA disabled.",
        type: "success",
      });
    }
  };

  // ── Password Reset ─────────────────────────────────────
  const handlePasswordReset = async () => {
    if (!profile?.email) {
      setResetStatus({ message: "You need a linked email to receive a reset link.", type: "error" });
      return;
    }

    setResetStatus(null);

    const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: `${window.location.origin}/auth/confirm`,
    });

    if (error) {
      setResetStatus({ message: error.message, type: "error" });
    } else {
      setResetStatus({ message: "Password reset email sent. Check your inbox.", type: "success" });
    }
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

      {/* ── Email ───────────────────────────────────────────── */}
      <SectionCard title="Email" icon={Mail}>
        {profile?.email ? (
          <p className="text-sm text-foreground mb-4">
            Current: <span className="text-primary">{profile.email}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">No email linked. Add one to enable password reset and 2FA via email.</p>
        )}
        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 rounded-lg border border-input bg-background/50 px-4 text-sm text-foreground transition-all duration-300 focus:outline-none focus:border-primary"
            placeholder="you@example.com"
          />
          <input
            type="password"
            value={emailPassword}
            onChange={(e) => setEmailPassword(e.target.value)}
            className="w-full h-11 rounded-lg border border-input bg-background/50 px-4 text-sm text-foreground transition-all duration-300 focus:outline-none focus:border-primary"
            placeholder="Current password (required)"
          />
          <button
            onClick={handleEmailUpdate}
            disabled={savingEmail}
            className="px-5 h-11 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {savingEmail ? "Saving..." : profile?.email ? "Update Email" : "Link Email"}
          </button>
        </div>
        {emailStatus && <StatusMessage {...emailStatus} />}
      </SectionCard>

      {/* ── Phone ───────────────────────────────────────────── */}
      <SectionCard title="Phone" icon={Phone}>
        {profile?.phone ? (
          <p className="text-sm text-foreground mb-4">
            Current: <span className="text-primary">{profile.phone}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">No phone linked. Add one to enable 2FA via SMS.</p>
        )}
        <div className="flex gap-3">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 h-11 rounded-lg border border-input bg-background/50 px-4 text-sm text-foreground transition-all duration-300 focus:outline-none focus:border-primary"
            placeholder="+1234567890"
          />
          <button
            onClick={handlePhoneUpdate}
            disabled={savingPhone}
            className="px-5 h-11 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {savingPhone ? "Saving..." : profile?.phone ? "Update Phone" : "Link Phone"}
          </button>
        </div>
        {phoneStatus && <StatusMessage {...phoneStatus} />}
      </SectionCard>

      {/* ── Password ────────────────────────────────────────── */}
      <SectionCard title="Change Password" icon={KeyRound}>
        <div className="space-y-3">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full h-11 rounded-lg border border-input bg-background/50 px-4 text-sm text-foreground transition-all duration-300 focus:outline-none focus:border-primary"
            placeholder="Current password"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full h-11 rounded-lg border border-input bg-background/50 px-4 text-sm text-foreground transition-all duration-300 focus:outline-none focus:border-primary"
            placeholder="New password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-11 rounded-lg border border-input bg-background/50 px-4 text-sm text-foreground transition-all duration-300 focus:outline-none focus:border-primary"
            placeholder="Confirm new password"
          />
          <button
            onClick={handlePasswordUpdate}
            disabled={savingPassword}
            className="px-5 h-11 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {savingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
        {passwordStatus && <StatusMessage {...passwordStatus} />}
      </SectionCard>

      {/* ── Two-Factor Authentication ───────────────────────── */}
      <SectionCard title="Two-Factor Authentication" icon={Shield}>
        <p className="text-sm text-muted-foreground mb-4">
          When enabled, a one-time code will be sent to your linked email or phone on each login.
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              {has2fa ? "2FA is enabled" : "2FA is disabled"}
            </p>
            {has2fa && (
              <p className="text-xs text-muted-foreground mt-1">
                OTP sent to: {profile?.email ? "Email" : ""}{profile?.email && profile?.phone ? " & " : ""}{profile?.phone ? "Phone" : ""}
              </p>
            )}
          </div>
          <button
            onClick={handle2faToggle}
            className={`px-5 h-11 rounded-lg text-sm font-medium transition-all ${
              has2fa
                ? "border border-destructive text-destructive hover:bg-destructive/10"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {has2fa ? "Disable 2FA" : "Enable 2FA"}
          </button>
        </div>
        {twoFaStatus && <StatusMessage {...twoFaStatus} />}
      </SectionCard>

      {/* ── Password Reset ──────────────────────────────────── */}
      {profile?.email && (
        <SectionCard title="Password Reset" icon={Mail}>
          <p className="text-sm text-muted-foreground mb-4">
            Send a password reset link to your email address.
          </p>
          <button
            onClick={handlePasswordReset}
            className="px-5 h-11 rounded-lg text-sm font-medium border border-border bg-background/50 text-foreground hover:border-primary/50 hover:bg-muted/50 transition-all"
          >
            Send Reset Link
          </button>
          {resetStatus && <StatusMessage {...resetStatus} />}
        </SectionCard>
      )}

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
