import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { SiGooglescholar, SiGithub, SiX } from "react-icons/si";
import { PiBookOpenTextFill } from "react-icons/pi";

export function HeroSection() {
  return (
    <section
      id="about"
      className="relative min-h-[90vh] overflow-hidden bg-[#070d07] pt-28 pb-28 flex items-center justify-center"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row-reverse items-center gap-14 md:gap-24">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="flex-shrink-0"
          >
            <div className="w-56 h-56 md:w-80 md:h-80 overflow-hidden border border-[#1a2818] bg-[#0d150c]">
              <img
                src="/ahmed.jpeg"
                alt="Muhammad Ahmed Mohsin"
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="text-center md:text-left flex-1">
            {/* Affiliation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <p className="text-sm italic text-[#7a9472] leading-relaxed max-w-2xl mb-5">
                I&apos;m a graduate student @{" "}
                <a
                  href="https://stanford.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5a8c52] hover:text-[#7ab870] transition-colors"
                >
                  SAIL (Stanford AI Lab)
                </a>{" "}
                co-advised by{" "}
                <a
                  href="https://statistics.stanford.edu/people/emily-b-fox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5a8c52] hover:text-[#7ab870] transition-colors"
                >
                  Dr. Emily Fox
                </a>{" "}
                and{" "}
                <a
                  href="https://cioffi-group.stanford.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5a8c52] hover:text-[#7ab870] transition-colors"
                >
                  Dr. John M. Cioffi
                </a>
              </p>
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-5 text-[#f0f4ee]">
                Muhammad Ahmed Mohsin
              </h1>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 md:mb-8"
            >
              <div className="h-px w-20 mx-auto md:mx-0 bg-[#1a2818]" />
            </motion.div>

            {/* Research Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="space-y-4"
            >
              <p className="text-sm md:text-base text-[#c8d4c0] leading-relaxed max-w-2xl mx-auto md:mx-0">
                My research focuses on LLM post-training and inference,
                including preference optimization, active learning, and
                alignment for reasoning models, alongside reinforcement
                learning for high-diversity generation and adaptive agentic
                test-time compute.
              </p>

              <p className="text-sm md:text-base text-[#7a9472] leading-relaxed max-w-2xl mx-auto md:mx-0">
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-5 mt-8"
            >
              {[
                {
                  href: "mailto:muahmed@stanford.edu",
                  label: "Email",
                  icon: <Mail className="w-4 h-4" />,
                },
                {
                  href: "https://scholar.google.co.uk/citations?user=ccxOv_QAAAAJ&hl=en",
                  label: "Google Scholar",
                  icon: <SiGooglescholar className="w-4 h-4" />,
                  external: true,
                },
                {
                  href: "https://dblp.org/pid/354/9627.html",
                  label: "DBLP",
                  icon: <PiBookOpenTextFill className="w-4 h-4" />,
                  external: true,
                },
                {
                  href: "https://github.com/ahmd-mohsin",
                  label: "GitHub",
                  icon: <SiGithub className="w-4 h-4" />,
                  external: true,
                },
                {
                  href: "https://twitter.com/ahmedmohsin7338",
                  label: "X",
                  icon: <SiX className="w-4 h-4" />,
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
                  className="text-[#3d5239] hover:text-[#7ab870] transition-colors duration-300"
                >
                  {item.icon}
                </a>
              ))}
            </motion.div>

            {/* Conoid Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mt-7 flex justify-center md:justify-start"
            >
              <a
                href="https://conoid.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border border-[#1a2818] px-4 py-2 text-xs font-mono text-[#5a8c52] hover:text-[#7ab870] hover:border-[#5a8c52] transition-all duration-300"
              >
                Building Conoid — visit conoid.ai
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
