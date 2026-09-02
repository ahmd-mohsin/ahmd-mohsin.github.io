import { Section } from "@/components/Section";
import { GlassPanel } from "@/components/GlassPanel";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const conferences = ["AAAI", "ICDAR", "NeurIPS", "ICML (Silver Reviewer)", "ICLR", "KDD", "CoLM"];
const journals = [
  { name: "IEEE TAI", desc: "Transactions on AI" },
  { name: "TMLR", desc: "Transactions on Machine Learning Research" },
  { name: "AAI", desc: "Applied Artificial Intelligence" },
];
const travelGrants = [
  "IEEE GLOBECOM 2024 (Cape Town, South Africa)",
  "IEEE ICC 2025 (Canada)",
  "Stanford Conference Travel Grant 2025",
  "IEEE ICC 2026 (Glasgow, Scotland)",
];
const awards = [
  "Stanford Graduate Fellowship",
  "Qualcomm Fellowship",
  "Knight-Hennessy Fellowship — Finalist",
  "President's Medal — Third position nationwide in pre-engineering",
  "6G Summit Abu Dhabi — Best Poster Nomination",
  "IEEE ICC Canada — Best Workshop Paper Award",
  "IEEE Communications Society Competition — Honorary Mention",
  "IEEE FIT 2026 — Best Main Conference Paper Award",
  "Rector's Gold Medal — Best final year project cohort (NUST, 2024)",
  "HSSC Federal Board Scholarship (PKR 200,000)",
  "STEP-ECAT Scholarship — Top 10 engineering candidates nationwide (PKR 200,000)",
];
const tpc = ["NeurIPS 2025", "ICASSP 2026"];
const leadership = [
  { role: "Workshop Co-Chair", venue: "IEEE ICC 2026" },
  { role: "Area Chair", venue: "ICASSP 2026, NeurIPS 2025" },
];

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="border border-[#b07f95]/25 bg-[#191016]/60 px-3 py-1.5 font-mono text-[11px] text-[#c79bad] hover:text-[#f48fb1] hover:border-[#f48fb1]/40 transition-colors">
      {children}
    </span>
  );
}

function SubSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-[#b07f95]/20 pt-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#f48fb1] mb-5">
        {label}
      </p>
      {children}
    </div>
  );
}

export function ReviewerSection() {
  return (
    <Section id="reviewer" title="Service & Awards">
      <GlassPanel className="p-8 md:p-10">
        <div className="space-y-0">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SubSection label="Conference Reviewer">
            <div className="flex flex-wrap gap-2">
              {conferences.map((conf) => <Tag key={conf}>{conf}</Tag>)}
            </div>
          </SubSection>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.05 }}>
          <SubSection label="Journal Reviewer">
            <div className="flex flex-wrap gap-2">
              {journals.map((j, i) => (
                <span key={j.name} className="border border-[#b07f95]/25 bg-[#191016]/60 px-3 py-1.5 font-mono text-[11px] text-[#ffc1d9]" data-testid={`tag-journal-${i}`}>
                  {j.name}
                  <span className="text-[#8a6a78] mx-1.5">/</span>
                  <span className="text-[#c79bad]">{j.desc}</span>
                </span>
              ))}
            </div>
          </SubSection>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
          <SubSection label="Technical Program Committee">
            <div className="flex flex-wrap gap-2 mb-6">
              {tpc.map((item, i) => <Tag key={i}>{item}</Tag>)}
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#f48fb1] mb-4">Leadership</p>
            <div className="flex flex-wrap gap-2">
              {leadership.map((item, i) => (
                <span key={i} className="border border-[#b07f95]/25 bg-[#191016]/60 px-3 py-1.5 font-mono text-[11px]">
                  <span className="text-[#ffc1d9] font-medium">{item.role}</span>
                  <span className="text-[#8a6a78] mx-1.5">—</span>
                  <span className="text-[#c79bad]">{item.venue}</span>
                </span>
              ))}
            </div>
          </SubSection>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}>
          <SubSection label="Awards & Recognitions">
            <div className="space-y-2.5 mb-8">
              {awards.map((award, i) => (
                <p key={i} className="flex gap-3 text-sm text-[#e2cdd6]">
                  <span className="text-[#8a6a78] shrink-0">—</span>
                  {award}
                </p>
              ))}
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#f48fb1] mb-4">Travel Grants</p>
            <div className="flex flex-wrap gap-2">
              {travelGrants.map((grant, i) => <Tag key={i}>{grant}</Tag>)}
            </div>
          </SubSection>
        </motion.div>
        </div>
      </GlassPanel>
    </Section>
  );
}
