import { Section } from "@/components/Section";
import { motion } from "framer-motion";
import { useState } from "react";

const papers = [
  {
    title: "Internet of Evolving Agents",
    authors: "Z. Ali, M. T. Shah, M. A. Mohsin",
    venue: "NeurIPS",
    year: "2026",
    status: "In progress",
    links: ["paper"],
  },
  {
    title: "Detecting and Removing Sycophancy in LLMs for Trustworthy Outputs",
    authors: "M. A. Mohsin, A. Bilal, M. Umer, E. Fox",
    venue: "CoLM",
    year: "2026",
    status: "Submitted",
    links: ["paper"],
  },
  {
    title: "Continuous-Utility Direct Preference Optimization",
    authors: "M. A. Mohsin, M. Umer, A. Bilal, Ellen Vitercik, J. M. Cioffi",
    venue: "ICML",
    year: "2026",
    status: "Submitted",
    links: ["paper"],
  },
  {
    title: "What If We Allocate Test-Time Compute Adaptively?",
    authors: "A. Bilal, M. A. Mohsin, M. Umer, D. F. Hougen, J. M. Cioffi",
    venue: "ICML",
    year: "2026",
    status: "Submitted",
    links: ["paper"],
  },
  {
    title: "Active Alignment with Bayesian General Preference Models",
    authors: "M. Umer, M. A. Mohsin, A. Bilal, Ellen Vitercik, J. M. Cioffi",
    venue: "CoLM",
    year: "2026",
    status: "In progress",
    links: ["paper"],
  },
  {
    title: "Graph Neural Network for Accelerating Low-Rank SDP Solvers",
    authors: "M. A. Mohsin, M. Umer, A. Bilal, J. M. Cioffi, Ellen Vitercik",
    venue: "JMLR",
    year: "2026",
    links: ["paper"],
  },
  {
    title: "Neural Gaussian Radio Fields for Channel Estimation",
    authors: "M. A. Mohsin, M. Umer, A. Bilal, J. M. Cioffi",
    venue: "KDD",
    year: "2026",
    links: ["paper"],
  },
  {
    title: "Structured Prompting Enables More Robust Evaluation of Language Models",
    authors: "Asad Aali, Muhammad Ahmed Mohsin, Vasiliki Bikia, et al.",
    venue: "TMLR",
    year: "2026",
    links: ["paper"],
  },
  {
    title: "On the Fundamental Limits of Large Models at Scale",
    authors: "Muhammad Ahmed Mohsin, Muhammad Umer, Ahsan Bilal, et al.",
    venue: "TMLR",
    year: "2025",
    links: ["paper"],
  },
  {
    title: "Continual Learning for Wireless Channel Prediction",
    authors: "M. A. Mohsin, M. Umer, A. Bilal, J. M. Cioffi",
    venue: "ICML",
    year: "2025",
    links: ["arXiv", "paper"],
  },
  {
    title: "Automated Prompt Optimization Improves Robustness of Medical Benchmarks for LLMs",
    authors: "Asad Aali, Muhammad Ahmed Mohsin, Vasiliki Bikia, et al.",
    venue: "ML4H",
    year: "2025",
    links: ["paper"],
  },
  {
    title: "Meta-Thinking in LLMs via Multi-Agent Reinforcement Learning: A Survey",
    authors: "A. Bilal, M. A. Mohsin, M. Umer, A. Bangash, M. A. Jamshed",
    venue: "IEEE Trans. AI",
    year: "2024",
    links: ["paper"],
  },
  {
    title: "Task-Aware Distributed Source Coding for Correlated Audio Signals Using Perceptual Loss",
    authors: "M. A. Mohsin, A. Bilal, S. Bhattacharya, J. M. Cioffi",
    venue: "AAAI",
    year: "2024",
    links: ["arXiv", "paper"],
  },
  {
    title: "Hierarchical Deep Reinforcement Learning for Spectrum Resource Optimization in Integrated Terrestrial and Non-Terrestrial Networks",
    authors: "M. A. Mohsin, H. Rizwan, M. Umer, J. M. Cioffi",
    venue: "AAAI",
    year: "2024",
    links: ["arXiv", "paper"],
  },
  {
    title: "Conditional Prior-Based Non-Stationary Channel Estimation Using Accelerated Diffusion Model-Based Denoising",
    authors: "M. A. Mohsin, A. Bilal, M. Umer, A. Aali, M. A. Jamshed, J. M. Cioffi",
    venue: "ICASSP",
    year: "2025",
    links: ["paper"],
  },
  {
    title: "Channel Prediction under Network Distribution Shift Using Continual Learning-Based Loss Regularization",
    authors: "M. A. Mohsin, M. Umer, A. Bilal, M. I. Qadir, M. A. Jamshed, J. M. Cioffi",
    venue: "ICASSP",
    year: "2025",
    links: ["paper"],
  },
  {
    title: "Transformer-Based Distributed Machine Learning for Downlink Channel Estimation in RIS-Aided Networks",
    authors: "M. A. Mohsin, S. M. Jameel, H. Rizwan, I. Marjan, J. Y. Pan",
    venue: "ICASSP",
    year: "2024",
    links: ["paper"],
  },
  {
    title: "Successive Interference Cancellation-Aided Diffusion Models for Joint Channel Estimation and Data Detection in Low-Rank Channel Scenarios",
    authors: "S. Bhattacharya, M. A. Mohsin, K. Rajabalifardi, J. M. Cioffi",
    venue: "ICASSP",
    year: "2024",
    links: ["arXiv", "paper"],
  },
  {
    title: "Optimum Power-Subcarrier Allocation and Time-Sharing in Multicarrier NOMA Uplink",
    authors: "S. Bhattacharya, K. Rajabalifardi, M. A. Mohsin, J. M. Cioffi",
    venue: "ICASSP",
    year: "2024",
    links: ["arXiv", "paper"],
  },
  {
    title: "PyramidTabNet: Transformer-Based Table Recognition in Image-Based Documents",
    authors: "M. Umer, M. A. Mohsin, A. Ul-Hasan, F. Shafait",
    venue: "ICDAR",
    year: "2023",
    links: ["arXiv", "paper"],
  },
];

function PaperCard({
  paper,
  index,
}: {
  paper: (typeof papers)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group border border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
      data-testid={`card-paper-${index}`}
    >
      <div className="h-32 bg-gradient-to-br from-white/[0.03] to-white/[0.08] border-b border-white/20 flex items-center justify-center px-6">
        <span className="font-mono text-xs text-white/30 uppercase tracking-widest text-center">
          {paper.venue} {paper.year}
          {paper.status && (
            <span className="block text-[10px] text-yellow-400/60 mt-1">
              {paper.status}
            </span>
          )}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-display font-bold text-sm md:text-base tracking-wide text-white mb-3 leading-snug">
          {paper.title}
        </h3>
        <p className="text-xs text-muted-foreground  mb-4 font-sans">
          {paper.authors}
        </p>
        <div className="flex flex-wrap gap-3">
          {paper.links.map((link, j) => (
            <a
              key={j}
              href="#"
              className="text-xs text-white/50 hover:text-white transition-colors font-mono underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
              data-testid={`link-paper-${index}-${link}`}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function ResearchSection() {
  const [expanded, setExpanded] = useState(false);
  // First row: 2, next 2 rows: 6 = 8 visible initially
  const visibleExtra = expanded ? papers.slice(2) : papers.slice(2, 8);

  return (
    <Section id="research" title="Selected Publications" className="bg-white/[0.02]">
      {/* First row: 2 columns */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {papers.slice(0, 2).map((paper, i) => (
          <PaperCard key={i} paper={paper} index={i} />
        ))}
      </div>
      {/* Remaining rows: 3 columns */}
      <div className="grid md:grid-cols-3 gap-6">
        {visibleExtra.map((paper, i) => (
          <PaperCard key={i + 2} paper={paper} index={i + 2} />
        ))}
      </div>
      {papers.length > 8 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-8 py-3 border border-white/15 text-sm font-mono text-white/60 hover:text-white hover:border-white/30 transition-colors tracking-wider uppercase"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </Section>
  );
}
