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
        prose-headings:font-sans prose-headings:text-[#f7ecf1] prose-headings:font-semibold
        prose-h2:text-xl prose-h2:mt-12 prose-h3:text-lg
        prose-p:text-[#e2cdd6] prose-p:leading-relaxed
        prose-li:text-[#e2cdd6] prose-li:marker:text-[#b07f95]
        prose-strong:text-[#f7ecf1]
        prose-a:text-[#f48fb1] prose-a:no-underline hover:prose-a:text-[#ffc1d9] prose-a:underline-offset-4 hover:prose-a:underline
        prose-code:text-[#ffc1d9] prose-code:font-mono prose-code:text-[13px]
        prose-blockquote:border-l-2 prose-blockquote:border-[#f48fb1]/60 prose-blockquote:text-[#c79bad] prose-blockquote:not-italic
        prose-hr:border-[#b07f95]/20
        prose-img:border prose-img:border-[#b07f95]/20"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
