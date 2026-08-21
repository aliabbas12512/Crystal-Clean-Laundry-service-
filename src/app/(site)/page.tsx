import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { PackagesSection } from '@/components/PackagesSection';
import { Reviews } from '@/components/Reviews';
import { FAQ } from '@/components/FAQ';
import { ContactSection } from '@/components/ContactSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <PackagesSection />
      <WhyChooseUs />
      <Reviews />
      <FAQ />
      <ContactSection />
    </>
  );
}
