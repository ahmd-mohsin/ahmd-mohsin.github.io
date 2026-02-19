import { Section } from "@/components/Section";
import { motion } from "framer-motion";

const papers = [
  {
    title: "Continual Learning for Wireless Channel Prediction",
    authors:
      "Muhammad Ahmed Mohsin, Muhammad Umer, Ahsan Bilal, Muhammad Ali Jameshed, John M. Cioffi",
    venue: "ICML",
    year: "2025",
    links: ["arXiv", "paper", "website", "algorithm code"],
  },
  {
    title:
      "Hierarchical Deep Reinforcement Learning for Spectrum Resource Optimization in Integrated Terrestrial and Non-Terrestrial Networks",
    authors:
      "Muhammad Ahmed Mohsin, Hassan Rizwan, Muhammad Umer, Sagnik Bhattacharya, Ahsan Bilal, John M. Cioffi",
    venue: "AAAI",
    year: "2025",
    links: ["arXiv", "paper", "website", "code"],
  },
  {
    title:
      "Retrieval Augmented Generation with Multi-Modal LLM Framework for Wireless Environments",
    authors:
      "Muhammad Ahmed Mohsin, Ahsan Bilal, Sagnik Bhattacharya, John M. Cioffi",
    venue: "ICC",
    year: "2025",
    award: "Best Paper Award",
    links: ["arXiv", "website"],
  },
  {
    title:
      "Task and Perception-aware Distributed Source Coding for Correlated Speech under Bandwidth-constrained Channels",
    authors:
      "Sagnik Bhattacharya, Muhammad Ahmed Mohsin, Ahsan Bilal, John M. Cioffi",
    venue: "AAAI",
    year: "2025",
    links: ["arXiv", "paper", "website"],
  },
  {
    title:
      "Successive Interference Cancellation-aided Diffusion Models for Joint Channel Estimation and Data Detection in Low Rank Channel Scenarios",
    authors:
      "Sagnik Bhattacharya, Muhammad Ahmed Mohsin, Kami Fardi, John M. Cioffi",
    venue: "ICASSP",
    year: "2024",
    links: ["arXiv", "paper"],
  },
  {
    title:
      "Optimum Power-Subcarrier Allocation and Time-Sharing in Multicarrier NOMA Uplink",
    authors:
      "Sagnik Bhattacharya, Muhammad Ahmed Mohsin, Kami Fardi, John M. Cioffi",
    venue: "ICASSP",
    year: "2025",
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
      className="group border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
      data-testid={`card-paper-${index}`}
    >
      <div className="h-32 bg-gradient-to-br from-white/[0.03] to-white/[0.08] border-b border-white/10 flex items-center justify-center px-6">
        <span className="font-mono text-xs text-white/30 uppercase tracking-widest">
          {paper.venue} {paper.year}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-display font-bold text-sm md:text-base tracking-wide text-white mb-3 leading-snug">
          {paper.title}
          {paper.award && (
            <span className="inline-block ml-2 text-xs font-mono text-yellow-400/80 normal-case tracking-normal">
              {paper.award}
            </span>
          )}
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
  return (
    <Section id="research" title="Research" className="bg-white/[0.02]">
      <div className="grid md:grid-cols-2 gap-6 ">
        {papers.map((paper, i) => (
          <PaperCard key={i} paper={paper} index={i} />
        ))}
      </div>
    </Section>
  );
}
