import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-10">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-accent/30 rounded-full blur-3xl animate-blob delay-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-spin-slow" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text side - minimal */}
          <div className="text-center lg:text-left space-y-8">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                Alertas WhatsApp
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] animate-fade-up delay-100">
              Finanças
              <br />
              <span className="text-gradient">Sob Controle</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-md mx-auto lg:mx-0 animate-fade-up delay-200">
              Simples. Visual. Inteligente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up delay-300">
              <Button variant="hero" size="xl" className="group">
                Começar Grátis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Stats - visual impact */}
            <div className="flex gap-8 justify-center lg:justify-start animate-fade-up delay-400">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-extrabold text-gradient">50k+</div>
                <div className="text-sm text-muted-foreground mt-1">Usuários</div>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-extrabold text-gradient">R$2M+</div>
                <div className="text-sm text-muted-foreground mt-1">Economizados</div>
              </div>
            </div>
          </div>

          {/* Image side - hero visual */}
          <div className="relative animate-slide-right delay-200">
            <div className="relative">
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-3xl transform scale-90" />
              
              {/* Main dashboard image */}
              <img
                src={heroDashboard}
                alt="Dashboard financeiro"
                className="relative w-full rounded-2xl shadow-card animate-float"
              />

              {/* Floating notification badge */}
              <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-card rounded-2xl p-4 shadow-card animate-bounce-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[hsl(142_70%_45%)] flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Alerta</div>
                    <div className="font-bold text-sm">Orçamento 80%</div>
                  </div>
                </div>
              </div>

              {/* Floating stat card */}
              <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-card rounded-2xl p-4 shadow-card animate-float-slow">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Este mês</div>
                    <div className="font-bold text-primary">+R$847</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
