import { motion } from "framer-motion";
import { ArrowRight, Box, Cpu, Network } from "lucide-react";

interface ResearchCardProps {
  title: string;
  items: string[];
  icon: "optimization" | "network" | "llm";
  delay?: number;
}

const icons = {
  optimization: Box,
  network: Network,
  llm: Cpu,
};

export function ResearchCard({ title, items, icon, delay = 0 }: ResearchCardProps) {
  const Icon = icons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.07]"
    >
      <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      
      <h3 className="text-xl font-display font-semibold mb-4 text-foreground">{title}</h3>
      
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/50 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
      
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors">
        <span>Learn more</span>
        <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
}
