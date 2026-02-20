import { Section } from "@/components/Section";
import { motion } from "framer-motion";

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

export function ReviewerSection() {
  return (
    <Section id="reviewer" title="Service & Awards" className="bg-white/[0.02]">
      <div className="space-y-8">
        <motion.fieldset
          className="border border-white/20 px-6 pb-6 pt-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <legend className="px-2 text-xs font-mono uppercase tracking-widest text-white/50">
            Conference Reviewer
          </legend>
          <div className="flex flex-wrap gap-3">
            {conferences.map((conf, i) => (
              <motion.span
                key={conf}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="px-4 py-2 border border-white/15 font-display font-semibold text-sm text-white tracking-wide"
                data-testid={`tag-conf-${conf}`}
              >
                {conf}
              </motion.span>
            ))}
          </div>
        </motion.fieldset>

        <motion.fieldset
          className="border border-white/20 px-6 pb-6 pt-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <legend className="px-2 text-xs font-mono uppercase tracking-widest text-white/50">
            Journal Reviewer
          </legend>
          <div className="flex flex-wrap gap-3">
            {journals.map((journal, i) => (
              <motion.span
                key={journal.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="px-4 py-2 border border-white/15 text-sm"
                data-testid={`tag-journal-${i}`}
              >
                <span className="font-display font-semibold text-white tracking-wide">
                  {journal.name}
                </span>
                <span className="text-white/30 mx-1.5">/</span>
                <span className="font-mono text-[11px] text-white/40">
                  {journal.desc}
                </span>
              </motion.span>
            ))}
          </div>
        </motion.fieldset>

        <motion.fieldset
          className="border border-white/20 px-6 pb-6 pt-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <legend className="px-2 text-xs font-mono uppercase tracking-widest text-white/50">
            Technical Program Committee & Leadership
          </legend>
          <div className="flex flex-wrap gap-3 mb-4">
            {tpc.map((item, i) => (
              <span
                key={i}
                className="px-4 py-2 border border-white/15 font-display font-semibold text-sm text-white tracking-wide"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {leadership.map((item, i) => (
              <span
                key={i}
                className="px-4 py-2 border border-yellow-400/20 text-sm"
              >
                <span className="font-display font-semibold text-yellow-400/80 tracking-wide">
                  {item.role}
                </span>
                <span className="text-white/30 mx-1.5">—</span>
                <span className="font-mono text-[11px] text-white/40">
                  {item.venue}
                </span>
              </span>
            ))}
          </div>
        </motion.fieldset>

        <motion.fieldset
          className="border border-white/20 px-6 pb-6 pt-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <legend className="px-2 text-xs font-mono uppercase tracking-widest text-white/50">
            Awards & Travel Grants
          </legend>
          <div className="space-y-2 mb-4">
            {awards.map((award, i) => (
              <p key={i} className="text-sm text-muted-foreground">
                <span className="text-yellow-400/70 mr-2">★</span>
                {award}
              </p>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {travelGrants.map((grant, i) => (
              <span
                key={i}
                className="px-4 py-2 border border-white/20 font-mono text-xs text-white/40"
              >
                {grant}
              </span>
            ))}
          </div>
        </motion.fieldset>
      </div>
    </Section>
  );
}
