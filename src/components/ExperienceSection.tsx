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
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div>
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="border-t border-[#1a2818] py-8"
              data-testid={`row-experience-${i}`}
            >
              <p className="font-semibold text-[#f0f4ee] text-sm md:text-base mb-1">
                {exp.org}
              </p>

              <span className="block font-mono text-xs text-[#3d5239] mb-5">
                {exp.dateRange} · Advisor: {exp.advisor}
              </span>

              {exp.projects.map((project, j) => (
                <div key={j} className="mb-5 last:mb-0">
                  <p className="text-sm text-[#c8d4c0] font-medium mb-3">
                    {project.name}
                  </p>

                  <ul className="space-y-2">
                    {project.bullets.map((bullet, k) => (
                      <li key={k} className="flex gap-3 text-sm leading-relaxed text-[#7a9472]">
                        <span className="text-[#3d5239] shrink-0 mt-0.5">—</span>
                        <span>{bullet}</span>
                      </li>
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
