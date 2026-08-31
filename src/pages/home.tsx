import { Scene3DBackground } from "@/components/Scene3DBackground";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ResearchInterestsSection } from "@/components/ResearchInterestsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ResearchSection } from "@/components/ResearchSection";
import { ConferenceTravelsSection } from "@/components/ConferenceTravelsSection";
import { NewsSection } from "@/components/NewsSection";
import { ReviewerSection } from "@/components/ReviewerSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent text-foreground overflow-x-hidden selection:bg-white/20">
      <Scene3DBackground />
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <ResearchInterestsSection />
        <ExperienceSection />
        <ResearchSection />
        <ConferenceTravelsSection />
        <NewsSection />
        <ReviewerSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
}
