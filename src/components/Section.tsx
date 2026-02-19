import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  id: string;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, title, children, className }: SectionProps) {
  return (
    <section id={id} className={cn("py-24 md:py-32 border-b border-white/5 last:border-0", className)}>
      <div className="max-w-5xl mx-auto px-6">
        {title && (
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold mb-12 flex items-center gap-4"
          >
            <span className="w-8 h-[1px] bg-primary/50 block"></span>
            {title}
          </motion.h2>
        )}
        <div className="space-y-12">
          {children}
        </div>
      </div>
    </section>
  );
}
