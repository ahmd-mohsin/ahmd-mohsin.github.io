import { Section } from "@/components/Section";
import { motion } from "framer-motion";
import { useState } from "react";

const papers = [
  {
    title: "Internet of Evolving Agents",
    authors: "Z. Ali*, M. T. Shah*, M. A. Mohsin*, M. Umer, A. Bilal, E. Fox",
    venue: "NeurIPS",
    year: "2026",
    status: "in progress",
    links: ["paper"],
  },
  {
    title: "Sycophancy Disentanglement in LLMs via Reward Decomposition",
    authors: "M. A. Mohsin, A. Bilal, M. Umer, E. Fox",
    venue: "NeurIPS",
    year: "2026",
    status: "in progress",
    links: ["paper"],
  },
  {
    title: "S³: Stratified Scaling Search for Test-Time in Diffusion Language Models",
    authors: "A. Bilal*, M. A. Mohsin*, M. Umer, D. F. Hougen",
    venue: "CoLM",
    year: "2026",
    status: "in progress",
    links: ["paper"],
  },
  {
    title: "Active Alignment with Bayesian General Preference Models",
    authors: "M. Umer*, M. A. Mohsin*, A. Bilal, Ellen Vitercik, J. M. Cioffi",
    venue: "CoLM",
    year: "2026",
    status: "in progress",
    links: ["paper"],
  },
  {
    title: "Continuous-Utility Direct Preference Optimization",
    authors: "M. A. Mohsin, M. Umer, A. Bilal, Ellen Vitercik, J. M. Cioffi",
    venue: "ICML",
    year: "2026",
    status: "in progress",
    links: ["paper"],
  },
  {
    title: "What If We Allocate Test-Time Compute Adaptively?",
    authors: "A. Bilal*, M. A. Mohsin*, M. Umer, D. F. Hougen, J. M. Cioffi",
    venue: "ICML",
    year: "2026",
    status: "in progress",
    links: ["paper"],
  },
  {
    title: "Graph Neural Network for Accelerating Low-Rank SDP Solvers",
    authors: "M. A. Mohsin, M. Umer, A. Bilal, J. M. Cioffi, Ellen Vitercik",
    venue: "JMLR",
    year: "2026",
    status: "in progress",
    links: ["paper"],
  },
  {
    title: "Neural Gaussian Radio Fields for Channel Estimation",
    authors: "M. A. Mohsin*, M. Umer*, A. Bilal, J. M. Cioffi",
    venue: "KDD",
    year: "2026",
    status: "in progress",
    links: ["paper"],
  },
  {
    title: "Continual Learning for Wireless Channel Prediction",
    authors: "M. A. Mohsin, M. Umer, A. Bilal, J. M. Cioffi",
    venue: "ICML",
    year: "2025",
    links: ["paper"],
  },
  {
    title: "Automated Prompt Optimization Improves Robustness of Medical Benchmarks for LLMs",
    authors: "Asad Aali, Muhammad Ahmed Mohsin, Vasiliki Bikia, Arnav Singhvi, Suhana Bedi, Hejie Cui, Miguel Angel Fuentes Hernandez, Alyssa Unell, Yifan Mai, Michael Adam Pfeffer, Sanmi Koyejo, Roxana Daneshjou, Emily Alsentzer, Christopher Potts, Akshay S. Chaudhari",
    venue: "ML4H",
    year: "2025",
    links: ["paper"],
  },
  {
    title: "On the Fundamental Limits of Large Models at Scale",
    authors: "Muhammad Ahmed Mohsin, Muhammad Umer, Ahsan Bilal, Zeeshan Memon, Muhammad Ibtsaam Qadir, Sagnik Bhattacharya, Hassan Rizwan, Abhiram Rao Gorle, Maahe Zehra Kazmi, Ayesha Mohsin, Ali Subhan, M. Usman Rafique, Zihao He, Pulkit Mehta, Jinda Han, Muhammad Ali Jamshed, Dean F. Hougen, John M. Cioffi",
    venue: "TMLR",
    year: "2025",
    links: ["paper"],
  },
  {
    title: "Task-Aware Distributed Source Coding for Correlated Audio Signals Using Perceptual Loss",
    authors: "M. A. Mohsin, A. Bilal, S. Bhattacharya, J. M. Cioffi",
    venue: "AAAI",
    year: "2024",
    links: ["paper"],
  },
  {
    title: "Conditional Prior-Based Non-Stationary Channel Estimation Using Accelerated Diffusion Model-Based Denoising",
    authors: "M. A. Mohsin, A. Bilal, M. Umer, A. Aali, M. A. Jamshed, J. M. Cioffi",
    venue: "ICASSP",
    year: "2025",
    links: ["paper"],
  },
  {
    title: "Successive Interference Cancellation-Aided Diffusion Models for Joint Channel Estimation and Data Detection in Low-Rank Channel Scenarios",
    authors: "S. Bhattacharya, M. A. Mohsin, K. Rajabalifardi, J. M. Cioffi",
    venue: "ICASSP",
    year: "2024",
    links: ["paper"],
  },
  {
    title: "PyramidTabNet: Transformer-Based Table Recognition in Image-Based Documents",
    authors: "M. Umer, M. A. Mohsin, A. Ul-Hasan, F. Shafait",
    venue: "ICDAR",
    year: "2023",
    links: ["paper"],
  },
];

const INITIAL_COUNT = 6;

function PaperRow({ paper, index }: { paper: (typeof papers)[number]; index: number }) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: (index % INITIAL_COUNT) * 0.04, duration: 0.5 }}
      className="border-t border-[#c0d4c2]/50 py-6 grid grid-cols-[2rem_1fr] md:grid-cols-[2rem_110px_1fr] gap-x-5 gap-y-1 group"
      data-testid={`card-paper-${index}`}
    >
      <span className="font-mono text-[10px] text-[#c0d4c2] pt-0.5 self-start">
        {num}
      </span>

      <span className="hidden md:block font-mono text-[10px] text-[#90aa98] pt-0.5 self-start leading-relaxed">
        {paper.venue} '{paper.year.slice(2)}
        {paper.status && (
          <span className="block text-[#a0b8a4] mt-0.5">· {paper.status}</span>
        )}
      </span>

      <div className="col-start-2 md:col-start-3">
        <span className="md:hidden font-mono text-[10px] text-[#90aa98] block mb-1.5">
          {paper.venue} {paper.year}{paper.status && ` · ${paper.status}`}
        </span>
        <h3 className="text-sm font-semibold text-[#1a3520] leading-snug group-hover:text-[#2d5035] transition-colors mb-2">
          {paper.title}
        </h3>
        <p className="text-xs text-[#90aa98] leading-relaxed mb-3">
          {paper.authors}
        </p>
        <div className="flex flex-wrap gap-4">
          {paper.links.map((link, j) => (
            <a
              key={j}
              href="#"
              className="font-mono text-[10px] text-[#6a8a72] hover:text-[#2d5035] underline underline-offset-4 decoration-[#c0d4c2] hover:decoration-[#4a6852] transition-colors"
              data-testid={`link-paper-${index}-${link}`}
            >
              {link} ↗
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function ResearchSection() {
  const [expanded, setExpanded] = useState(false);
  const visiblePapers = expanded ? papers : papers.slice(0, INITIAL_COUNT);

  return (
    <Section id="research" title="Selected Publications">
      <div>
        {visiblePapers.map((paper, i) => (
          <PaperRow key={i} paper={paper} index={i} />
        ))}
      </div>

      {papers.length > INITIAL_COUNT && (
        <div className="border-t border-[#c0d4c2]/50 pt-6 flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="font-mono text-[10px] text-[#90aa98] hover:text-[#2d5035] transition-colors uppercase tracking-widest"
          >
            {expanded ? "↑ Show Less" : `Show All ${papers.length} Publications`}
          </button>
          {!expanded && (
            <span className="font-mono text-[10px] text-[#c0d4c2]">
              {papers.length - INITIAL_COUNT} more
            </span>
          )}
        </div>
      )}
    </Section>
  );
}
