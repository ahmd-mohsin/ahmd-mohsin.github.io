import { WritingHeader } from "@/components/writing/WritingHeader";

/**
 * Shared chrome for all /writing routes: a fixed header and a calm, readable
 * black background with a subtle pink glow (no 3D canvas — reading focus).
 */
export default function WritingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen text-foreground"
      style={{
        backgroundColor: "#070b0a",
        backgroundImage:
          "radial-gradient(120% 80% at 80% -10%, rgba(244,143,177,0.10) 0%, rgba(7,11,10,0) 55%)",
      }}
    >
      <WritingHeader />
      {children}
    </div>
  );
}
