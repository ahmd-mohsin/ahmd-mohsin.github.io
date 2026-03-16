import { Section } from "@/components/Section";
import { motion } from "framer-motion";

const newsItems = [
  {
    date: "2026",
    content: "Served as an Area Chair for ICASSP.",
  },
  {
    date: "2026",
    content: "Selected as a Qualcomm Fellowship finalist.",
  },
  {
    date: "2026",
    content: "Serving as Workshop Co-Chair for VTC Fall 2026 in Boston.",
  },
  {
    date: "September 2025",
    content:
      "Served as a member of the Technical Program Committee at NeurIPS 2025 and also as a NeurIPS reviewer.",
  },
  {
    date: "August 2025",
    content:
      "Received the Exemplary Reviewer recognition for IEEE Wireless Communications Letters 2025.",
  },
  {
    date: "July 2025",
    content:
      "Added as a founding member of the IEEE Special Interest Group on AI-driven TN-NTN Networks.",
  },
  {
    date: "July 2025",
    content:
      'Paper accepted at ICML 2025 on "Continual Learning for Wireless Channel Estimation," along with a student travel grant to ICML.',
  },
  {
    date: "May 2025",
    content:
      "Received an ICC student travel grant for Montreal and a best workshop paper award for RAG-optimized wireless environment perception.",
  },
  {
    date: "Jan 2025",
    content:
      "Two papers on Hierarchical Deep RL and Joint Source Compression accepted at AAAI 2025 in Philadelphia.",
  },
  {
    date: "Dec 2024",
    content:
      "Two papers on diffusion-based Langevin dynamics and minPMAC optimization accepted at IEEE ICASSP 2025 in India.",
  },
  {
    date: "Dec 2024",
    content: "Awarded a Globecom 2024 travel grant for travel to Cape Town.",
  },
  {
    date: "Sept 2024",
    content: "Received a Best Poster Award nomination at the 6G Summit in Abu Dhabi.",
  },
  {
    date: "Apr 2024",
    content: "Awarded the Rector’s Gold Medal for best undergraduate thesis.",
  },
  {
    date: "Jan 2024",
    content: "Accepted to Stanford with the Stanford Graduate Fellowship.",
  },
  {
    date: "Aug 2022",
    content:
      "First paper accepted at ICDAR 2023, outperforming Microsoft’s DiT on table recognition tasks.",
  },
  {
    date: "Oct 2021",
    content:
      "Received the ECAT Scholarship for ranking among the top 10 in Pakistan in the engineering category test.",
  },
  {
    date: "Jun 2021",
    content:
      "Received the President’s Medal for ranking among the top 3 students across Pakistan at the HSSC level.",
  },
  {
    date: "Jan 2021 - Jun 2023",
    content: "Awarded the NUST scholarship for maintaining a 4.0 GPA.",
  },
];

export function NewsSection() {
  return (
    <Section id="news" title="News">
      <div className="overflow-hidden rounded-2xl border border-yellow-500/40">
        <div className="grid md:grid-cols-3">
          {newsItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              className="border-b border-yellow-500/25 p-6 md:border-r md:border-r-yellow-500/25 last:border-b-0 md:[&:nth-last-child(2):nth-child(odd)]:border-b-0"
              data-testid={`card-news-${i}`}
            >
              <span className="mb-4 inline-block border border-yellow-500/30 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-yellow-400/80">
                {item.date}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}