import { GlassPanel } from "@/components/GlassPanel";

export function Footer() {
  return (
    <footer className="py-10 flex justify-center px-6">
      <GlassPanel className="px-6 py-3">
        <p className="font-mono text-[10px] text-[#c79bad] tracking-[0.2em] uppercase">
          &copy; 2021 – 2026 Muhammad Ahmed Mohsin
        </p>
      </GlassPanel>
    </footer>
  );
}
