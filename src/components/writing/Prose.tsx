"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Prose — renders a Markdown string with tailwind-typography, themed to the
 * pink-on-black palette. Client component so react-markdown resolves cleanly.
 */
export function Prose({ content }: { content: string }) {
  return (
    <div
      className="prose prose-invert max-w-none
        prose-headings:font-sans prose-headings:text-[#8C1515] prose-headings:font-semibold
        prose-h2:text-xl prose-h2:mt-12 prose-h3:text-lg
        prose-p:text-[#262626] prose-p:leading-relaxed
        prose-li:text-[#262626] prose-li:marker:text-[#d4d4d8]
        prose-strong:text-[#8C1515]
        prose-a:text-[#8C1515] prose-a:no-underline hover:prose-a:text-[#6f1010] prose-a:underline-offset-4 hover:prose-a:underline
        prose-code:text-[#6f1010] prose-code:font-mono prose-code:text-[13px]
        prose-blockquote:border-l-2 prose-blockquote:border-[#8C1515]/60 prose-blockquote:text-[#4b5563] prose-blockquote:not-italic
        prose-hr:border-[#d4d4d8]/20
        prose-img:border prose-img:border-[#d4d4d8]/20"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
