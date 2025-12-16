import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container">
        <div className="relative max-w-4xl mx-auto">
          {/* Background card with gradient border */}
          <div className="relative rounded-[2.5rem] overflow-hidden">
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-primary opacity-20" />
            
            {/* Content */}
            <div className="relative bg-card m-[2px] rounded-[calc(2.5rem-2px)] p-12 md:p-16 text-center">
              {/* Animated background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-blob" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl animate-blob delay-300" />

              <div className="relative z-10 space-y-8">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-semibold animate-fade-up">
                  <Sparkles className="w-4 h-4" />
                  100% Grátis para começar
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight animate-fade-up delay-100">
                  Pronto para ter
                  <br />
                  <span className="text-gradient">controle total?</span>
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-200">
                  <Button variant="hero" size="xl" className="group">
                    Criar Conta Grátis
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                <p className="text-muted-foreground animate-fade-up delay-300">
                  Sem cartão de crédito • Cancele quando quiser
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
