import { Section } from "@/components/Section";
import { GlassPanel } from "@/components/GlassPanel";
import { motion } from "framer-motion";
import { useState } from "react";

type PaperLink = { label: string; url: string };

type Paper = {
  title: string;
  authors: string;
  venue: string;
  year?: string;
  status?: string;
  links?: PaperLink[];
};

const papers: Paper[] = [
  // LLM Alignment, Preference Optimization, and Reasoning
  {
    title: "General Preference Reinforcement Learning",
    authors: "M. Umer*, M. A. Mohsin*, A. Bilal*, E. Fox",
    venue: "NeurIPS",
    year: "2026",
    links: [
      { label: "paper", url: "https://arxiv.org/abs/2605.18721" },
      { label: "pdf", url: "https://arxiv.org/pdf/2605.18721" },
    ],
  },
  {
    title: "Continuous-Utility Direct Preference Optimization",
    authors: "M. A. Mohsin, M. Umer, A. Bilal, E. Vitercik, J. M. Cioffi",
    venue: "EMNLP",
    year: "2026",
    links: [
      { label: "paper", url: "https://arxiv.org/abs/2602.00931" },
      { label: "pdf", url: "https://arxiv.org/pdf/2602.00931" },
    ],
  },
  {
    title: "Active Alignment with Bayesian General Preference Models",
    authors: "M. Umer*, M. A. Mohsin*, A. Bilal, E. Vitercik, J. M. Cioffi",
    venue: "CoLM",
    year: "2026",
  },
  {
    title: "Sycophancy Disentanglement in LLMs via Reward Decomposition",
    authors: "M. A. Mohsin*, A. Bilal*, M. Umer, E. Fox",
    venue: "AAAI",
    year: "2027",
    links: [
      { label: "paper", url: "https://arxiv.org/abs/2604.05279" },
      { label: "pdf", url: "https://arxiv.org/pdf/2604.05279" },
    ],
  },
  {
    title: "Coverage Preservation in RL as an Off-Policy Constraint",
    authors: "M. A. Mohsin, M. Umer, A. Bilal, J. M. Cioffi, E. Fox",
    venue: "Preprint",
    status: "in progress",
  },
  // Test-Time Scaling and Coding Agents
  {
    title: "Teaching Agents to Code Reliably",
    authors: "M. A. Mohsin*, M. Kim, K. Ruan, S. Garg, V. Kumar, M. K. Ramanathan",
    venue: "ICLR",
    year: "2027",
  },
  {
    title: "LoRe-KV: Lookahead Output-Perturbation with Response-Entropy Weighting for KV Cache Eviction",
    authors: "A. Bilal, M. A. Mohsin, M. Umer, D. F. Hougen",
    venue: "ICLR",
    year: "2027",
  },
  {
    title: "Epistemic Uncertainty for Test-Time Discovery",
    authors: "M. A. Mohsin*, K. Riaz*, M. Umer, A. Bilal, J. M. Cioffi, E. Fox",
    venue: "NeurIPS",
    year: "2026",
    links: [
      { label: "paper", url: "https://arxiv.org/abs/2605.11328" },
      { label: "pdf", url: "https://arxiv.org/pdf/2605.11328" },
    ],
  },
  {
    title: "S³: Stratified Scaling Search for Test-Time in Diffusion Language Models",
    authors: "A. Bilal*, M. A. Mohsin*, M. Umer, D. F. Hougen",
    venue: "CoLM",
    year: "2026",
    links: [
      { label: "paper", url: "https://arxiv.org/abs/2604.06260" },
      { label: "pdf", url: "https://arxiv.org/pdf/2604.06260" },
    ],
  },
  {
    title: "What If We Allocate Test-Time Compute Adaptively?",
    authors: "A. Bilal*, M. A. Mohsin*, M. Umer, D. F. Hougen, J. M. Cioffi",
    venue: "ICML",
    year: "2026",
    links: [
      { label: "paper", url: "https://arxiv.org/abs/2602.01070" },
      { label: "pdf", url: "https://arxiv.org/pdf/2602.01070" },
    ],
  },
  // Multi-Agent Systems, Benchmarking, and Causal Discovery
  {
    title: "MatrAIx: Simulating the World with 8.3 Billion Persona Agents",
    authors: "Xiaomin Li, et al., Muhammad Ahmed Mohsin, et al., Dawn Song",
    venue: "Nature",
    status: "invited",
  },
  {
    title: "MicroVerse: An Instrument for Measuring Self-Authored Identity Drift in Long-Horizon Multi-Agent Language-Model Simulations",
    authors: "Sky Ng, et al., Muhammad Ahmed Mohsin, et al., Yuexing Hao",
    venue: "CoLM",
    year: "2026",
  },
  {
    title: "PersonaEval: Persona-Based User Simulation for Evaluating Interactive Applications",
    authors: "Yifan Simon Liu, et al., Muhammad Ahmed Mohsin, et al., Xiaomin Li",
    venue: "CoLM",
    year: "2026",
  },
  {
    title: "When Should Semantic Priors Enter Partially-Identified Causal Discovery?",
    authors: "M. A. Mohsin, A. Bilal, S. B. Ather, Tomasso, Valentin, L. de Costa",
    venue: "ICLR",
    year: "2027",
  },
  {
    title: "Automated Prompt Optimization Improves Robustness of Medical Benchmarks for LLMs",
    authors: "A. Aali, M. A. Mohsin, V. Bikia, A. Singhvi, S. Bedi, H. Cui, M. A. F. Hernandez, A. Unell, Y. Mai, M. A. Pfeffer, S. Koyejo, R. Daneshjou, E. Alsentzer, C. Potts, A. S. Chaudhari",
    venue: "ML4H",
    year: "2025",
    links: [
      { label: "paper", url: "https://openreview.net/forum?id=PfjLpuLJi0" },
      { label: "pdf", url: "https://openreview.net/pdf?id=PfjLpuLJi0" },
    ],
  },
  {
    title: "On the Fundamental Limits of Large Models at Scale",
    authors: "M. A. Mohsin, M. Umer, A. Bilal, Z. Memon, M. I. Qadir, S. Bhattacharya, H. Rizwan, A. R. Gorle, M. Z. Kazmi, A. Mohsin, A. Subhan, M. U. Rafique, Z. He, P. Mehta, J. Han, M. A. Jamshed, D. F. Hougen, J. M. Cioffi",
    venue: "TMLR",
    year: "2025",
    links: [
      { label: "paper", url: "https://arxiv.org/abs/2511.12869" },
      { label: "pdf", url: "https://arxiv.org/pdf/2511.12869" },
    ],
  },
  // Signal Processing, Wireless, and AI
  {
    title: "Graph Neural Networks for Accelerating Low-Rank SDP Solvers",
    authors: "M. A. Mohsin, M. Umer, A. Bilal, J. M. Cioffi, E. Vitercik",
    venue: "JMLR",
    year: "2026",
  },
  {
    title: "Neural Gaussian Radio Fields for Channel Estimation",
    authors: "M. A. Mohsin*, M. Umer*, A. Bilal, J. M. Cioffi",
    venue: "KDD",
    year: "2026",
    links: [
      { label: "paper", url: "https://arxiv.org/abs/2508.11668" },
      { label: "pdf", url: "https://arxiv.org/pdf/2508.11668" },
    ],
  },
  {
    title: "Continual Learning for Wireless Channel Prediction",
    authors: "M. A. Mohsin, M. Umer, A. Bilal, J. M. Cioffi",
    venue: "ICML",
    year: "2025",
    links: [
      { label: "paper", url: "https://arxiv.org/abs/2506.22471" },
      { label: "pdf", url: "https://arxiv.org/pdf/2506.22471" },
    ],
  },
  {
    title: "Task-Aware Distributed Source Coding for Correlated Audio Signals Using Perceptual Loss",
    authors: "M. A. Mohsin, A. Bilal, S. Bhattacharya, J. M. Cioffi",
    venue: "AAAI",
    year: "2024",
    links: [
      { label: "paper", url: "https://arxiv.org/abs/2501.17879" },
      { label: "pdf", url: "https://arxiv.org/pdf/2501.17879" },
    ],
  },
  {
    title: "PyramidTabNet: Transformer-Based Table Recognition in Image-Based Documents",
    authors: "M. Umer, M. A. Mohsin, A. Ul-Hasan, F. Shafait",
    venue: "ICDAR",
    year: "2023",
    links: [
      {
        label: "paper",
        url: "https://tukl.seecs.nust.edu.pk/members/projects/conference/PyramidTabNet-Transformer-based-Table-Recognition-in-Image-based-Documents.pdf",
      },
      {
        label: "pdf",
        url: "https://tukl.seecs.nust.edu.pk/members/projects/conference/PyramidTabNet-Transformer-based-Table-Recognition-in-Image-based-Documents.pdf",
      },
    ],
  },
];

const INITIAL_COUNT = 6;

function PaperRow({ paper, index }: { paper: Paper; index: number }) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: (index % INITIAL_COUNT) * 0.04, duration: 0.5 }}
      className="border-t border-[#b07f95]/20 py-6 grid grid-cols-[2rem_1fr] md:grid-cols-[2rem_110px_1fr] gap-x-5 gap-y-1 group"
      data-testid={`card-paper-${index}`}
    >
      <span className="font-mono text-[10px] text-[#8a6a78] pt-0.5 self-start">
        {num}
      </span>

      <span className="hidden md:block font-mono text-[10px] text-[#c79bad] pt-0.5 self-start leading-relaxed">
        {paper.venue}{paper.year && ` '${paper.year.slice(2)}`}
        {paper.status && (
          <span className="block text-[#8a6a78] mt-0.5">· {paper.status}</span>
        )}
      </span>

      <div className="col-start-2 md:col-start-3">
        <span className="md:hidden font-mono text-[10px] text-[#c79bad] block mb-1.5">
          {paper.venue}{paper.year && ` ${paper.year}`}{paper.status && ` · ${paper.status}`}
        </span>
        <h3 className="text-sm font-semibold text-[#f7ecf1] leading-snug group-hover:text-[#ffc1d9] transition-colors mb-2">
          {paper.title}
        </h3>
        <p className="text-xs text-[#c79bad] leading-relaxed mb-3">
          {paper.authors}
        </p>
        {paper.links && paper.links.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {paper.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-[#c79bad] hover:text-[#f48fb1] underline underline-offset-4 decoration-[#b07f95]/40 hover:decoration-[#f48fb1] transition-colors"
                data-testid={`link-paper-${index}-${link.label}`}
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ResearchSection() {
  const [expanded, setExpanded] = useState(false);
  const visiblePapers = expanded ? papers : papers.slice(0, INITIAL_COUNT);

  return (
    <Section id="research" title="Selected Publications">
      <GlassPanel className="p-6 md:p-8">
        <div>
          {visiblePapers.map((paper, i) => (
            <PaperRow key={i} paper={paper} index={i} />
          ))}
        </div>

        {papers.length > INITIAL_COUNT && (
          <div className="border-t border-[#b07f95]/20 pt-6 flex items-center justify-between">
            <button
              onClick={() => setExpanded(!expanded)}
              className="font-mono text-[10px] text-[#c79bad] hover:text-[#f48fb1] transition-colors uppercase tracking-widest"
            >
              {expanded ? "↑ Show Less" : `Show All ${papers.length} Publications`}
            </button>
            {!expanded && (
              <span className="font-mono text-[10px] text-[#8a6a78]">
                {papers.length - INITIAL_COUNT} more
              </span>
            )}
          </div>
        )}
      </GlassPanel>
    </Section>
  );
}
