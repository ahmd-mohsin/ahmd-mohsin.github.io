import { Section } from "@/components/Section";
import { motion } from "framer-motion";

const conferences = [
  "ICML",
  "AAAI",
  "ICDAR",
  "Globecom",
  "WCNC",
  "ICASSP",
  "ICC",
  "NeurIPS",
];

const journals = [
  { name: "IEEE TVT", desc: "Vehicular Technology" },
  { name: "IEEE WCL", desc: "Wireless Comm. Letters" },
  { name: "IEEE WCM", desc: "Wireless Comm. Magazine" },
  { name: "IEEE CL", desc: "Communication Letters" },
  { name: "IEEE GCN", desc: "Green Comm. & Networks" },
  { name: "IEEE MCN", desc: "Mobile Comm. & Networks" },
  { name: "IEEE WC", desc: "Wireless Communications" },
];

export function ReviewerSection() {
  return (
    <Section id="reviewer" title="Reviewer" className="bg-white/[0.02]">
      <div className="space-y-8">
        <motion.fieldset
          className="border border-white/10 px-6 pb-6 pt-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <legend className="px-2 text-xs font-mono uppercase tracking-widest text-white/50">
            Conferences
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
          className="border border-white/10 px-6 pb-6 pt-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <legend className="px-2 text-xs font-mono uppercase tracking-widest text-white/50">
            Journals
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
      </div>
    </Section>
  );
}
