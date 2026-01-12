import { CtaSection } from "./cta-section";
import { FeaturesSection } from "./features-section";
import { HeroSection } from "./hero-section";
import { HowItWorksSection } from "./how-it-works-section";
import { TrendingSection } from "./trending-section";
import { WhoIsThisForSection } from "./who-is-this-for-section";

const HomePage = () => {
  return (
    <main className="flex flex-col gap-10">
      <HeroSection />
      <FeaturesSection />
      <TrendingSection />
      <HowItWorksSection />
      <WhoIsThisForSection />
      <CtaSection />
    </main>
  );
};

export const Component = HomePage;
