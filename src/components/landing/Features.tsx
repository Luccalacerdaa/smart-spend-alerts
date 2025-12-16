import { Wallet, PieChart, Bell, Target } from "lucide-react";
import moneyFloating from "@/assets/money-floating.png";

const features = [
  {
    icon: Wallet,
    title: "Cadastro Rápido",
    color: "bg-primary/20 text-primary",
  },
  {
    icon: Target,
    title: "Orçamentos",
    color: "bg-accent text-accent-foreground",
  },
  {
    icon: PieChart,
    title: "Gráficos Claros",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    icon: Bell,
    title: "Alertas Smart",
    color: "bg-[hsl(142_70%_45%)]/20 text-[hsl(142_70%_40%)]",
  },
];

const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual side */}
          <div className="relative order-2 lg:order-1 animate-slide-left">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full transform scale-75" />
              
              <img
                src={moneyFloating}
                alt="Crescimento financeiro"
                className="relative w-full max-w-md mx-auto rounded-3xl animate-float"
              />
            </div>
          </div>

          {/* Content side */}
          <div className="order-1 lg:order-2 space-y-10">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight animate-fade-up">
                Tudo que você
                <br />
                <span className="text-gradient">precisa</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-2xl bg-card border border-border hover-lift animate-fade-up"
                  style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                >
                  <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
