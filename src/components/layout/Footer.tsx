"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = [
  { name: "DMCA", href: "/dmca" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Game Request", href: "/game-requests" },
  { name: "Bug Report", href: "/bug-report" },
];

export function Footer() {
  const pathname = usePathname();

  // Don't render footer on the landing/splash page
  if (pathname === "/") return null;

  return (
    <footer className="w-full border-t-2 border-border glass-bar mt-20 relative z-10">
      <div className="w-[90%] max-w-[1400px] mx-auto py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground text-center md:text-left font-heading">
          Copyright &copy; 2024-{new Date().getFullYear()} All Rights Reserved by{" "}
          <span className="text-primary font-semibold">EdCube</span>.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-primary transition-colors duration-300 font-heading text-xs uppercase tracking-wider"
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://discord.gg/WkhHFKq8Z3"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors duration-300 font-heading text-xs uppercase tracking-wider"
          >
            Discord
          </a>
        </div>
      </div>
    </footer>
  );
}
