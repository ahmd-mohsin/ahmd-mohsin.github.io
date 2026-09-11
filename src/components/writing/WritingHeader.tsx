/**
 * WritingHeader — a compact fixed top bar for the Writing routes. Plain anchors
 * (server component): the logo and section links point back to the home page,
 * "Writing" is the active tab.
 */
const homeLinks = [
  { name: "About", href: "/#about" },
  { name: "Research", href: "/#research" },
  { name: "News", href: "/#news" },
];

export function WritingHeader() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-3xl mx-auto px-6 h-12 flex items-center justify-between gap-4">
        <a
          href="/"
          className="font-mono text-xs text-[#8C1515] hover:text-[#6f1010] transition-colors shrink-0 tracking-wider"
        >
          mohsin
        </a>
        <div className="flex items-center gap-6">
          {homeLinks.map((l) => (
            <a
              key={l.name}
              href={l.href}
              className="hidden sm:inline text-[11px] font-mono text-[#4b5563] hover:text-[#8C1515] transition-colors uppercase tracking-widest"
            >
              {l.name}
            </a>
          ))}
          <a
            href="/writing"
            className="text-[11px] font-mono text-[#8C1515] uppercase tracking-widest"
            aria-current="page"
          >
            Writing
          </a>
          <a href="https://www.stanford.edu/" target="_blank" rel="noopener noreferrer" aria-label="Stanford University" className="shrink-0">
            <img src="/stanford.jpeg" alt="Stanford" className="h-7 w-auto" />
          </a>
        </div>
      </div>
    </nav>
  );
}
