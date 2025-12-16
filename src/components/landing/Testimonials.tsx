import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Maria Silva",
    role: "Empreendedora",
    content:
      "Antes eu vivia estourando meu orçamento. Agora, com as notificações e a simplicidade do app, finalmente sei exatamente onde estou gastando.",
    rating: 5,
  },
  {
    name: "Carlos Santos",
    role: "Desenvolvedor",
    content:
      "O alerta no WhatsApp é genial! Recebi o aviso antes de gastar demais e consegui me controlar. Super recomendo!",
    rating: 5,
  },
  {
    name: "Ana Oliveira",
    role: "Designer",
    content:
      "Finalmente um app de finanças que não complica. Interface linda e fácil de usar. Em 2 meses já economizei R$800!",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O que nossos <span className="text-gradient">usuários</span> dizem
          </h2>
          <p className="text-lg text-muted-foreground">
            Milhares de pessoas já transformaram suas finanças com nosso app.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative p-6 rounded-2xl bg-card border border-border hover:shadow-card transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-primary text-primary"
                  />
                ))}
              </div>

              <p className="text-foreground mb-6 relative z-10">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
