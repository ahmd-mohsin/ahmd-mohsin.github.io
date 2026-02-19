import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ResearchInterestsSection } from "@/components/ResearchInterestsSection";
import { ResearchSection } from "@/components/ResearchSection";
import { NewsSection } from "@/components/NewsSection";
import { ReviewerSection } from "@/components/ReviewerSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-white/20">
      <Navigation />
      <HeroSection />
      <ResearchInterestsSection />
      <ResearchSection />
      <NewsSection />
      <ReviewerSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
