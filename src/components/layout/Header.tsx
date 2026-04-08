"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, Inbox, LogIn } from 'lucide-react';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Gamepad2 },
    { name: 'Requests', href: '/requests', icon: Inbox },
    { name: 'Login', href: '/login', icon: LogIn },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8 mx-auto">
        <Link href="/" className="mr-8 flex items-center space-x-2 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground transition-colors">
            <span className="font-bold text-lg leading-none">E</span>
          </div>
          <span className="font-heading font-bold text-xl tracking-wider text-foreground">
            EdCube
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center space-x-2 md:space-x-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 flex items-center gap-2 transition-colors hover:text-foreground group ${isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}
                >
                  <Icon className="w-4 h-4 transition-colors" />
                  <span className="hidden sm:inline-block">{item.name}</span>
                  {isActive && (
                    <div className="absolute left-0 -bottom-[1px] w-full h-[2px] bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
