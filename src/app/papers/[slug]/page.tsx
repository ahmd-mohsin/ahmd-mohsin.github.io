import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, paperPosts } from "@/lib/writing";
import { customBodies } from "@/components/writing/registry";

// Static export: one page per research-paper writeup.
export function generateStaticParams() {
  return paperPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Papers — Ahmad Mohsin" };
  const url = `/papers/${post.slug}/`;
  const images = post.ogImage
    ? [{ url: post.ogImage, width: 1200, height: 630, alt: post.title }]
    : undefined;
  return {
    title: `${post.title} — Ahmad Mohsin`,
    description: post.description,
    openGraph: { type: "article", title: post.title, description: post.description, url, siteName: "Ahmad Mohsin", images },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.ogImage ? [post.ogImage] : undefined,
      creator: "@ahmedmohsin7338",
    },
  };
}

export default function PaperPost({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post || post.kind !== "paper") notFound();
  const Body = customBodies[post.slug];

  return (
    <article className="max-w-3xl mx-auto px-6 pt-24 pb-28">
      <a
        href="/writing"
        className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500 hover:text-[#8C1515] transition-colors"
      >
        ← Writing
      </a>

      <header className="mt-8 mb-12 border-b border-black/10 pb-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8C1515] mb-4 flex flex-wrap items-center gap-3">
          <span>Paper</span>
          {post.venue && (
            <>
              <span className="text-black/30">·</span>
              <span className="text-neutral-500">{post.venue}</span>
            </>
          )}
          <span className="text-black/30">·</span>
          <span className="text-neutral-500">{post.date}</span>
        </div>
        <h1 className="text-3xl md:text-[2.6rem] font-bold tracking-[-0.02em] text-[#8C1515] leading-[1.12]">
          {post.title}
        </h1>
        {post.authors && (
          <p className="text-sm text-neutral-700 mt-4 font-medium">{post.authors}</p>
        )}
        {post.description && (
          <p className="text-[15px] text-neutral-600 leading-relaxed mt-4">{post.description}</p>
        )}
      </header>

      {Body ? <Body /> : null}
    </article>
  );
}
