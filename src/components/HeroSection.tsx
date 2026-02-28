import { motion, useMotionValue, useSpring } from "framer-motion";
import { Mail } from "lucide-react";
import { SiGooglescholar, SiGithub, SiX } from "react-icons/si";
import { PiFileTextFill, PiBookOpenTextFill } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";

export function HeroSection() {
  return (
    <section
      id="about"
      className="pt-32 pb-32 flex items-center justify-center min-h-[90vh]"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0 relative"
          >
            <div className="relative w-80 h-80 md:w-[32rem] md:h-[32rem] rounded-full overflow-hidden ring ring-white/10 shadow-xl bg-black/50">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <p className="text-xl md:text-3xl italic text-muted-foreground leading-relaxed max-w-2xl  mb-10"> I'm a graduate student @{" "} <a href="https://stanford.edu/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">SAIL (Stanford AI Lab)</a>{" "} co-advised by{" "} <a href="https://statistics.stanford.edu/people/emily-b-fox" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">Dr. Emily Fox</a>{" "} and{" "} <a href="https://cioffi-group.stanford.edu/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">Dr. John M. Cioffi</a>{" "} </p>

            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold font-mono tracking-tight mb-6 text-white lowercase">
                Muhammad Ahmed Mohsin
              </h1>
            </motion.div>



            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-4"
            >
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto md:mx-0">
              My research spans LLM post-training and inference, including preference optimization, active learning, alignment for reasoning models, reinforcement learning for high-diversity generation, and adaptive agentic test-time compute.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto md:mx-0 mb-10">
              I also work on applied reinforcement learning for complex, dynamic, and non-stationary decision-making — including RL for LLM reasoning — and on machine learning for optimization, leveraging graph-based and learning-augmented methods to accelerate convex and non-convex solvers.
            </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-6"
              data-no-custom-cursor
            >
              <a
                href="mailto:muahmed@stanford.edu"
                title="Email"
                aria-label="Email"
                data-testid="icon-email"
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <Mail className="w-6 h-6" />
              </a>
              <a
                href="https://scholar.google.co.uk/citations?user=ccxOv_QAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                title="Google Scholar"
                aria-label="Google Scholar"
                data-testid="icon-scholar"
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <SiGooglescholar className="w-6 h-6" />
              </a>
              <a
                href="https://dblp.org/pid/354/9627.html"
                target="_blank"
                rel="noopener noreferrer"
                title="DBLP"
                aria-label="DBLP"
                data-testid="icon-semantic"
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <PiBookOpenTextFill className="w-6 h-6" />
              </a>
              {/* <a
            href="/Muhammad_Ahmed_Mohsin_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            title="CV"
            aria-label="CV"
            data-testid="icon-cv"
            className="text-muted-foreground hover:text-white transition-colors"
          >
            <PiFileTextFill className="w-6 h-6" />
          </a> */}
              <a
                href="https://github.com/ahmd-mohsin"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                aria-label="GitHub"
                data-testid="icon-github"
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <SiGithub className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com/ahmedmohsin7338"
                target="_blank"
                rel="noopener noreferrer"
                title="X (Twitter)"
                aria-label="X"
                data-testid="icon-x"
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <SiX className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section >
  );
}
