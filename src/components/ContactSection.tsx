import { Section } from "@/components/Section";
import { Mail, MapPin } from "lucide-react";

export function ContactSection() {
  return (
    <Section id="contact" title="Get in Touch">
      <div className="max-w-2xl">
        <p className="text-lg text-muted-foreground mb-8">
          I am always open to discussing new research collaborations and
          opportunities.
        </p>

        <div className="space-y-4">
          <a
            href="mailto:muahmed@stanford.edu"
            className="flex items-center gap-4 text-muted-foreground hover:text-white transition-colors"
            data-testid="link-email"
          >
            <div className="w-10 h-10 bg-white/5 flex items-center justify-center border border-white/20">
              <Mail className="w-5 h-5" />
            </div>
            <span className="font-mono text-sm">muahmed@stanford.edu</span>
          </a>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="w-10 h-10 bg-white/5 flex items-center justify-center border border-white/20">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="font-mono text-sm">Stanford, CA, USA</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
