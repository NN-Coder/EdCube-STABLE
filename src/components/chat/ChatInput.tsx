"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { sendMessage } from "@/app/actions/chat";
import Script from "next/script";

const SITE_KEY = "0x4AAAAAADMPZawaHLvRHieq";

export default function ChatInput({ isFrozen, isAdmin, user }: { isFrozen: boolean; isAdmin: boolean; user: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSentTime, setLastSentTime] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);

  // Re-render turnstile when needed or reset it after submit
  const resetTurnstile = () => {
    if (window.turnstile && turnstileRef.current) {
      window.turnstile.reset(turnstileRef.current);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    
    if (!user) {
      setError("You must be logged in or guest to chat.");
      return;
    }

    if (isFrozen && !isAdmin) {
      setError("Chat is currently frozen.");
      return;
    }

    // Debounce check
    const now = Date.now();
    if (now - lastSentTime < 1500 && !isAdmin) {
      setError("Please wait 1.5s between messages.");
      return;
    }

    const content = formData.get("content") as string;
    if (!content.trim()) return;

    setIsSubmitting(true);
    setLastSentTime(now);

    try {
      const result = await sendMessage(formData);
      if (result.error) {
        setError(result.error);
        resetTurnstile();
      } else {
        formRef.current?.reset();
        resetTurnstile();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      
      {error && <p className="text-red-400 text-xs px-2">{error}</p>}
      
      <form 
        ref={formRef}
        action={handleSubmit}
        className="flex items-center gap-3 relative"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            name="content"
            disabled={(isFrozen && !isAdmin) || isSubmitting}
            placeholder={(isFrozen && !isAdmin) ? "Chat is frozen..." : "Type your message... (/ for commands)"}
            className="w-full bg-black/40 border border-white/10 rounded-full py-3 px-6 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
            autoComplete="off"
            maxLength={500}
          />
          {/* Turnstile hidden input container */}
          <div className="hidden">
            <div ref={turnstileRef} className="cf-turnstile" data-sitekey={SITE_KEY}></div>
          </div>
        </div>

        <button
          type="submit"
          disabled={(isFrozen && !isAdmin) || isSubmitting}
          className="h-11 w-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="-ml-0.5" />}
        </button>
      </form>
    </div>
  );
}

// Ensure window.turnstile type exists
declare global {
  interface Window {
    turnstile: any;
  }
}
