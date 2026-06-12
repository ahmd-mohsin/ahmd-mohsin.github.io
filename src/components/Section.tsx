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
    <section id={id} className={cn("py-24 md:py-32 border-b border-[#1a2818] last:border-0", className)}>
      <div className="max-w-5xl mx-auto px-6">
        {title && (
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#3d5239] mb-10"
          >
            {title}
          </motion.h2>
        )}
        <div className="space-y-10">
          {children}
        </div>
      </div>
    </section>
  );
}
