import { Section } from "@/components/Section";
import { GlassPanel } from "@/components/GlassPanel";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const travels = [
  { image: "/ICASSP.jpeg", event: "IEEE ICASSP 2026", location: "Barcelona, Spain", caption: "Presenting work on diffusion models and non-stationary channel estimation" },
  { image: "/ieeeglobecom2024_1.jpeg", event: "IEEE Globecom 2024", location: "Cape Town, South Africa", caption: "Presenting research on AI-driven wireless networks" },
  { image: "/ieeeglobecom2024_2.jpeg", event: "IEEE Globecom 2024", location: "Cape Town, South Africa", caption: "Presenting research on AI-driven wireless networks" },
  { image: "/ieeeicc2025_1.jpeg", event: "IEEE ICC 2025", location: "Montreal, Canada", caption: "Best Workshop Paper Award for RAG-optimized wireless perception" },
  { image: "/ieeeicc2025_2.jpeg", event: "IEEE ICC 2025", location: "Montreal, Canada", caption: "Best Workshop Paper Award for RAG-optimized wireless perception" },
];

export function ConferenceTravelsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? travels.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === travels.length - 1 ? 0 : c + 1));

  return (
    <Section id="travels" title="Conference Travels">
      <GlassPanel className="p-6 md:p-8">
      <div className="grid md:grid-cols-[1fr_260px] gap-8 items-start">
        {/* Main image */}
        <div className="relative overflow-hidden bg-[#0b1210] aspect-[4/3] border border-[#b07f95]/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 scale-110"
                style={{ backgroundImage: `url(${travels[current].image})` }}
              />
              <img src={travels[current].image} alt={travels[current].event} className="relative w-full h-full object-contain z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b0a]/50 via-transparent to-transparent z-20" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <p className="text-sm font-semibold text-[#f7ecf1] mb-1">{travels[current].event}</p>
              <p className="font-mono text-[11px] text-[#c79bad] mb-3">{travels[current].location}</p>
              <p className="text-xs text-[#e2cdd6] leading-relaxed italic">{travels[current].caption}</p>
            </motion.div>
          </AnimatePresence>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
            {travels.map((t, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`relative overflow-hidden aspect-square border transition-all duration-200 ${
                  i === current ? "border-[#f48fb1] opacity-100" : "border-[#b07f95]/20 opacity-40 hover:opacity-70"
                }`}
                aria-label={`View ${t.event}`}
              >
                <img src={t.image} alt={t.event} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button onClick={prev} className="font-mono text-[10px] text-[#c79bad] hover:text-[#f48fb1] transition-colors tracking-widest uppercase" aria-label="Previous">
              ← Prev
            </button>
            <span className="text-[#8a6a78]">·</span>
            <button onClick={next} className="font-mono text-[10px] text-[#c79bad] hover:text-[#f48fb1] transition-colors tracking-widest uppercase" aria-label="Next">
              Next →
            </button>
            <span className="ml-auto font-mono text-[10px] text-[#8a6a78]">
              {current + 1} / {travels.length}
            </span>
          </div>
        </div>
      </div>
      </GlassPanel>
    </Section>
  );
}
