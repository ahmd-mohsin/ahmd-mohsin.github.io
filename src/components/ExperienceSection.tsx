import { Section } from "@/components/Section";
import { motion } from "framer-motion";

const interests = [
  {
    title: "LLM Inference and Test-Time Scaling",
    desc: "Working on test-time training methods for scientific discovery under uncertainty, with a focus on adaptive compute allocation, agentic planning, and stratified scaling search for test-time reasoning in large language models and diffusion language models.",
    venues: "CoLM'26, NeurIPS'26, Ongoing",
  },
  {
    title: "Evolving Agentic Systems",
    desc: "Developing Internet of Evolving Agents frameworks for self-evolving multi-agent systems with dynamic reputation modeling and social graph-based coordination mechanisms.",
    venues: "NeurIPS'26, Ongoing",
  },
  {
    title: "Reinforcement Learning for LLMs",
    desc: "Research on preference optimization, active learning, and alignment methods for large language model reasoning systems. Current work also explores reinforcement learning approaches for reward decomposition to mitigate sycophancy and improve alignment.",
    venues: "ICML'26, NeurIPS'26, Ongoing",
  },
];

export function ResearchInterestsSection() {
  return (
    <Section id="research-interests" title="Research Interests">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <fieldset className="mb-10 rounded-2xl border border-yellow-500/40 px-6 pb-6 pt-3">
          <legend className="px-3 text-xs font-mono uppercase tracking-[0.25em] text-yellow-400/80">
            Main Area
          </legend>
          <p className="text-sm leading-relaxed text-muted-foreground">
            My primary research spans LLM inference and test-time scaling,
            including test-time training for scientific discovery under
            uncertainty, adaptive compute allocation, agentic planning, and
            stratified scaling search for reasoning in large language models and
            diffusion language models. I also work on evolving agentic systems
            through Internet of Evolving Agents frameworks with dynamic
            reputation modeling and social graph-based coordination. In
            addition, I focus on reinforcement learning for LLMs, including
            preference optimization, active learning, alignment, and reward
            decomposition methods to reduce sycophancy and improve reasoning
            reliability.
          </p>
        </fieldset>

        <div className="overflow-hidden rounded-2xl border border-yellow-500/40">
          {interests.map((interest, i) => (
            <div
              key={i}
              className="border-b border-yellow-500/25 px-6 py-5 last:border-b-0"
              data-testid={`row-interest-${i}`}
            >
              <p className="mb-2 font-display text-base font-bold text-yellow-400 md:text-lg">
                {interest.title}
              </p>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                {interest.desc}
              </p>
              <span className="text-xs font-mono text-yellow-500/70">
                {interest.venues}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}