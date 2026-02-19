import { motion, useMotionValue, useSpring } from "framer-motion";
import { Mail } from "lucide-react";
import { SiGooglescholar, SiGithub, SiX } from "react-icons/si";
import { PiFileTextFill, PiBookOpenTextFill } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isOverLink, setIsOverLink] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { damping: 25, stiffness: 250 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 250 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check if hovering over a link, button, or no-cursor zone
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [data-no-custom-cursor]");
      setIsOverLink(!!interactive);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseenter", handleMouseEnter);
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseenter", handleMouseEnter);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="pt-64 pb-32 flex items-center justify-center"
      style={{ cursor: isHovering && !isOverLink ? "none" : "auto" }}
    >
      {/* Custom avatar cursor */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ opacity: isHovering && !isOverLink ? 1 : 0, scale: isHovering && !isOverLink ? 1 : 0.5 }}
        transition={{ duration: 0.15 }}
      >
        <div
          className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/20 shadow-lg shadow-white/10"
          style={{ clipPath: "circle(50% at 50% 50%)" }}
        >
          <img
            src="/ahmed.jpeg"
            alt=""
            className="w-full h-full object-cover rounded-full"
            draggable={false}
          />
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <p className="text-base text-lg md:text-3xl italic text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
            I'm a graduate student @{" "}
            <a href="https://stanford.edu/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">SAIL (Stanford AI Lab)</a>{" "}
            co-advised by{" "}
            <a href="https://statistics.stanford.edu/people/emily-b-fox" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">Dr. Emily Fox</a>{" "}
            and{" "}
            <a href="https://cioffi-group.stanford.edu/" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">Dr. John M. Cioffi</a>{" "}

          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl  font-display font-bold font-mono tracking-tight mb-8 text-white lowercase">
            Muhammad Ahmed Mohsin
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <p className="text-base text-lg md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10">
            My research spans LLM post-training and inference, including preference optimization, adaptive test-time compute, and agentic planning. Applied reinforcement learning for complex, non-stationary decision-making, and machine learning for optimization, using GNNs to accelerate convex and non-convex solvers.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6"
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
    </section>
  );
}
