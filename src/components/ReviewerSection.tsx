import { Section } from "@/components/Section";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const conferences = ["AAAI", "ICDAR", "GLOBECOM", "WCNC", "ICASSP", "ICC", "ICML", "NeurIPS", "TMLR", "KDD"];
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
const tpc = ["WCNC 2026", "ICC 2026", "VTC 2026", "NeurIPS 2025", "ICASSP 2026"];
const leadership = [
  { role: "Workshop Co-Chair", venue: "IEEE ICC 2026" },
  { role: "Area Chair", venue: "ICASSP 2026, NeurIPS 2025" },
];

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="border border-[#c0d4c2] bg-[#eaf0ea]/60 px-3 py-1.5 font-mono text-[11px] text-[#6a8a72] hover:text-[#2d5035] hover:border-[#90aa98] transition-colors">
      {children}
    </span>
  );
}

function SubSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-[#c0d4c2]/50 pt-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#90aa98] mb-5">
        {label}
      </p>
      {children}
    </div>
  );
}

export function ReviewerSection() {
  return (
    <Section id="reviewer" title="Service & Awards">
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
                <span key={j.name} className="border border-[#c0d4c2] bg-[#eaf0ea]/60 px-3 py-1.5 font-mono text-[11px] text-[#6a8a72]" data-testid={`tag-journal-${i}`}>
                  {j.name}
                  <span className="text-[#c0d4c2] mx-1.5">/</span>
                  <span className="text-[#90aa98]">{j.desc}</span>
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
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#90aa98] mb-4">Leadership</p>
            <div className="flex flex-wrap gap-2">
              {leadership.map((item, i) => (
                <span key={i} className="border border-[#c0d4c2] bg-[#eaf0ea]/60 px-3 py-1.5 font-mono text-[11px]">
                  <span className="text-[#3a5440] font-medium">{item.role}</span>
                  <span className="text-[#c0d4c2] mx-1.5">—</span>
                  <span className="text-[#6a8a72]">{item.venue}</span>
                </span>
              ))}
            </div>
          </SubSection>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}>
          <SubSection label="Awards & Recognitions">
            <div className="space-y-2.5 mb-8">
              {awards.map((award, i) => (
                <p key={i} className="flex gap-3 text-sm text-[#5d7a65]">
                  <span className="text-[#c0d4c2] shrink-0">—</span>
                  {award}
                </p>
              ))}
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#90aa98] mb-4">Travel Grants</p>
            <div className="flex flex-wrap gap-2">
              {travelGrants.map((grant, i) => <Tag key={i}>{grant}</Tag>)}
            </div>
          </SubSection>
        </motion.div>
      </div>
    </Section>
  );
}
