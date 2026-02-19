import { Section } from "@/components/Section";
import { motion } from "framer-motion";

const interests = [
  {
    title: "RL for Resource Allocation Optimization",
    desc: "Using RL to optimize allocation of limited resources in complex systems in dynamically changing environments for accelerated decision making towards optima.",
    venues: "WCNC'25, Globecom'26, ICML'25, NeurIPS'25, AAAI'25",
  },
  {
    title: "RL for Non-Linear Optimization",
    desc: "Enhancing and speeding up solvers for large real-time problems via reinforcement learning techniques for complex systems.",
    venues: "NeurIPS, ICML, AAAI",
  },
  {
    title: "RL for Large Language Models",
    desc: "Inference-time thinking capabilities, long-context reasoning models, and RL-informed chain-of-thought processes.",
    venues: "NeurIPS, CVPR, ICLR",
  },
];

export function ResearchInterestsSection() {
  return (
    <Section id="research-interests" title="Research Interests">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <fieldset className="border border-white/10 px-6 pb-6 pt-2 mb-10">
          <legend className="px-2 text-xs font-mono uppercase tracking-widest text-white/50">
            Main Area
          </legend>
          <p className="text-sm text-muted-foreground leading-relaxed">
            My main research area is applied Reinforcement Learning (RL) for
            enhancing optimization and decision-making in complex systems.
          </p>
        </fieldset>

        <div className="border border-white/10">
          <div className="hidden md:flex items-center justify-between gap-4 px-6 py-3 border-b border-white/10">
            <span className="text-xs font-mono uppercase tracking-widest text-white/50">
              Area
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-white/50">
              Venues
            </span>
          </div>

          {interests.map((interest, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-6 px-6 py-5 border-b border-white/10 last:border-b-0"
              data-testid={`row-interest-${i}`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-sm text-white mb-1">
                  {interest.title}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {interest.desc}
                </p>
              </div>
              <span className="text-xs font-mono text-white/40 md:whitespace-nowrap pt-0.5">
                {interest.venues}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
