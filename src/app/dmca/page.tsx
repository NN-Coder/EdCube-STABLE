"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

function DMCAForm() {
  const [email, setEmail] = useState("");
  const [contentName, setContentName] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    // Auto-fill from query params
    const game = searchParams.get("game");
    if (game) {
      setContentName(game);
    }

    // Auto-fill email if logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setEmail(user.email);
      }
    });
  }, [searchParams, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("dmca_requests").insert({
      user_id: user?.id || null,
      contact_email: email,
      content_name: contentName,
      reason,
    });

    if (error) {
      setStatus({ type: "error", message: "Failed to submit request. Please try again." });
    } else {
      setStatus({ type: "success", message: "Your takedown request has been submitted successfully." });
      setContentName("");
      setReason("");
      if (!user) setEmail("");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center min-h-[60vh] px-[5%] py-12">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl p-8 relative overflow-hidden">
        <h1 className="text-4xl font-heading font-bold text-primary neon-glow mb-2 uppercase tracking-wider text-center">
          DMCA Takedown
        </h1>
        <p className="text-muted-foreground text-sm text-center mb-8">
          If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on EdCube, please notify us by filling out this form.
        </p>

        {status && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm ${
            status.type === "success" 
              ? "bg-primary/10 border border-primary/30 text-primary" 
              : "bg-destructive/10 border border-destructive/30 text-destructive"
          }`}>
            {status.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground ml-1">Contact Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 rounded-lg border border-input bg-background/50 px-4 text-sm text-foreground transition-all duration-300 focus:outline-none focus:border-primary"
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contentName" className="text-sm font-medium text-foreground ml-1">Name of Content to Take Down</label>
            <input
              id="contentName"
              type="text"
              required
              value={contentName}
              onChange={(e) => setContentName(e.target.value)}
              className="w-full h-12 rounded-lg border border-input bg-background/50 px-4 text-sm text-foreground transition-all duration-300 focus:outline-none focus:border-primary"
              placeholder="e.g. Basket Random"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium text-foreground ml-1">Reason for Takedown</label>
            <textarea
              id="reason"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full min-h-[120px] rounded-lg border border-input bg-background/50 p-4 text-sm text-foreground transition-all duration-300 focus:outline-none focus:border-primary resize-y"
              placeholder="Please provide details about the copyright infringement..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-lg text-sm font-bold tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? "Submitting..." : (
              <>
                <Send className="w-4 h-4" /> Submit Request
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DMCAPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading...</div>}>
      <DMCAForm />
    </Suspense>
  );
}
