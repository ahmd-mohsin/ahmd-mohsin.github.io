/**
 * writing.ts — content model for the Writing section.
 *
 * Add posts to the `posts` array below. Two kinds:
 *   - kind: "blog"  → a local article rendered at /writing/<slug> from `content`
 *                     (Markdown; GitHub-flavored). Give it a slug, title, date,
 *                     description, and content.
 *   - kind: "paper" → a short entry that links out (set `external` to the URL,
 *                     e.g. arXiv). No local page is generated.
 *
 * `date` is a display string (e.g. "August 2026"). `readingTime` is optional.
 */

export type PostKind = "blog" | "paper";

export interface Post {
  slug: string;
  title: string;
  kind: PostKind;
  date: string;
  description: string;
  readingTime?: string;
  external?: string; // if set, the entry links out instead of rendering a page
  content?: string; // Markdown body for local ("blog") posts
  ogImage?: string; // social-card image path under /public (e.g. "/og/foo.png")
}

export const posts: Post[] = [
  {
    slug: "agents-that-whisper",
    title: "When Agents Learn to Whisper",
    kind: "blog",
    date: "September 2026",
    readingTime: "10 min read",
    description:
      "Reward optimization can teach two agents a private code that looks like English but hides information from a monitor. A cheap partner-swap probe catches it, and the same property that keeps a channel auditable is the one that makes it generalize.",
    ogImage: "/og/agents-that-whisper.png",
  },
  {
    slug: "coverage-preservation-rlvr",
    title: "The Answers Reinforcement Learning Learns to Forget",
    kind: "blog",
    date: "August 2026",
    readingTime: "9 min read",
    description:
      "RLVR raises pass@1 but narrows reasoning coverage. A base-anchored, off-policy support floor preserves the modes GRPO cannot protect, and turns that coverage into a higher continued-RL ceiling.",
    ogImage: "/og/coverage-preservation-rlvr.png",
    // Rendered by a custom React body (see writing/registry.tsx) so it can
    // interleave figures. No Markdown content.
  },
];

export const localPosts = posts.filter((p) => p.kind === "blog" && !p.external);
export const paperPosts = posts.filter((p) => p.kind === "paper");

export function getPost(slug: string): Post | undefined {
  return localPosts.find((p) => p.slug === slug);
}
