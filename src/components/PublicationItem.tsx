import { motion } from "framer-motion";
import { ExternalLink, FileText } from "lucide-react";

interface PublicationProps {
  title: string;
  venue: string;
  year: string;
  isBestPaper?: boolean;
  link?: string;
  index: number;
}

export function PublicationItem({ title, venue, year, isBestPaper, link, index }: PublicationProps) {
  return (
    <motion.a
      href={link || "#"}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="block group p-4 -mx-4 rounded-lg hover:bg-white/5 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h4 className="text-base font-medium text-foreground group-hover:text-primary transition-colors pr-8">
            {title}
          </h4>
          <div className="flex flex-wrap items-center gap-3 text-sm font-mono">
            <span className="text-muted-foreground">{venue}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-muted-foreground">{year}</span>
            
            {isBestPaper && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-sans font-bold uppercase tracking-wider">
                Best Paper Award
              </span>
            )}
          </div>
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </motion.a>
  );
}
