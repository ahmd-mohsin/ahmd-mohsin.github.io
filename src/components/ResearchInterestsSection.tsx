import { Section } from "@/components/Section";
import { motion } from "framer-motion";

const interests = [
  {
    title: "LLM Post-Training and Inference",
    desc: "Working on preference optimization, active learning, and alignment for LLM reasoning models. Additional work includes reinforcement learning for high-diversity output generation and agentic test-time compute adaptation.",
    venues: "ICML'26, CoLM'26, NeurIPS'26",
  },
  {
    title: "Evolving Agentic Systems",
    desc: "Developing Internet of Evolving Agents frameworks for self-evolving multi-agent systems with dynamic reputation modeling and social graph-based coordination mechanisms.",
    venues: "NeurIPS'26, Ongoing",
  },
  {
    title: "Applied Reinforcement Learning",
    desc: "Development of reinforcement learning algorithms for complex, dynamic, and non-stationary decision-making environments. Also working on RL methods tailored for LLM reasoning models.",
    venues: "WCNC'25, Globecom'26, ICML'25, NeurIPS'25, AAAI'25",
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
        <fieldset className="border border-white/20 px-6 pb-6 pt-2 mb-10">
          <legend className="px-2 text-xs font-mono uppercase tracking-widest text-white/50">
            Main Area
          </legend>
          <p className="text-sm text-muted-foreground leading-relaxed">
          My primary research spans LLM post-training and inference, including preference optimization, active learning, alignment, and adaptive test-time compute for reasoning models. I also work on applied Reinforcement Learning (RL) for complex, dynamic, and non-stationary decision-making, including RL for LLM reasoning. In addition, I focus on leveraging machine learning to accelerate and stabilize large-scale optimization solvers, particularly via learning-augmented and graph-based approaches.
          </p>
        </fieldset>

        <div className="border border-white/20">
          {interests.map((interest, i) => (
            <div
              key={i}
              className="px-6 py-5 border-b border-white/20 last:border-b-0"
              data-testid={`row-interest-${i}`}
            >
              <p className="font-display font-bold text-md md:text-lg text-white mb-2">
                {interest.title}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                {interest.desc}
              </p>
              <span className="text-xs font-mono text-white/40">
                {interest.venues}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}

