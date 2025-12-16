import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "Cadastro gratuito",
  "Alertas no WhatsApp",
  "Sem taxa de adesão",
  "Cancele quando quiser",
];

const CTA = () => {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-card border border-border p-8 md:p-12 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(142_70%_45%)]/10 text-[hsl(142_70%_40%)] text-sm font-medium mb-6">
                <MessageCircle className="w-4 h-4" />
                Integração com WhatsApp
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para simplificar suas finanças?
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Experimente agora e receba alertas no seu WhatsApp. 
                Comece hoje mesmo a ter controle total do seu dinheiro!
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="w-4 h-4 text-primary" />
                    {benefit}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl">
                  Criar Conta Grátis
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="whatsapp" size="xl">
                  <MessageCircle className="w-5 h-5" />
                  Falar no WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
