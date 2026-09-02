import { Section } from "@/components/Section";
import { GlassPanel } from "@/components/GlassPanel";
import { motion } from "framer-motion";

const interests = [
  {
    title: "Preference Optimization and Test-Time Scaling",
    desc: "Designing sample-efficient preference-learning and reinforcement-learning methods for aligning language-model reasoning, and adaptive test-time compute methods that dynamically control inference depth, tool invocation, and verification under strict budgets. I am interested in how post-training and inference-time search jointly shape reasoning, and in principled trade-offs among accuracy, latency, and reliability.",
    venues: "Post-training · Inference-time search",
  },
  {
    title: "Agentic System Architectures and Coding Agents",
    desc: "Building agentic systems that plan, act, and self-verify over long horizons, spanning multi-agent coordination and the software agents I develop at alexein.ai. Through my work at Amazon AGI on coding agents, I study how agents convert test-time compute into solved tasks by exploring diverse solutions and writing trustworthy verifiers, and how these behaviors can be internalized through supervised and reinforcement post-training.",
    venues: "alexein.ai · Amazon AGI",
  },
  {
    title: "AI Alignment and Benchmarking",
    desc: "Developing persona-based benchmarks and user-simulation frameworks that evaluate how models behave across diverse populations and interactive settings. I am broadly interested in AI alignment, including calibrated uncertainty and reducing sycophancy, and in measurement methodology that makes alignment progress observable and reproducible.",
    venues: "Alignment · Evaluation",
  },
];

export function ResearchInterestsSection() {
  return (
    <Section id="research-interests" title="Research Interests">
      <GlassPanel className="p-8 md:p-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-sm leading-relaxed text-[#c79bad] mb-12 max-w-2xl italic"
        >
          My research spans preference optimization and test-time scaling for LLM
          reasoning, agentic system architectures and coding agents, and AI
          alignment and benchmarking — with collaborations across Google DeepMind,
          Meta, Amazon AGI, and Microsoft Core AI.
        </motion.p>

        <div>
          {interests.map((interest, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="border-t border-[#b07f95]/20 py-7 grid md:grid-cols-[1fr_2fr] gap-6 md:gap-12"
              data-testid={`row-interest-${i}`}
            >
              <div>
                <p className="text-sm font-semibold text-[#f7ecf1] leading-snug mb-2">
                  {interest.title}
                </p>
                <span className="font-mono text-[10px] text-[#8a6a78] tracking-wider">
                  {interest.venues}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#e2cdd6]">
                {interest.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </GlassPanel>
    </Section>
  );
}
