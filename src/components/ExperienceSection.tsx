import { Section } from "@/components/Section";
import { GlassPanel } from "@/components/GlassPanel";
import { motion } from "framer-motion";

const experiences = [
  {
    org: "Amazon AGI",
    dateRange: "Jun 2026 – Sep 2026",
    advisor: "Myeongsoo Kim",
    projects: [
      {
        name: "Teaching Agents to Code Reliably (ICLR 2027)",
        bullets: [
          "Ran a controlled study of six test-time strategies on a fixed Qwen3-Coder-30B agent over SWE-bench Verified, isolating diversity of exploration and diversity of edits as the skills that convert compute into solved bugs, and showing that self-authored verification sits near chance.",
          "Distilled diverse, reactive search into the policy via weighted supervised fine-tuning (pass@1 31.8 → 35.1, pass@8 46.8 → 51.2), then trained a discriminative self-verifier with GRPO using a mutation-gauntlet reward with step-level, threshold-free credit.",
        ],
      },
    ],
  },
  {
    org: "Stanford Artificial Intelligence Laboratory (SAIL)",
    dateRange: "Sep 2025 – Present",
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
          "Submitted work on adaptive test-time compute allocation for LLM reasoning, focusing on dynamic control of inference depth, tool invocation, and verification under strict compute budgets, and analyzing principled trade-offs among accuracy, latency, and reliability.",
        ],
      },
      {
        name: "Bayesian Preference Alignment for Mathematical Reasoning",
        bullets: [
          "Developed active learning frameworks for Bayesian General Preference Models and CU-DPO to align small language models for mathematical reasoning, enabling sample-efficient preference learning with calibrated uncertainty (ICML 2026, CoLM 2026).",
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
          "Developed a 3D computer vision-based channel estimation framework for next-generation wireless networks, implementing a CUDA-based differentiable real-time pipeline achieving 1 ms inference latency (KDD 2026 submission).",
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
        name: "Graph Neural Networks for Accelerating Low-Rank SDP Solvers",
        bullets: [
          "Developed a constraint-graph representation of SDPs with a Graph Attention Network encoder to predict rank trajectories, integrating learned rank schedules into low-rank solvers to eliminate manual heuristics and achieve up to 3× speedups on large-scale benchmarks (JMLR 2026).",
        ],
      },
    ],
  },
];

export function ExperienceSection() {
  return (
    <Section id="experience" title="Experience">
      <GlassPanel className="p-8 md:p-10">
        <div>
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="border-t border-[#7aa686]/20 py-8 grid md:grid-cols-[200px_1fr] gap-6 md:gap-12"
              data-testid={`row-experience-${i}`}
            >
              <div className="shrink-0">
                <p className="text-sm font-semibold text-[#e8f0ea] leading-snug mb-2">
                  {exp.org}
                </p>
                <p className="font-mono text-[10px] text-[#63796b] leading-relaxed">
                  {exp.dateRange}
                </p>
                <p className="font-mono text-[10px] text-[#63796b] mt-1">
                  {exp.advisor}
                </p>
              </div>

              <div className="space-y-5">
                {exp.projects.map((project, j) => (
                  <div key={j}>
                    <p className="text-sm text-[#e8f0ea] font-medium mb-2">
                      {project.name}
                    </p>
                    <ul className="space-y-2">
                      {project.bullets.map((bullet, k) => (
                        <li key={k} className="flex gap-3 text-sm leading-relaxed text-[#b9c8bd]">
                          <span className="text-[#63796b] shrink-0 mt-0.5">—</span>
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
      </GlassPanel>
    </Section>
  );
}
