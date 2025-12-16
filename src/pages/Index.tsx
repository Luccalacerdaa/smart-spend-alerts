import Hero from "@/components/landing/Hero";
import PainPoints from "@/components/landing/PainPoints";
import Features from "@/components/landing/Features";
import WhatsAppSection from "@/components/landing/WhatsAppSection";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Hero />
      <PainPoints />
      <Features />
      <WhatsAppSection />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
