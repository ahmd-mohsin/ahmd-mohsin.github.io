import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { SiGooglescholar, SiGithub, SiX } from "react-icons/si";
import { PiBookOpenTextFill } from "react-icons/pi";

export function HeroSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen overflow-hidden bg-[#0f0f0f] flex items-center"
    >
      {/* Dot grid — fades from top, invisible at bottom */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 70% at 50% 0%, black 20%, transparent 75%)",
          maskImage:
            "radial-gradient(ellipse 100% 70% at 50% 0%, black 20%, transparent 75%)",
        }}
      />

      {/* Subtle top-center radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 35% at 50% -5%, rgba(255,255,255,0.07) 0%, transparent 100%)",
        }}
      />

      {/* Left edge fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0f0f0f] to-transparent" />
      {/* Right edge fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0f0f0f] to-transparent" />
      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0f0f0f] to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-24 w-full">
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-20">

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/30 mb-6">
                Graduate Researcher · Stanford SAIL
              </p>
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.03em] leading-[1.05] mb-6 text-white">
                Muhammad<br />Ahmed Mohsin
              </h1>
            </motion.div>

            {/* Affiliation */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <p className="text-sm text-white/40 leading-relaxed max-w-xl mb-2">
                Co-advised by{" "}
                <a
                  href="https://statistics.stanford.edu/people/emily-b-fox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Dr. Emily Fox
                </a>{" "}
                and{" "}
                <a
                  href="https://cioffi-group.stanford.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Dr. John M. Cioffi
                </a>
              </p>
            </motion.div>

            {/* Research Description */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-6 space-y-3 max-w-xl"
            >
              <p className="text-sm text-white/50 leading-relaxed mx-auto md:mx-0">
                Research on LLM post-training and inference — preference
                optimization, active learning, alignment for reasoning models,
                and adaptive agentic test-time compute.
              </p>
              <p className="text-sm text-white/35 leading-relaxed mx-auto md:mx-0">
                Also working on Internet of Evolving Agents frameworks and
                applied reinforcement learning for complex, non-stationary
                decision-making.
              </p>
            </motion.div>

            {/* Social + Conoid */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-5 mt-8"
            >
              {[
                { href: "mailto:muahmed@stanford.edu", label: "Email", icon: <Mail className="w-4 h-4" /> },
                { href: "https://scholar.google.co.uk/citations?user=ccxOv_QAAAAJ&hl=en", label: "Google Scholar", icon: <SiGooglescholar className="w-4 h-4" />, external: true },
                { href: "https://dblp.org/pid/354/9627.html", label: "DBLP", icon: <PiBookOpenTextFill className="w-4 h-4" />, external: true },
                { href: "https://github.com/ahmd-mohsin", label: "GitHub", icon: <SiGithub className="w-4 h-4" />, external: true },
                { href: "https://twitter.com/ahmedmohsin7338", label: "X", icon: <SiX className="w-4 h-4" />, external: true },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  title={item.label}
                  aria-label={item.label}
                  className="text-white/25 hover:text-white/80 transition-colors duration-200"
                >
                  {item.icon}
                </a>
              ))}

              <span className="w-px h-4 bg-white/10" />

              <a
                href="https://conoid.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-white/30 hover:text-white/70 transition-colors border border-white/10 hover:border-white/25 px-3 py-1.5"
              >
                conoid.ai ↗
              </a>
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="flex-shrink-0"
          >
            <div className="relative">
              {/* Glow behind photo */}
              <div className="absolute -inset-4 bg-white/[0.03] blur-2xl" />
              <div className="relative w-52 h-52 md:w-72 md:h-72 overflow-hidden border border-white/10 bg-[#141414]">
                <img
                  src="/ahmed.jpeg"
                  alt="Muhammad Ahmed Mohsin"
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                  draggable={false}
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
