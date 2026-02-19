import { motion } from "framer-motion";

interface NewsItemProps {
  date: string;
  content: string;
  index: number;
}

export function NewsItem({ date, content, index }: NewsItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-8 pb-8 border-l border-white/10 last:pb-0"
    >
      <div className="absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full bg-background border border-primary/50 ring-4 ring-background" />
      
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
        <span className="text-xs font-mono text-primary/70 uppercase tracking-wider min-w-[120px]">
          {date}
        </span>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {content}
        </p>
      </div>
    </motion.div>
  );
}
