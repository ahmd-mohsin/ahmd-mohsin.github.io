import { Section } from "@/components/Section";
import { Mail, MapPin } from "lucide-react";

export function ContactSection() {
  return (
    <Section id="contact" title="Get in Touch">
      <div className="max-w-2xl">
        <p className="text-sm text-[#7a9472] leading-relaxed mb-8">
          I am always open to discussing new research collaborations and
          opportunities.
        </p>

        <div className="space-y-5">
          <a
            href="mailto:muahmed@stanford.edu"
            className="flex items-center gap-4 group"
            data-testid="link-email"
          >
            <Mail className="w-4 h-4 text-[#3d5239] group-hover:text-[#5a8c52] transition-colors shrink-0" />
            <span className="font-mono text-sm text-[#5a8c52] group-hover:text-[#7ab870] transition-colors">
              muahmed@stanford.edu
            </span>
          </a>
          <div className="flex items-center gap-4">
            <MapPin className="w-4 h-4 text-[#3d5239] shrink-0" />
            <span className="font-mono text-sm text-[#7a9472]">Stanford, CA, USA</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
