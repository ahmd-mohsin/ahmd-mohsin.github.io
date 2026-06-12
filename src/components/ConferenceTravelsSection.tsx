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
            <div className="max-w-4xl mx-auto">
                {/* Image carousel */}
                <div className="relative overflow-hidden">
                    <div className="relative aspect-[16/10] w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.35, ease: "easeInOut" }}
                                className="absolute inset-0"
                            >
                                {/* Blurred background fill */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-20 scale-110"
                                    style={{ backgroundImage: `url(${travels[current].image})` }}
                                />

                                {/* Main image */}
                                <img
                                    src={travels[current].image}
                                    alt={travels[current].event}
                                    className="relative w-full h-full object-contain z-10"
                                />

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#070d07]/80 via-transparent to-transparent z-20" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Arrow buttons */}
                        <button
                            onClick={prev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3d5239] hover:text-[#c8d4c0] transition-colors z-50 p-2"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d5239] hover:text-[#c8d4c0] transition-colors z-50 p-2"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Caption overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <h3 className="font-semibold text-base text-[#f0f4ee] mb-1">
                                        {travels[current].event}
                                    </h3>
                                    <p className="text-xs text-[#7a9472] font-mono">
                                        {travels[current].location}
                                    </p>
                                    <p className="text-xs text-[#3d5239] mt-1">
                                        {travels[current].caption}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Dash navigation */}
                <div className="flex items-center justify-center gap-2 mt-5">
                    {travels.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`h-px transition-all duration-300 ${
                                i === current
                                    ? "w-8 bg-[#5a8c52]"
                                    : "w-4 bg-[#1a2818] hover:bg-[#3d5239]"
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </Section>
    );
}
