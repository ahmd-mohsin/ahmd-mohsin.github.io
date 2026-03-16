import { Section } from "@/components/Section";
import { motion } from "framer-motion";
import { useState } from "react";

const papers = [
  {
    title: "Internet of Evolving Agents",
    authors: "Z. Ali*, M. T. Shah*, M. A. Mohsin*, M. Umer, A. Bilal, E. Fox",
    venue: "NeurIPS",
    year: "2026",
    status: "In progress",
    links: ["paper"],
  },
  {
    title: "Sycophancy Disentanglement in LLMs via Reward Decomposition",
    authors: "M. A. Mohsin, A. Bilal, M. Umer, E. Fox",
    venue: "NeurIPS",
    year: "2026",
    status: "In progress",
    links: ["paper"],
  },
  {
    title: "S³: Stratified Scaling Search for Test-Time in Diffusion Language Models",
    authors: "A. Bilal*, M. A. Mohsin*, M. Umer, D. F. Hougen",
    venue: "CoLM",
    year: "2026",
    status: "In progress",
    links: ["paper"],
  },
  {
    title: "Active Alignment with Bayesian General Preference Models",
    authors: "M. Umer*, M. A. Mohsin*, A. Bilal, Ellen Vitercik, J. M. Cioffi",
    venue: "CoLM",
    year: "2026",
    status: "In progress",
    links: ["paper"],
  },
  {
    title: "Continuous-Utility Direct Preference Optimization",
    authors: "M. A. Mohsin, M. Umer, A. Bilal, Ellen Vitercik, J. M. Cioffi",
    venue: "ICML",
    year: "2026",
    status: "In progress",
    links: ["paper"],
  },
  {
    title: "What If We Allocate Test-Time Compute Adaptively?",
    authors: "A. Bilal*, M. A. Mohsin*, M. Umer, D. F. Hougen, J. M. Cioffi",
    venue: "ICML",
    year: "2026",
    status: "In progress",
    links: ["paper"],
  },
  {
    title: "Graph Neural Network for Accelerating Low-Rank SDP Solvers",
    authors: "M. A. Mohsin, M. Umer, A. Bilal, J. M. Cioffi, Ellen Vitercik",
    venue: "JMLR",
    year: "2026",
    status: "In progress",
    links: ["paper"],
  },
  {
    title: "Neural Gaussian Radio Fields for Channel Estimation",
    authors: "M. A. Mohsin*, M. Umer*, A. Bilal, J. M. Cioffi",
    venue: "KDD",
    year: "2026",
    status: "In progress",
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
    authors:
      "Asad Aali, Muhammad Ahmed Mohsin, Vasiliki Bikia, Arnav Singhvi, Suhana Bedi, Hejie Cui, Miguel Angel Fuentes Hernandez, Alyssa Unell, Yifan Mai, Michael Adam Pfeffer, Sanmi Koyejo, Roxana Daneshjou, Emily Alsentzer, Christopher Potts, Akshay S. Chaudhari",
    venue: "ML4H",
    year: "2025",
    links: ["paper"],
  },
  {
    title: "On the Fundamental Limits of Large Models at Scale",
    authors:
      "Muhammad Ahmed Mohsin, Muhammad Umer, Ahsan Bilal, Zeeshan Memon, Muhammad Ibtsaam Qadir, Sagnik Bhattacharya, Hassan Rizwan, Abhiram Rao Gorle, Maahe Zehra Kazmi, Ayesha Mohsin, Ali Subhan, M. Usman Rafique, Zihao He, Pulkit Mehta, Jinda Han, Muhammad Ali Jamshed, Dean F. Hougen, John M. Cioffi",
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
      className="group overflow-hidden rounded-2xl border border-yellow-500/35 bg-transparent transition-all duration-300 hover:border-yellow-400/60"
      data-testid={`card-paper-${index}`}
    >
      <div className="flex h-32 items-center justify-center border-b border-yellow-500/25 bg-gradient-to-br from-yellow-500/[0.03] to-transparent px-6">
        <span className="text-center font-mono text-xs uppercase tracking-widest text-yellow-400/75">
          {paper.venue} {paper.year}
          {paper.status && (
            <span className="mt-1 block text-[10px] text-yellow-300/80">
              {paper.status}
            </span>
          )}
        </span>
      </div>

      <div className="p-6">
        <h3 className="mb-3 font-display text-sm font-bold tracking-wide text-yellow-400 md:text-base leading-snug">
          {paper.title}
        </h3>

        <p className="mb-4 text-xs font-sans text-muted-foreground">
          {paper.authors}
        </p>

        <div className="flex flex-wrap gap-3">
          {paper.links.map((link, j) => (
            <a
              key={j}
              href="#"
              className="font-mono text-xs text-yellow-500/70 underline underline-offset-4 decoration-yellow-500/25 transition-colors hover:text-yellow-300 hover:decoration-yellow-400/60"
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
  const visibleExtra = expanded ? papers.slice(2) : papers.slice(2, 8);

  return (
    <Section id="research" title="Selected Publications">
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        {papers.slice(0, 2).map((paper, i) => (
          <PaperCard key={i} paper={paper} index={i} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {visibleExtra.map((paper, i) => (
          <PaperCard key={i + 2} paper={paper} index={i + 2} />
        ))}
      </div>

      {papers.length > 8 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-full border border-yellow-500/35 px-8 py-3 font-mono text-sm uppercase tracking-wider text-yellow-400/80 transition-colors hover:border-yellow-400/60 hover:text-yellow-300"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </Section>
  );
}