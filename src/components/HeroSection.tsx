import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { SiGooglescholar, SiGithub, SiX } from "react-icons/si";
import { PiBookOpenTextFill } from "react-icons/pi";

export function HeroSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: "url(/picture.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
      }}
    >
      {/* Light mist — forest stays visible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(238,246,238,0.06) 0%, rgba(232,243,232,0.10) 50%, rgba(225,240,228,0.16) 100%)",
        }}
      />
      {/* Left scrim — readability for text without hiding the photo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(238,246,238,0.38) 0%, rgba(238,246,238,0.14) 48%, transparent 62%)",
        }}
      />
      {/* Bottom blend into page background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(238,244,238,0.50))",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-24 w-full">
          <div className="text-center md:text-left">
            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#0a1a0e] mb-7 [text-shadow:0_0_10px_rgba(238,244,238,0.95)]"
            >
              Graduate Student · Stanford · SAIL
            </motion.p>

            {/* Name — large serif */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.7 }}
              className="text-5xl md:text-7xl lg:text-[5.25rem] font-bold tracking-[-0.02em] leading-[1.06] text-[#1a3520] mb-7"
            >
              Muhammad<br />Ahmed Mohsin
            </motion.h1>

            {/* Affiliation — italic serif */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.55 }}
              className="italic text-sm text-[#0a1a0e] leading-relaxed max-w-xl mb-6 [text-shadow:0_0_10px_rgba(238,244,238,0.95)]"
            >
              Co-advised by{" "}
              <a
                href="https://statistics.stanford.edu/people/emily-b-fox"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#000000] hover:text-[#0a1a0e] transition-colors underline underline-offset-4 decoration-[#1a3520]/70 font-medium"
              >
                Dr. Emily Fox
              </a>{" "}
              and{" "}
              <a
                href="https://cioffi-group.stanford.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#000000] hover:text-[#0a1a0e] transition-colors underline underline-offset-4 decoration-[#1a3520]/70 font-medium"
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
              <p className="text-sm font-semibold leading-relaxed text-black [text-shadow:0_0_14px_rgba(238,244,238,1),0_0_6px_rgba(238,244,238,1)]">
                Research on preference optimization and alignment for LLMs,
                adaptive test-time scaling and discovery, and self-evolving
                multi-agent systems.
              </p>
              <p className="text-sm font-semibold leading-relaxed text-black [text-shadow:0_0_14px_rgba(238,244,238,1),0_0_6px_rgba(238,244,238,1)]">
                Graduate student at Stanford — LLM post-training, test-time
                scaling, and reinforcement learning. Collaborations with Google
                DeepMind, Meta, Amazon AGI, and Microsoft Core AI.
              </p>
            </motion.div>

            {/* Social icons + Conoid */}
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
                  className="text-black hover:text-[#0a1a0e] transition-colors duration-200 drop-shadow-[0_0_8px_rgba(238,244,238,1)]"
                >
                  {item.icon}
                </a>
              ))}

              <span className="w-px h-5 bg-[#a0c0a8]" />

              <a
                href="/Masters.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] font-semibold text-black hover:text-[#0a1a0e] transition-colors border border-black/80 hover:border-black bg-[#eef4ee]/92 px-3 py-1.5 shadow-[0_0_12px_rgba(238,244,238,0.95)]"
              >
                CV ↗
              </a>

              <a
                href="https://conoid.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] font-semibold text-black hover:text-[#0a1a0e] transition-colors border border-black/80 hover:border-black bg-[#eef4ee]/92 px-3 py-1.5 shadow-[0_0_12px_rgba(238,244,238,0.95)]"
              >
                conoid.ai ↗
              </a>
            </motion.div>
          </div>
      </div>
    </section>
  );
}
