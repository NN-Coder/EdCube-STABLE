"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4 relative z-10 w-full min-h-[80vh]">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4 border border-border">
              <LogIn className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground tracking-wide">ACCESS <span className="text-primary">PORTAL</span></h1>
            <p className="text-sm text-muted-foreground mt-2 font-light">Enter credentials to sync your progress.</p>
          </div>
          
          <form className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase group-focus-within:text-primary transition-colors" htmlFor="email">Email</label>
              <input 
                className="flex h-12 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm text-foreground transition-all duration-300 placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary" 
                id="email" 
                type="email" 
                placeholder="USER@SYSTEM.NET" 
              />
            </div>
            <div className="space-y-2 group">
              <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase group-focus-within:text-primary transition-colors" htmlFor="password">Password</label>
              <input 
                className="flex h-12 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm text-foreground transition-all duration-300 placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary" 
                id="password" 
                type="password" 
                placeholder="••••••••"
              />
            </div>
            
            <button 
              className="w-full flex items-center justify-center rounded-lg text-sm font-bold tracking-widest uppercase transition-all bg-primary text-primary-foreground h-12 mt-8 hover:bg-primary/90" 
              type="button"
            >
              Initialize Link
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm border-t border-border pt-6">
            <p className="text-muted-foreground">
              UNREGISTERED ENTITY?{" "}
              <Link href="/signup" className="text-primary hover:underline underline-offset-4 font-medium transition-all">
                CREATE ACCOUNT
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
