import { PaperHeader } from "@/components/papers/PaperHeader";

/**
 * Light, black-and-white reading chrome for /papers routes. White background,
 * near-black text, Stanford-red accents. Overrides the site's dark theme.
 */
export default function PapersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <PaperHeader />
      {children}
    </div>
  );
}
