/**
 * writing.ts — content model for the Writing section.
 *
 * Two kinds of local article:
 *   - kind: "blog"  → an essay rendered at /writing/<slug>. Dark pink theme.
 *   - kind: "paper" → a research-paper writeup rendered at /papers/<slug>.
 *                     Black-and-white theme with Stanford-red headings and charts.
 *
 * Both render a custom React body registered by slug in writing/registry.tsx,
 * or Markdown `content` as a fallback. `date` is a display string.
 */

export type PostKind = "blog" | "paper";

export interface Post {
  slug: string;
  title: string;
  kind: PostKind;
  date: string;
  description: string;
  readingTime?: string;
  authors?: string; // for papers
  venue?: string; // for papers, e.g. "ICML 2026"
  external?: string; // optional link out (e.g. arXiv)
  content?: string; // Markdown body fallback
  ogImage?: string; // social-card image under /public
}

export const posts: Post[] = [
  {
    slug: "cu-dpo",
    title: "Continuous-Utility Direct Preference Optimization",
    kind: "paper",
    date: "September 2026",
    readingTime: "9 min read",
    authors: "Muhammad Ahmed Mohsin, Muhammad Umer, Emily Fox",
    venue: "Stanford University",
    description:
      "Reasoning is not one skill. CU-DPO replaces binary preference labels with continuous utilities over a portfolio of reasoning strategies, recovers the utility-maximizing policy, and lifts strategy-selection accuracy from 35 to 46 percent up to 68 to 78 percent across seven base models.",
    ogImage: "/og/cu-dpo.png?v=2",
  },
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
  },
];

export const blogPosts = posts.filter((p) => p.kind === "blog");
export const paperPosts = posts.filter((p) => p.kind === "paper");

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
