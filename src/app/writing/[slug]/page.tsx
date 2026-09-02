import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, localPosts } from "@/lib/writing";
import { Prose } from "@/components/writing/Prose";
import { customBodies } from "@/components/writing/registry";

// Static export: prerender one page per local post.
export function generateStaticParams() {
  return localPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Writing — Ahmad Mohsin" };
  return {
    title: `${post.title} — Ahmad Mohsin`,
    description: post.description,
  };
}

export default function WritingPost({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="max-w-2xl mx-auto px-6 pt-28 pb-28">
      <a
        href="/writing"
        className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#c79bad] hover:text-[#f48fb1] transition-colors"
      >
        ← Writing
      </a>

      <div className="mt-8 mb-10 border-b border-[#b07f95]/20 pb-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8a6a78] mb-4 flex items-center gap-3">
          <span className="text-[#f48fb1]">{post.kind === "paper" ? "Paper" : "Post"}</span>
          <span className="text-[#b07f95]/40">·</span>
          <span>{post.date}</span>
          {post.readingTime && (
            <>
              <span className="text-[#b07f95]/40">·</span>
              <span>{post.readingTime}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-[#f7ecf1] leading-[1.1]">
          {post.title}
        </h1>
        {post.description && (
          <p className="text-sm text-[#c79bad] italic leading-relaxed mt-4">
            {post.description}
          </p>
        )}
      </div>

      {(() => {
        const Body = customBodies[post.slug];
        if (Body) return <Body />;
        if (post.content) return <Prose content={post.content} />;
        return null;
      })()}
    </article>
  );
}
