import { Section } from "@/components/Section";
import { motion } from "framer-motion";

const interests = [
  {
    title: "LLM Post-Training and Inference",
    desc: "Working on preference optimization and reinforcement learning for LLM alignment and reasoning, adaptive test-time compute and budget allocation, and agentic planning. 
    Also developing Internet of Evolving Agents frameworks for self - evolving multi- agent systems with dynamic reputation and social graph - based coordination.",
venues: "ICML'26, CoLM'26, NeurIPS'26",
  },
{
  title: "Applied Reinforcement Learning",
    desc: "Development of reinforcement learning algorithms for complex, dynamic, and non-stationary decision-making environments.",
      venues: "WCNC'25, Globecom'26, ICML'25, NeurIPS'25, AAAI'25",
  },
{
  title: "Machine Learning for Optimization",
    desc: "Leveraging machine learning to accelerate, stabilize, and enhance convex and non-convex optimization solvers, including GNNs for accelerating low-rank SDP solvers.",
      venues: "JMLR'26, NeurIPS'26",
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
            My main research area spans LLM post-training and inference, applied
            Reinforcement Learning (RL) for enhancing optimization and
            decision-making, and machine learning for accelerating optimization
            solvers.
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

