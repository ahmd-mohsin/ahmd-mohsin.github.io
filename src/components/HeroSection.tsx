import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { SiGooglescholar, SiGithub, SiX } from "react-icons/si";
import { PiBookOpenTextFill } from "react-icons/pi";

export function HeroSection() {
  return (
    <section
      id="about"
      className="relative min-h-[90vh] overflow-hidden bg-black pt-32 pb-32 flex items-center justify-center"
    >
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-yellow-700/10 blur-3xl" />
        <div className="absolute right-[-6rem] bottom-[-8rem] h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(202,138,4,0.08),transparent_30%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row-reverse items-center gap-14 md:gap-20">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-shrink-0 relative"
          >
            <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-yellow-700/30 via-amber-500/10 to-transparent blur-xl" />
            <div className="relative w-80 h-80 md:w-[32rem] md:h-[32rem] rounded-full overflow-hidden border border-yellow-700/30 ring-1 ring-yellow-500/20 shadow-[0_0_60px_rgba(234,179,8,0.12)] bg-zinc-950/90">
              <img
                src="/ahmed.jpeg"
                alt="Muhammad Ahmed Mohsin"
                className="w-full h-full object-cover scale-[1.02] hover:scale-[1.05] transition-transform duration-700"
                draggable={false}
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="text-center md:text-left flex-1">
            {/* Affiliation */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.65 }}
            >
              <p className="text-lg md:text-2xl italic text-zinc-400 leading-relaxed max-w-2xl mb-8 md:mb-10">
                I&apos;m a graduate student @{" "}
                <a
                  href="https://stanford.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-600 hover:text-yellow-400 transition-colors duration-300"
                >
                  SAIL (Stanford AI Lab)
                </a>{" "}
                co-advised by{" "}
                <a
                  href="https://statistics.stanford.edu/people/emily-b-fox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-600 hover:text-yellow-400 transition-colors duration-300"
                >
                  Dr. Emily Fox
                </a>{" "}
                and{" "}
                <a
                  href="https://cioffi-group.stanford.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-600 hover:text-yellow-400 transition-colors duration-300"
                >
                  Dr. John M. Cioffi
                </a>
              </p>
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.65 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 lowercase text-yellow-600 drop-shadow-[0_0_18px_rgba(202,138,4,0.22)]">
                Muhammad Ahmed Mohsin
              </h1>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6 md:mb-8"
            >
              <div className="h-px w-28 md:w-36 mx-auto md:mx-0 bg-gradient-to-r from-yellow-700 via-amber-500 to-transparent" />
            </motion.div>

            {/* Research Description */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.65 }}
              className="space-y-4"
            >
              <p className="text-base md:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto md:mx-0">
                My research focuses on LLM post-training and inference,
                including preference optimization, active learning, and
                alignment for reasoning models, alongside reinforcement
                learning for high-diversity generation and adaptive agentic
                test-time compute.
              </p>

              <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto md:mx-0 mb-10">
                I also develop Internet of Evolving Agents frameworks for
                self-evolving multi-agent systems with dynamic reputation
                modeling and social graph-based coordination, and work on
                applied reinforcement learning for complex, dynamic, and
                non-stationary decision-making, including RL methods tailored
                for LLM reasoning.
              </p>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.65 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-4"
              data-no-custom-cursor
            >
              {[
                {
                  href: "mailto:muahmed@stanford.edu",
                  label: "Email",
                  icon: <Mail className="w-5 h-5" />,
                },
                {
                  href: "https://scholar.google.co.uk/citations?user=ccxOv_QAAAAJ&hl=en",
                  label: "Google Scholar",
                  icon: <SiGooglescholar className="w-5 h-5" />,
                  external: true,
                },
                {
                  href: "https://dblp.org/pid/354/9627.html",
                  label: "DBLP",
                  icon: <PiBookOpenTextFill className="w-5 h-5" />,
                  external: true,
                },
                {
                  href: "https://github.com/ahmd-mohsin",
                  label: "GitHub",
                  icon: <SiGithub className="w-5 h-5" />,
                  external: true,
                },
                {
                  href: "https://twitter.com/ahmedmohsin7338",
                  label: "X",
                  icon: <SiX className="w-5 h-5" />,
                  external: true,
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  title={item.label}
                  aria-label={item.label}
                  className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-yellow-700/30 bg-zinc-950/80 text-zinc-300 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/60 hover:bg-yellow-600/10 hover:text-yellow-400 hover:shadow-[0_0_22px_rgba(234,179,8,0.18)]"
                >
                  {item.icon}
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}