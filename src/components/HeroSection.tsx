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
            "linear-gradient(160deg, rgba(238,246,238,0.18) 0%, rgba(232,243,232,0.24) 50%, rgba(225,240,228,0.34) 100%)",
        }}
      />
      {/* Left scrim — readability for text without hiding the photo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(238,246,238,0.58) 0%, rgba(238,246,238,0.28) 50%, transparent 72%)",
        }}
      />
      {/* Bottom blend into page background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(238,244,238,0.85))",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-24 w-full">
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#4a6852] mb-7"
            >
              Graduate Researcher · Stanford SAIL
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
              className="italic text-sm text-[#4a6852] leading-relaxed max-w-xl mb-6"
            >
              Co-advised by{" "}
              <a
                href="https://statistics.stanford.edu/people/emily-b-fox"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2d5035] hover:text-[#1a3520] transition-colors underline underline-offset-4 decoration-[#90aa98]/60"
              >
                Dr. Emily Fox
              </a>{" "}
              and{" "}
              <a
                href="https://cioffi-group.stanford.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2d5035] hover:text-[#1a3520] transition-colors underline underline-offset-4 decoration-[#90aa98]/60"
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
              <p className="text-sm leading-relaxed text-[#3a5440]">
                Research on LLM post-training and inference — preference
                optimization, active learning, alignment for reasoning models,
                and adaptive agentic test-time compute.
              </p>
              <p className="text-sm leading-relaxed text-[#5d7a65]">
                Also working on Internet of Evolving Agents frameworks and
                applied reinforcement learning for complex, non-stationary
                decision-making.
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
                  className="text-[#90aa98] hover:text-[#2d5035] transition-colors duration-200"
                >
                  {item.icon}
                </a>
              ))}

              <span className="w-px h-4 bg-[#c0d4c2]" />

              <a
                href="https://conoid.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-[#6a8a72] hover:text-[#2d5035] transition-colors border border-[#c0d4c2] hover:border-[#4a6852] px-3 py-1.5"
              >
                conoid.ai ↗
              </a>
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.9 }}
            className="flex-shrink-0"
          >
            <div className="relative w-52 h-52 md:w-72 md:h-72 overflow-hidden border border-[#a0c0a8]/50 shadow-[0_4px_40px_rgba(45,80,53,0.12)]">
              <img
                src="/ahmed.jpeg"
                alt="Muhammad Ahmed Mohsin"
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
