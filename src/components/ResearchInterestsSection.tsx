import { Section } from "@/components/Section";
import { motion } from "framer-motion";

const interests = [
  {
    title: "Preference Optimization and Alignment for LLMs",
    desc: "Designing sample-efficient preference learning and reinforcement-learning methods for aligning language-model reasoning: continuous-utility and general-preference formulations (CU-DPO, General Preference RL), active alignment under Bayesian general preference models with calibrated uncertainty, and sycophancy reduction.",
    venues: "ICML'26 · CoLM'26 · NeurIPS'26 · EMNLP'26",
  },
  {
    title: "Test-Time Scaling and Test-Time Discovery",
    desc: "Developing adaptive test-time compute methods for reasoning and scientific discovery under uncertainty: dynamic control of inference depth, tool invocation, and verification under strict budgets; stratified scaling search for diffusion language models; and epistemic-uncertainty-driven test-time training for discovery.",
    venues: "ICML'26 · CoLM'26 · NeurIPS'26 · EMNLP'26",
  },
  {
    title: "Interactive and Multi-Agent Systems",
    desc: "Building self-evolving multi-agent ecosystems in which agents accumulate scoped memory, earn reputation through Bayesian posteriors, and coordinate over an evolving social graph. Related work on learning from code-agent trajectories via causal redundancy analysis, and on privacy, security, and shared context in collaborative agentic reasoning.",
    venues: "NeurIPS'26 · Ongoing",
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
        My research spans preference optimization and alignment for LLMs,
        adaptive test-time scaling and discovery, and interactive multi-agent
        systems — with collaborations across Google DeepMind, Meta, Amazon AGI,
        and Microsoft Core AI.
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
