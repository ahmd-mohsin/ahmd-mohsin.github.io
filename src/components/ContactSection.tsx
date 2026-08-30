import { Section } from "@/components/Section";
import { GlassPanel } from "@/components/GlassPanel";
import { Mail, MapPin } from "lucide-react";

export function ContactSection() {
  return (
    <Section id="contact" title="Get in Touch">
      <GlassPanel className="p-8 md:p-10">
        <div className="max-w-lg">
          <p className="text-sm text-[#8aa090] leading-relaxed mb-10 italic">
            I am always open to discussing new research collaborations and
            opportunities.
          </p>

          <div className="space-y-6">
            <a
              href="mailto:muahmed@stanford.edu"
              className="flex items-center gap-5 group"
              data-testid="link-email"
            >
              <Mail className="w-5 h-5 text-[#b9c8bd] group-hover:text-[#5fae7a] transition-colors shrink-0" strokeWidth={2.5} />
              <span className="font-mono text-sm text-[#b9c8bd] group-hover:text-[#5fae7a] transition-colors">
                muahmed@stanford.edu
              </span>
            </a>
            <div className="flex items-center gap-5">
              <MapPin className="w-5 h-5 text-[#8aa090] shrink-0" strokeWidth={2.5} />
              <span className="font-mono text-sm text-[#8aa090]">Stanford, CA, USA</span>
            </div>
          </div>
        </div>
      </GlassPanel>
    </Section>
  );
}
