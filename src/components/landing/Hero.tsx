import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero flex items-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
              <MessageCircle className="w-4 h-4" />
              Notificações via WhatsApp
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-up-delay-1">
            Controle suas Finanças de Forma{" "}
            <span className="text-gradient">Simples e Inteligente</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-fade-up-delay-2 max-w-2xl mx-auto">
            Uma ferramenta prática para transformar a sua gestão financeira pessoal. 
            Acompanhe seus gastos e receba alertas no WhatsApp antes de estourar o orçamento.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up-delay-3">
            <Button variant="hero" size="xl">
              Começar Agora
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl">
              Saiba Mais
            </Button>
          </div>
        </div>

        {/* App Preview Mockup */}
        <div className="mt-16 animate-fade-up-delay-3">
          <div className="relative mx-auto max-w-4xl">
            <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 border border-border">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 bg-muted rounded-xl p-4">
                  <div className="h-4 w-24 bg-primary/20 rounded mb-3" />
                  <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg" />
                </div>
                <div className="space-y-4">
                  <div className="bg-secondary rounded-xl p-4">
                    <div className="h-3 w-16 bg-primary/30 rounded mb-2" />
                    <div className="h-6 w-20 bg-primary/20 rounded" />
                  </div>
                  <div className="bg-accent rounded-xl p-4">
                    <div className="h-3 w-16 bg-primary/30 rounded mb-2" />
                    <div className="h-6 w-20 bg-primary/20 rounded" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/10 blur-2xl rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
