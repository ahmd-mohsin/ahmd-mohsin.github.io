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
    <section
      id={id}
      className={cn("py-24 md:py-32", className)}
    >
      <div className="max-w-5xl mx-auto px-6">
        {title && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-12"
          >
            <span className="block h-px w-6 bg-[#5fae7a]/60" />
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#5fae7a]">
              {title}
            </h2>
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}
