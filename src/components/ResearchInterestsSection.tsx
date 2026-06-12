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
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-sm leading-relaxed text-[#7a9472] mb-10 max-w-3xl">
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

        <div>
          {interests.map((interest, i) => (
            <div
              key={i}
              className="border-t border-[#1a2818] py-6"
              data-testid={`row-interest-${i}`}
            >
              <p className="text-sm font-semibold text-[#f0f4ee] mb-2">
                {interest.title}
              </p>
              <p className="text-sm leading-relaxed text-[#7a9472] mb-3">
                {interest.desc}
              </p>
              <span className="font-mono text-xs text-[#3d5239]">
                {interest.venues}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}
