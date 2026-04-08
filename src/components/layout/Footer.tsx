export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t border-border bg-background relative z-10">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} <span className="font-heading font-semibold text-primary">EdCube</span>. Built for gamers.
        </p>
        <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
          <a href="/dmca" className="hover:text-foreground transition-colors">DMCA</a>
          <a href="/proxy" className="hover:text-foreground transition-colors">Proxy</a>
        </div>
      </div>
    </footer>
  );
}
