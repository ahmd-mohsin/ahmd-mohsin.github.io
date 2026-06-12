import { Section } from "@/components/Section";
import { motion } from "framer-motion";

const newsItems = [
  { date: "2026", content: "Served as an Area Chair for ICASSP." },
  { date: "2026", content: "Selected as a Qualcomm Fellowship finalist." },
  { date: "2026", content: "Serving as Workshop Co-Chair for VTC Fall 2026 in Boston." },
  { date: "Sep 2025", content: "Served as a member of the Technical Program Committee at NeurIPS 2025 and also as a NeurIPS reviewer." },
  { date: "Aug 2025", content: "Received the Exemplary Reviewer recognition for IEEE Wireless Communications Letters 2025." },
  { date: "Jul 2025", content: "Added as a founding member of the IEEE Special Interest Group on AI-driven TN-NTN Networks." },
  { date: "Jul 2025", content: 'Paper accepted at ICML 2025 on "Continual Learning for Wireless Channel Estimation," along with a student travel grant to ICML.' },
  { date: "May 2025", content: "Received an ICC student travel grant for Montreal and a best workshop paper award for RAG-optimized wireless environment perception." },
  { date: "Jan 2025", content: "Two papers on Hierarchical Deep RL and Joint Source Compression accepted at AAAI 2025 in Philadelphia." },
  { date: "Dec 2024", content: "Two papers on diffusion-based Langevin dynamics and minPMAC optimization accepted at IEEE ICASSP 2025 in India." },
  { date: "Dec 2024", content: "Awarded a Globecom 2024 travel grant for travel to Cape Town." },
  { date: "Sep 2024", content: "Received a Best Poster Award nomination at the 6G Summit in Abu Dhabi." },
  { date: "Apr 2024", content: "Awarded the Rector's Gold Medal for best undergraduate thesis." },
  { date: "Jan 2024", content: "Accepted to Stanford with the Stanford Graduate Fellowship." },
  { date: "Aug 2022", content: "First paper accepted at ICDAR 2023, outperforming Microsoft's DiT on table recognition tasks." },
  { date: "Oct 2021", content: "Received the ECAT Scholarship for ranking among the top 10 in Pakistan in the engineering category test." },
  { date: "Jun 2021", content: "Received the President's Medal for ranking among the top 3 students across Pakistan at the HSSC level." },
  { date: "2021 – 2023", content: "Awarded the NUST scholarship for maintaining a 4.0 GPA." },
];

export function NewsSection() {
  return (
    <Section id="news" title="News">
      <div>
        {newsItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.015, duration: 0.4 }}
            className="border-t border-[#c0d4c2]/50 py-4 grid grid-cols-[7rem_1fr] gap-6 items-start"
            data-testid={`card-news-${i}`}
          >
            <span className="font-mono text-[10px] text-[#90aa98] pt-0.5 tracking-wide">
              {item.date}
            </span>
            <p className="text-sm leading-relaxed text-[#5d7a65]">
              {item.content}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
