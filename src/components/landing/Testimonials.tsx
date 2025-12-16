import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Maria S.",
    text: "Finalmente entendo meus gastos!",
    saved: "R$800/mês",
    avatar: "M",
  },
  {
    name: "Carlos R.",
    text: "Os alertas no WhatsApp são incríveis!",
    saved: "R$1.200/mês",
    avatar: "C",
  },
  {
    name: "Ana L.",
    text: "Interface linda e super fácil.",
    saved: "R$650/mês",
    avatar: "A",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold animate-fade-up">
            Resultados <span className="text-gradient">reais</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-card border border-border hover-lift animate-fade-up"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xl md:text-2xl font-semibold mb-6">"{t.text}"</p>

              {/* Saved amount */}
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-lg mb-6">
                {t.saved} economizados
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                  {t.avatar}
                </div>
                <span className="font-semibold">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
