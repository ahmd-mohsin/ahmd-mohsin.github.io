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
}

export const posts: Post[] = [
  {
    slug: "hello",
    title: "Hello — a placeholder post",
    kind: "blog",
    date: "August 2026",
    readingTime: "1 min read",
    description:
      "A placeholder so the Writing section renders. Replace this with real posts.",
    content: `This is a placeholder article to show the reading layout and typography.
Tell me what to publish here and I'll add your papers and blog posts.

## What this section is for

I'll use this space to write about my research — papers, notes, and the
occasional longer blog post on preference optimization, test-time scaling, and
agentic systems.

- Clean, readable typography
- Papers can link out (e.g. arXiv); blog posts render here
- Markdown with **bold**, _italics_, \`code\`, lists, and links

> Placeholder content — replace me.
`,
  },
];

export const localPosts = posts.filter((p) => p.kind === "blog" && !p.external);
export const paperPosts = posts.filter((p) => p.kind === "paper");

export function getPost(slug: string): Post | undefined {
  return localPosts.find((p) => p.slug === slug);
}
