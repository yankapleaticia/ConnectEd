import { Hero } from '@/client/components/landing/hero';
import { Features } from '@/client/components/landing/features';
import { HowItWorks } from '@/client/components/landing/how-it-works';
import { CtaSection } from '@/client/components/landing/cta-section';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
      <CtaSection />
    </div>
  );
}
