import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { SiGooglescholar, SiGithub, SiX } from "react-icons/si";
import { PiBookOpenTextFill } from "react-icons/pi";
import { GlassPanel } from "@/components/GlassPanel";

export function HeroSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-24 w-full">
          <GlassPanel className="p-8 md:p-10 max-w-2xl">
          <div className="text-center md:text-left">
            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#8aa090] mb-7"
            >
              Graduate Student · Stanford · SAIL
            </motion.p>

            {/* Name — large serif */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.7 }}
              className="text-5xl md:text-7xl lg:text-[5.25rem] font-bold tracking-[-0.02em] leading-[1.06] text-[#e8f0ea] mb-7"
            >
              Muhammad<br />Ahmed Mohsin
            </motion.h1>

            {/* Affiliation — italic serif */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.55 }}
              className="italic text-sm text-[#8aa090] leading-relaxed max-w-xl mb-6"
            >
              Co-advised by{" "}
              <a
                href="https://statistics.stanford.edu/people/emily-b-fox"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5fae7a] hover:text-[#8fd6a6] transition-colors underline underline-offset-4 decoration-[#7aa686]/40 hover:decoration-[#5fae7a] font-medium"
              >
                Dr. Emily Fox
              </a>{" "}
              and{" "}
              <a
                href="https://cioffi-group.stanford.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5fae7a] hover:text-[#8fd6a6] transition-colors underline underline-offset-4 decoration-[#7aa686]/40 hover:decoration-[#5fae7a] font-medium"
              >
                Dr. John M. Cioffi
              </a>
            </motion.p>

            {/* Research bio */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.55 }}
              className="space-y-3 max-w-xl"
            >
              <p className="text-sm font-semibold leading-relaxed text-[#b9c8bd]">
                Research on preference optimization and alignment for LLMs,
                adaptive test-time scaling and discovery, and self-evolving
                multi-agent systems.
              </p>
              <p className="text-sm font-semibold leading-relaxed text-[#b9c8bd]">
                Graduate student at Stanford — LLM post-training, test-time
                scaling, and reinforcement learning. Collaborations with Google
                DeepMind, Meta, Amazon AGI, and Microsoft Core AI.
              </p>
            </motion.div>

            {/* Social icons + alexein.ai */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.55 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-5 mt-9"
            >
              {[
                { href: "mailto:muahmed@stanford.edu", label: "Email", icon: <Mail className="w-5 h-5" strokeWidth={2.5} /> },
                { href: "https://scholar.google.co.uk/citations?user=ccxOv_QAAAAJ&hl=en", label: "Google Scholar", icon: <SiGooglescholar className="w-5 h-5" />, external: true },
                { href: "https://dblp.org/pid/354/9627.html", label: "DBLP", icon: <PiBookOpenTextFill className="w-5 h-5" />, external: true },
                { href: "https://github.com/ahmd-mohsin", label: "GitHub", icon: <SiGithub className="w-5 h-5" />, external: true },
                { href: "https://twitter.com/ahmedmohsin7338", label: "X", icon: <SiX className="w-5 h-5" />, external: true },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  title={item.label}
                  aria-label={item.label}
                  className="text-[#b9c8bd] hover:text-[#5fae7a] transition-colors duration-200"
                >
                  {item.icon}
                </a>
              ))}

              <span className="w-px h-5 bg-[#7aa686]/30" />

              <a
                href="/Masters.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] font-semibold text-[#b9c8bd] hover:text-[#5fae7a] transition-colors border border-[#7aa686]/30 hover:border-[#5fae7a]/50 bg-[#0f1613]/60 px-3 py-1.5"
              >
                CV ↗
              </a>

              <a
                href="https://alexein.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] font-semibold text-[#b9c8bd] hover:text-[#5fae7a] transition-colors border border-[#7aa686]/30 hover:border-[#5fae7a]/50 bg-[#0f1613]/60 px-3 py-1.5"
              >
                alexein.ai ↗
              </a>
            </motion.div>
          </div>
          </GlassPanel>
      </div>
    </section>
  );
}
