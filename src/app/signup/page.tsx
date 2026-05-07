"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";
import { checkUsername } from "./actions";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

function OAuthButtons() {
  const supabase = createClient();

  const handleOAuth = async (provider: "google" | "discord" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => handleOAuth("google")}
        className="w-full flex items-center justify-center gap-3 rounded-lg text-sm font-medium transition-all border border-border bg-background/50 text-foreground h-11 hover:border-primary/50 hover:bg-muted/50"
        type="button"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continue with Google
      </button>
      <button
        onClick={() => handleOAuth("discord")}
        className="w-full flex items-center justify-center gap-3 rounded-lg text-sm font-medium transition-all border border-border bg-background/50 text-foreground h-11 hover:border-[#5865F2]/50 hover:bg-muted/50"
        type="button"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
        Continue with Discord
      </button>
      <button
        onClick={() => handleOAuth("github")}
        className="w-full flex items-center justify-center gap-3 rounded-lg text-sm font-medium transition-all border border-border bg-background/50 text-foreground h-11 hover:border-foreground/50 hover:bg-muted/50"
        type="button"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        Continue with GitHub
      </button>
    </div>
  );
}

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const email = (formData.get("email") as string)?.trim();

    if (!username || !password || !email) {
      setError("Username, email, and password are required.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      // 1. Check if username is available (server action)
      const usernameCheck = await checkUsername(username);
      if (usernameCheck?.error) {
        setError(usernameCheck.error);
        setLoading(false);
        return;
      }

      // 2. Sign up with Supabase (client side)
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("An account with this email already exists.");
        } else {
          setError(signUpError.message);
        }
        setLoading(false);
        return;
      }

      // 3. Update profile email if successful
      if (data?.user) {
        await supabase
          .from("profiles")
          .update({ email })
          .eq("id", data.user.id);
      }

      // 4. Redirect to home
      window.location.href = "/home";
    } catch (err) {
      setError("An unexpected error occurred during sign up.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4 relative z-10 w-full min-h-[80vh]">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4 border border-border">
              <UserPlus className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground tracking-wide">Sign <span className="text-primary">Up</span></h1>
            <p className="text-sm text-muted-foreground mt-2 font-light">Create your account.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">
              {error}
            </div>
          )}
          
          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-2 group">
              <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase group-focus-within:text-primary transition-colors" htmlFor="username">Username</label>
              <input 
                className="flex h-12 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm text-foreground transition-all duration-300 placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary" 
                id="username" 
                name="username"
                placeholder="username"
                required
                minLength={3}
                maxLength={24}
                pattern="[a-zA-Z0-9_-]+"
                title="Letters, numbers, hyphens, and underscores only"
              />
            </div>
            <div className="space-y-2 group">
              <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase group-focus-within:text-primary transition-colors" htmlFor="email">
                Email
              </label>
              <input 
                className="flex h-12 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm text-foreground transition-all duration-300 placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary" 
                id="email" 
                name="email"
                type="email" 
                placeholder="you@example.com" 
                required
              />
            </div>
            <div className="space-y-2 group">
              <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase group-focus-within:text-primary transition-colors" htmlFor="password">Password</label>
              <input 
                className="flex h-12 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm text-foreground transition-all duration-300 placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary" 
                id="password" 
                name="password"
                type="password" 
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            
            <button 
              className="w-full flex items-center justify-center rounded-lg text-sm font-bold tracking-widest uppercase transition-all bg-primary text-primary-foreground h-12 mt-8 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <OAuthButtons />
          
          <div className="mt-8 text-center text-sm border-t border-border pt-6">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline underline-offset-4 font-medium transition-all">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
