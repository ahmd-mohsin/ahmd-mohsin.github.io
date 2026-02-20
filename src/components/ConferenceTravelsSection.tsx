import { Section } from "@/components/Section";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const travels = [
    {
        image: "/ieeeglobecom2024_1.jpeg",
        event: "IEEE Globecom 2024",
        location: "Cape Town, South Africa",
        caption: "Presenting research on AI-driven wireless networks",
    },
    {
        image: "/ieeeglobecom2024_2.jpeg",
        event: "IEEE Globecom 2024",
        location: "Cape Town, South Africa",
        caption: "Presenting research on AI-driven wireless networks",
    },
    {
        image: "/ieeeicc2025_1.jpeg",
        event: "IEEE ICC 2025",
        location: "Montreal, Canada",
        caption: "Best Workshop Paper Award for RAG-optimized wireless perception",
    },
    {
        image: "/ieeeicc2025_2.jpeg",
        event: "IEEE ICC 2025",
        location: "Montreal, Canada",
        caption: "Best Workshop Paper Award for RAG-optimized wireless perception",
    },

];

export function ConferenceTravelsSection() {
    const [current, setCurrent] = useState(0);

    const prev = () =>
        setCurrent((c) => (c === 0 ? travels.length - 1 : c - 1));
    const next = () =>
        setCurrent((c) => (c === travels.length - 1 ? 0 : c + 1));

    return (
        <Section id="travels" title="Conference Travels">
            <div className="max-w-5xl mx-auto">
                {/* Image carousel */}
                <div className="relative overflow-hidden border border-white/20 bg-white/[0.02]">
                    <div className="relative aspect-[16/10]  w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current}
                                initial={{ opacity: 0, x: 60 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -60 }}
                                transition={{ duration: 0.35, ease: "easeInOut" }}
                                className="absolute inset-0"
                            >
                                {/* Blurred background for fill */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 scale-110"
                                    style={{ backgroundImage: `url(${travels[current].image})` }}
                                />

                                {/* Main image */}
                                <img
                                    src={travels[current].image}
                                    alt={travels[current].event}
                                    className="relative w-full h-full object-contain z-10"
                                />

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Arrow buttons */}
                        <button
                            onClick={prev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 md:w-10 md:h-10 flex items-center justify-center bg-black/20 border border-white/20 text-white/70 hover:text-white hover:bg-black/60 transition-colors z-50"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 md:w-10 md:h-10 flex items-center justify-center bg-black/20 border border-white/20 text-white/70 hover:text-white hover:bg-black/60 transition-colors z-50"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Caption overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <h3 className="font-display font-bold text-lg md:text-xl text-white mb-1">
                                        {travels[current].event}
                                    </h3>
                                    <p className="text-sm text-white/70 font-mono">
                                        {travels[current].location}
                                    </p>
                                    <p className="text-xs text-white/50 mt-2">
                                        {travels[current].caption}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Dot navigation */}
                <div className="flex items-center justify-center gap-3 mt-6">
                    {travels.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current
                                ? "bg-white scale-110"
                                : "bg-white/20 hover:bg-white/40"
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </Section>
    );
}
