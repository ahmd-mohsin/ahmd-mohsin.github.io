import { Section } from "@/components/Section";
import { motion } from "framer-motion";

const experiences = [
  {
    org: "Stanford Artificial Intelligence Laboratory (SAIL)",
    dateRange: "December 2025 – Present",
    advisor: "Prof. Emily Fox",
    projects: [
      {
        name: "Internet of Evolving Agents",
        bullets: [
          "Co-developed a modular multi-agent ecosystem where autonomous agents evolve their capabilities, reputation, and social connections over time through Bayesian reputation updates, dynamic team formation, and social graph evolution. The framework enables emergent specialization and self-organizing collaboration for complex task execution (NeurIPS 2026, in progress).",
        ],
      },
      {
        name: "Test-Time Compute and Reasoning in Large Language Models",
        bullets: [
          "Currently working on adaptive test-time compute strategies for improving reasoning accuracy in LLMs, focusing on dynamic control of inference depth, tool usage, and verification under strict compute constraints. The work studies principled trade-offs between accuracy, latency, and reliability via adaptive compute allocation.",
        ],
      },
      {
        name: "Bayesian Preference Alignment for Mathematical Reasoning",
        bullets: [
          "Developed active learning frameworks for Bayesian General Preference Models and Continuous-Utility Direct Preference Optimization (CU-DPO) to align small language models for mathematical reasoning tasks, enabling sample-efficient preference learning with calibrated uncertainty (ICML 2026 and CoLM 2026).",
        ],
      },
    ],
  },
  {
    org: "Intel Corporation",
    dateRange: "September 2024 – December 2024",
    advisor: "Dr. John M. Cioffi",
    projects: [
      {
        name: "Neural Gaussian Radio Fields for Environment Perception",
        bullets: [
          "Worked on 3D computer vision-based channel estimation for next-generation wireless networks.",
          "Implemented a CUDA-based differentiable real-time pipeline with 1 ms inference time, leading to KDD 2026 submission.",
        ],
      },
    ],
  },
  {
    org: "Samsung Semiconductors",
    dateRange: "June 2024 – September 2025",
    advisor: "Dr. John M. Cioffi",
    projects: [
      {
        name: "Deep Reinforcement Learning Accelerated Optimization: Graph Neural Networks for Accelerating Low-Rank SDP Solvers (expected NeurIPS 2026)",
        bullets: [
          "Developed a constraint-graph representation of SDPs and a GNN encoder (Graph Attention) with sequence prediction to learn rank trajectories directly from problem structure.",
          "Integrated learned rank schedules into low-rank solvers to remove hand-tuned rank heuristics and reduce trial-and-error, yielding up to 3× speedups on large-scale benchmarks.",
        ],
      },
    ],
  },
];

export function ExperienceSection() {
  return (
    <Section id="experience" title="Experience">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="overflow-hidden rounded-2xl border border-yellow-500/40">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="border-b border-yellow-500/25 px-6 py-5 last:border-b-0"
              data-testid={`row-experience-${i}`}
            >
              <p className="mb-1 font-display text-base font-bold text-yellow-400 md:text-lg">
                {exp.org}
              </p>

              <span className="mb-3 block text-xs font-mono text-yellow-500/70">
                {exp.dateRange} · Advisor: {exp.advisor}
              </span>

              {exp.projects.map((project, j) => (
                <div key={j} className="mb-4 last:mb-0">
                  <p className="mb-2 text-sm font-semibold text-yellow-300">
                    Project: {project.name}
                  </p>

                  <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed text-muted-foreground">
                    {project.bullets.map((bullet, k) => (
                      <li key={k}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}