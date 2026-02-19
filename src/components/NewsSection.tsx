import { Section } from "@/components/Section";
import { motion } from "framer-motion";

const newsItems = [
  {
    date: "September 2025",
    content:
      "Served as a member of technical program committee @ NeurIPS 2025 and a NeurIPS reviewer as well.",
  },
  {
    date: "August 2025",
    content:
      "Received recognition for exemplary reviewer 2025 for IEEE Wireless Communications Magazine special issue October 2025.",
  },
  {
    date: "July 2025",
    content:
      "Added to the IEEE special interests group (SIG) on AI-driven TN-NTN Networks founding members.",
  },
  {
    date: "July 2025",
    content:
      'ICML 2025 paper accepted on "Continual Learning for Wireless Channel Estimation" and won a student travel grant to ICML.',
  },
  {
    date: "May 2025",
    content:
      "ICC Student travel grant awarded for Montreal and best workshop paper award for RAG optimized wireless environment perception.",
  },
  {
    date: "Jan 2025",
    content:
      "2 papers for Hierarchical Deep RL and Joint Source Compression accepted @ AAAI 2025 taking place in Philadelphia.",
  },
  {
    date: "Dec 2024",
    content:
      "2 papers for Diffusion based Langevin dynamics and minPMAC optimization accepted @ IEEE ICASSP 2025 taking place in India.",
  },
  {
    date: "Dec 2024",
    content: "Globecom 2024 travel grant awarded for travel to Cape Town.",
  },
  {
    date: "Sept 2024",
    content: "Best poster award nomination @ 6G Summit in Abu Dhabi.",
  },
  {
    date: "Apr 2024",
    content: "Rectors Gold Medal for best undergraduate thesis.",
  },
  {
    date: "Jan 2024",
    content: "PhD Acceptance from Stanford with Stanford Graduate Fellowship.",
  },
  {
    date: "Aug 2022",
    content:
      "First paper accepted at ICDAR 2023 beating Microsoft's DiT for tabular recognition tasks (SOTA Model).",
  },
  {
    date: "Oct 2021",
    content:
      "ECAT Scholarship, for being top 10 in Pakistan in Engineering category test.",
  },
  {
    date: "Jun 2021",
    content:
      "President's medal for being among top 3 all over Pakistan at HSSC level.",
  },
  { date: "Jan 2021 - Jun 2023", content: "NUST scholarship for 4 pointer." },
];

export function NewsSection() {
  return (
    <Section id="news" title="News">
      <div className="border border-white/10">
        <div className="grid md:grid-cols-3">
          {newsItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              className="p-6 border-b border-white/10 md:border-r md:odd:border-white/10 last:border-b-0 md:[&:nth-last-child(2):nth-child(odd)]:border-b-0"
              data-testid={`card-news-${i}`}
            >
              <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-white/50 border border-white/15 mb-4">
                {item.date}
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
