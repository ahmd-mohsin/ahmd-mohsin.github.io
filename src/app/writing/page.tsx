import type { Metadata } from "next";
import { localPosts, paperPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing — Ahmad Mohsin",
  description: "Papers, research notes, and blog posts by Muhammad Ahmed Mohsin.",
};

export default function WritingIndex() {
  return (
    <main className="max-w-2xl mx-auto px-6 pt-28 pb-28">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f48fb1] mb-5">
        Writing
      </p>
      <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-[#f7ecf1] mb-5">
        Notes &amp; Essays
      </h1>
      <p className="text-sm leading-relaxed text-[#c79bad] italic mb-16 max-w-xl">
        Writing about my papers, research, and the occasional longer post on
        preference optimization, test-time scaling, and agentic systems.
      </p>

      {localPosts.length > 0 && (
        <section className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8a6a78] mb-6">
            Posts
          </p>
          <ul>
            {localPosts.map((p) => (
              <li key={p.slug}>
                <a
                  href={`/writing/${p.slug}`}
                  className="group block border-t border-[#b07f95]/20 py-6"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-lg font-semibold text-[#f7ecf1] group-hover:text-[#ffc1d9] transition-colors leading-snug">
                      {p.title}
                    </h2>
                    <span className="font-mono text-[10px] text-[#8a6a78] shrink-0 whitespace-nowrap">
                      {p.date}
                    </span>
                  </div>
                  <p className="text-sm text-[#c79bad] leading-relaxed mt-2">
                    {p.description}
                  </p>
                  {p.readingTime && (
                    <span className="font-mono text-[10px] text-[#8a6a78] mt-2 inline-block">
                      {p.readingTime}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {paperPosts.length > 0 && (
        <section>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8a6a78] mb-6">
            Papers
          </p>
          <ul>
            {paperPosts.map((p) => (
              <li key={p.slug}>
                <a
                  href={p.external}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block border-t border-[#b07f95]/20 py-6"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-lg font-semibold text-[#f7ecf1] group-hover:text-[#ffc1d9] transition-colors leading-snug">
                      {p.title} <span className="text-[#f48fb1] text-sm">↗</span>
                    </h2>
                    <span className="font-mono text-[10px] text-[#8a6a78] shrink-0 whitespace-nowrap">
                      {p.date}
                    </span>
                  </div>
                  <p className="text-sm text-[#c79bad] leading-relaxed mt-2">
                    {p.description}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
