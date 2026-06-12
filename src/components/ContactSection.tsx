import { Section } from "@/components/Section";
import { Mail, MapPin } from "lucide-react";

export function ContactSection() {
  return (
    <Section id="contact" title="Get in Touch">
      <div className="max-w-lg">
        <p className="text-sm text-white/30 leading-relaxed mb-10">
          I am always open to discussing new research collaborations and
          opportunities.
        </p>

        <div className="space-y-6">
          <a
            href="mailto:muahmed@stanford.edu"
            className="flex items-center gap-5 group"
            data-testid="link-email"
          >
            <Mail className="w-4 h-4 text-white/15 group-hover:text-white/40 transition-colors shrink-0" />
            <span className="font-mono text-sm text-white/35 group-hover:text-white/70 transition-colors">
              muahmed@stanford.edu
            </span>
          </a>
          <div className="flex items-center gap-5">
            <MapPin className="w-4 h-4 text-white/15 shrink-0" />
            <span className="font-mono text-sm text-white/25">Stanford, CA, USA</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
