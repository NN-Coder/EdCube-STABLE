"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Globe, MessageCircle, ExternalLink } from "lucide-react";
import { openBlank } from "@/lib/cloak";
import { AuthButton } from "./AuthButton";

export function Header() {
  const pathname = usePathname();

  // Don't render header on the landing/splash page
  if (pathname === "/") return null;

  const navLinks = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Proxy", href: "/proxy", icon: Globe },
    { name: "Chat", href: "/chat", icon: MessageCircle },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border glass-bar">
      <div className="w-[90%] max-w-[1400px] mx-auto flex items-center justify-between py-3 flex-wrap gap-3">
        {/* Logo */}
        <Link href="/home" className="flex items-center shrink-0">
          <Image
            src="/logo.jpg"
            alt="EdCube Logo"
            width={50}
            height={50}
            className="rounded-lg transition-transform duration-300 hover:-translate-y-0.5"
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-[clamp(10px,2vw,20px)]">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 transition-all duration-300 hover:-translate-y-0.5 group ${
                  isActive
                    ? "text-accent"
                    : "text-primary hover:text-accent hover:drop-shadow-[0_0_15px_rgba(0,255,204,0.4)]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[0.75rem] font-medium uppercase tracking-wider font-heading">
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* Cloak button */}
          <button
            onClick={openBlank}
            className="flex flex-col items-center gap-1 text-primary transition-all duration-300 hover:text-accent hover:drop-shadow-[0_0_15px_rgba(0,255,204,0.4)] hover:-translate-y-0.5 bg-transparent border-none p-0 font-heading"
          >
            <ExternalLink className="w-5 h-5" />
            <span className="text-[0.75rem] font-medium uppercase tracking-wider">
              Cloak
            </span>
          </button>

          {/* Profile / Auth */}
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}
