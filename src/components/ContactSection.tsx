import { Section } from "@/components/Section";
import { Mail, MapPin } from "lucide-react";

export function ContactSection() {
  return (
    <Section id="contact" title="Get in Touch">
      <div className="max-w-lg">
        <p className="text-sm text-[#6a8a72] leading-relaxed mb-10 italic">
          I am always open to discussing new research collaborations and
          opportunities.
        </p>

        <div className="space-y-6">
          <a
            href="mailto:muahmed@stanford.edu"
            className="flex items-center gap-5 group"
            data-testid="link-email"
          >
            <Mail className="w-5 h-5 text-[#5d7a65] group-hover:text-[#2d5035] transition-colors shrink-0" strokeWidth={2.5} />
            <span className="font-mono text-sm text-[#6a8a72] group-hover:text-[#2d5035] transition-colors">
              muahmed@stanford.edu
            </span>
          </a>
          <div className="flex items-center gap-5">
            <MapPin className="w-5 h-5 text-[#5d7a65] shrink-0" strokeWidth={2.5} />
            <span className="font-mono text-sm text-[#90aa98]">Stanford, CA, USA</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
