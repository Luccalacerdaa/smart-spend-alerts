import { TrendingDown, AlertCircle, Eye } from "lucide-react";

const pains = [
  {
    icon: TrendingDown,
    emoji: "😰",
    title: "Sem Controle",
  },
  {
    icon: AlertCircle,
    emoji: "😤",
    title: "Sempre no Vermelho",
  },
  {
    icon: Eye,
    emoji: "🤷",
    title: "Sem Visibilidade",
  },
];

const PainPoints = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold animate-fade-up">
            Cansado disso?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {pains.map((pain, index) => (
            <div
              key={index}
              className={`
                group text-center p-8 rounded-3xl bg-card border border-border
                hover-lift cursor-default
                animate-fade-up delay-${(index + 1) * 100}
              `}
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className="text-6xl md:text-7xl mb-4 group-hover:scale-110 transition-transform duration-500">
                {pain.emoji}
              </div>
              <h3 className="text-xl md:text-2xl font-bold">{pain.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
