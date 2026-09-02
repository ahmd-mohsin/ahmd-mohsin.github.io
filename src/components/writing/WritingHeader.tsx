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
          className="font-mono text-xs text-[#f48fb1] hover:text-[#ffc1d9] transition-colors shrink-0 tracking-wider"
        >
          mohsin
        </a>
        <div className="flex items-center gap-6">
          {homeLinks.map((l) => (
            <a
              key={l.name}
              href={l.href}
              className="hidden sm:inline text-[11px] font-mono text-[#c79bad] hover:text-[#f48fb1] transition-colors uppercase tracking-widest"
            >
              {l.name}
            </a>
          ))}
          <a
            href="/writing"
            className="text-[11px] font-mono text-[#f48fb1] uppercase tracking-widest"
            aria-current="page"
          >
            Writing
          </a>
        </div>
      </div>
    </nav>
  );
}
