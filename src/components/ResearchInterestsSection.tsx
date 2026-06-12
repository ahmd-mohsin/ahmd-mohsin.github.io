import { Section } from "@/components/Section";
import { motion } from "framer-motion";

const interests = [
  {
    title: "LLM Inference and Test-Time Scaling",
    desc: "Working on test-time training methods for scientific discovery under uncertainty, with a focus on adaptive compute allocation, agentic planning, and stratified scaling search for test-time reasoning in large language models and diffusion language models.",
    venues: "CoLM'26 · NeurIPS'26 · Ongoing",
  },
  {
    title: "Evolving Agentic Systems",
    desc: "Developing Internet of Evolving Agents frameworks for self-evolving multi-agent systems with dynamic reputation modeling and social graph-based coordination mechanisms.",
    venues: "NeurIPS'26 · Ongoing",
  },
  {
    title: "Reinforcement Learning for LLMs",
    desc: "Research on preference optimization, active learning, and alignment methods for large language model reasoning systems. Current work also explores reinforcement learning approaches for reward decomposition to mitigate sycophancy and improve alignment.",
    venues: "ICML'26 · NeurIPS'26 · Ongoing",
  },
];

export function ResearchInterestsSection() {
  return (
    <Section id="research-interests" title="Research Interests">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-sm leading-relaxed text-[#5d7a65] mb-12 max-w-2xl italic"
      >
        My primary research spans LLM inference and test-time scaling, evolving
        agentic systems, and reinforcement learning for LLMs — including
        preference optimization, active learning, alignment, and reward
        decomposition methods to reduce sycophancy and improve reasoning
        reliability.
      </motion.p>

      <div>
        {interests.map((interest, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            className="border-t border-[#c0d4c2]/50 py-7 grid md:grid-cols-[1fr_2fr] gap-6 md:gap-12"
            data-testid={`row-interest-${i}`}
          >
            <div>
              <p className="text-sm font-semibold text-[#1a3520] leading-snug mb-2">
                {interest.title}
              </p>
              <span className="font-mono text-[10px] text-[#90aa98] tracking-wider">
                {interest.venues}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#5d7a65]">
              {interest.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
