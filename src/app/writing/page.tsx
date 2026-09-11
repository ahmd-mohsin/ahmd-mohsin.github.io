import type { Metadata } from "next";
import { blogPosts, paperPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing — Ahmad Mohsin",
  description: "Research paper writeups and essays by Muhammad Ahmed Mohsin.",
};

export default function WritingIndex() {
  return (
    <main className="max-w-2xl mx-auto px-6 pt-28 pb-28">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8C1515] mb-5">
        Writing
      </p>
      <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-[#8C1515] mb-5">
        Notes &amp; Essays
      </h1>
      <p className="text-sm leading-relaxed text-[#4b5563] italic mb-16 max-w-xl">
        Research paper writeups and the occasional longer essay on preference
        optimization, test-time scaling, and agentic systems.
      </p>

      {paperPosts.length > 0 && (
        <section className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#9a9a9a] mb-6">
            Research Papers
          </p>
          <ul>
            {paperPosts.map((p) => (
              <li key={p.slug}>
                <a href={`/papers/${p.slug}`} className="group block border-t border-[#d4d4d8]/20 py-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-lg font-semibold text-[#8C1515] group-hover:text-[#6f1010] transition-colors leading-snug">
                      {p.title}
                    </h2>
                    <span className="font-mono text-[10px] text-[#9a9a9a] shrink-0 whitespace-nowrap">
                      {p.date}
                    </span>
                  </div>
                  {p.venue && (
                    <span className="font-mono text-[10px] text-[#8C1515] mt-1.5 inline-block">
                      {p.venue}
                    </span>
                  )}
                  <p className="text-sm text-[#4b5563] leading-relaxed mt-2">{p.description}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {blogPosts.length > 0 && (
        <section>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#9a9a9a] mb-6">
            Writing
          </p>
          <ul>
            {blogPosts.map((p) => (
              <li key={p.slug}>
                <a href={`/writing/${p.slug}`} className="group block border-t border-[#d4d4d8]/20 py-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-lg font-semibold text-[#8C1515] group-hover:text-[#6f1010] transition-colors leading-snug">
                      {p.title}
                    </h2>
                    <span className="font-mono text-[10px] text-[#9a9a9a] shrink-0 whitespace-nowrap">
                      {p.date}
                    </span>
                  </div>
                  <p className="text-sm text-[#4b5563] leading-relaxed mt-2">{p.description}</p>
                  {p.readingTime && (
                    <span className="font-mono text-[10px] text-[#9a9a9a] mt-2 inline-block">
                      {p.readingTime}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
