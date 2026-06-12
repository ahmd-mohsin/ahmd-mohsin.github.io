import { Section } from "@/components/Section";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const conferences = [
  "AAAI",
  "ICDAR",
  "GLOBECOM",
  "WCNC",
  "ICASSP",
  "ICC",
  "ICML",
  "NeurIPS",
  "TMLR",
  "KDD",
];

const journals = [
  { name: "IEEE TVT", desc: "Vehicular Technology" },
  { name: "IEEE GCN", desc: "Green Comm. & Networks" },
  { name: "IEEE CL", desc: "Communication Letters" },
  { name: "IEEE WC", desc: "Wireless Communications" },
  { name: "IEEE WCM", desc: "Wireless Comm. Magazine" },
  { name: "IEEE TNSE", desc: "Network Science & Engineering" },
];

const travelGrants = [
  "IEEE GLOBECOM 2024 (Cape Town, South Africa)",
  "IEEE ICC 2025 (Canada)",
  "Stanford Conference Travel Grant 2025",
];

const awards = [
  "6G Summit Abu Dhabi — Best Poster Nomination",
  "IEEE ICC Canada — Best Workshop Paper Award",
  "IEEE Communications Society Competition — Honorary Mention",
  "IEEE FIT 2026 — Best Main Conference Paper Award",
];

const tpc = [
  "WCNC 2026",
  "ICC 2026",
  "VTC 2026",
  "NeurIPS 2025",
  "ICASSP 2026",
];

const leadership = [
  { role: "Workshop Co-Chair", venue: "IEEE ICC 2026" },
  { role: "Area Chair", venue: "ICASSP 2026, NeurIPS 2025" },
];

function SubLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#3d5239] mb-3">
      {children}
    </p>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="border border-[#1a2818] px-3 py-1.5 font-mono text-xs text-[#7a9472]">
      {children}
    </span>
  );
}

export function ReviewerSection() {
  return (
    <Section id="reviewer" title="Service & Awards">
      <div className="space-y-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <SubLabel>Conference Reviewer</SubLabel>
          <div className="flex flex-wrap gap-2">
            {conferences.map((conf) => (
              <Chip key={conf}>{conf}</Chip>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <SubLabel>Journal Reviewer</SubLabel>
          <div className="flex flex-wrap gap-2">
            {journals.map((journal, i) => (
              <span
                key={journal.name}
                className="border border-[#1a2818] px-3 py-1.5 font-mono text-xs text-[#7a9472]"
                data-testid={`tag-journal-${i}`}
              >
                {journal.name}
                <span className="text-[#3d5239] mx-1.5">/</span>
                {journal.desc}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <SubLabel>Technical Program Committee</SubLabel>
          <div className="flex flex-wrap gap-2 mb-6">
            {tpc.map((item, i) => (
              <Chip key={i}>{item}</Chip>
            ))}
          </div>

          <SubLabel>Leadership</SubLabel>
          <div className="flex flex-wrap gap-2">
            {leadership.map((item, i) => (
              <span
                key={i}
                className="border border-[#1a2818] px-3 py-1.5 font-mono text-xs"
              >
                <span className="text-[#5a8c52]">{item.role}</span>
                <span className="text-[#3d5239] mx-1.5">—</span>
                <span className="text-[#7a9472]">{item.venue}</span>
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <SubLabel>Awards & Recognitions</SubLabel>
          <div className="space-y-2 mb-8">
            {awards.map((award, i) => (
              <p key={i} className="flex gap-3 text-sm text-[#7a9472]">
                <span className="text-[#3d5239] shrink-0">—</span>
                {award}
              </p>
            ))}
          </div>

          <SubLabel>Travel Grants</SubLabel>
          <div className="flex flex-wrap gap-2">
            {travelGrants.map((grant, i) => (
              <Chip key={i}>{grant}</Chip>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
