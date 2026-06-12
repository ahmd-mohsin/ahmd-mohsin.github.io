import { Section } from "@/components/Section";
import { motion } from "framer-motion";

const experiences = [
  {
    org: "Stanford Artificial Intelligence Laboratory (SAIL)",
    dateRange: "Dec 2025 – Present",
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
          "Currently working on adaptive test-time compute strategies for improving reasoning accuracy in LLMs, focusing on dynamic control of inference depth, tool usage, and verification under strict compute constraints.",
        ],
      },
      {
        name: "Bayesian Preference Alignment for Mathematical Reasoning",
        bullets: [
          "Developed active learning frameworks for Bayesian General Preference Models and CU-DPO to align small language models for mathematical reasoning tasks, enabling sample-efficient preference learning with calibrated uncertainty (ICML 2026 and CoLM 2026).",
        ],
      },
    ],
  },
  {
    org: "Intel Corporation",
    dateRange: "Sep 2024 – Dec 2024",
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
    dateRange: "Jun 2024 – Sep 2025",
    advisor: "Dr. John M. Cioffi",
    projects: [
      {
        name: "GNN for Accelerating Low-Rank SDP Solvers",
        bullets: [
          "Developed a constraint-graph representation of SDPs and a GNN encoder (Graph Attention) with sequence prediction to learn rank trajectories directly from problem structure.",
          "Integrated learned rank schedules into low-rank solvers, yielding up to 3× speedups on large-scale benchmarks (expected NeurIPS 2026).",
        ],
      },
    ],
  },
];

export function ExperienceSection() {
  return (
    <Section id="experience" title="Experience">
      <div>
        {experiences.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="border-t border-[#c0d4c2]/50 py-8 grid md:grid-cols-[200px_1fr] gap-6 md:gap-12"
            data-testid={`row-experience-${i}`}
          >
            <div className="shrink-0">
              <p className="text-sm font-semibold text-[#1a3520] leading-snug mb-2">
                {exp.org}
              </p>
              <p className="font-mono text-[10px] text-[#90aa98] leading-relaxed">
                {exp.dateRange}
              </p>
              <p className="font-mono text-[10px] text-[#a0b8a4] mt-1">
                {exp.advisor}
              </p>
            </div>

            <div className="space-y-5">
              {exp.projects.map((project, j) => (
                <div key={j}>
                  <p className="text-sm text-[#3a5440] font-medium mb-2">
                    {project.name}
                  </p>
                  <ul className="space-y-2">
                    {project.bullets.map((bullet, k) => (
                      <li key={k} className="flex gap-3 text-sm leading-relaxed text-[#5d7a65]">
                        <span className="text-[#c0d4c2] shrink-0 mt-0.5">—</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
