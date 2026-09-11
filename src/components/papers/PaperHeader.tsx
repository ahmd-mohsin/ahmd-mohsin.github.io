/**
 * PaperHeader — light top bar for /papers routes. White background, black text,
 * Stanford-red accent. Plain anchors back to the home page and the writing index.
 */
export function PaperHeader() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-black/10">
      <div className="max-w-3xl mx-auto px-6 h-12 flex items-center justify-between gap-4">
        <a href="/" className="font-mono text-xs text-[#8C1515] hover:text-black transition-colors shrink-0 tracking-wider">
          mohsin
        </a>
        <div className="flex items-center gap-6">
          <a href="/#research" className="hidden sm:inline text-[11px] font-mono text-neutral-500 hover:text-[#8C1515] transition-colors uppercase tracking-widest">
            Research
          </a>
          <a href="/writing" className="text-[11px] font-mono text-neutral-500 hover:text-[#8C1515] transition-colors uppercase tracking-widest">
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
