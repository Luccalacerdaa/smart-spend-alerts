import { AlertCircle, TrendingDown, HelpCircle } from "lucide-react";

const pains = [
  {
    icon: AlertCircle,
    title: "Perdido com os gastos?",
    description: "Chega o fim do mês e você não sabe para onde foi o dinheiro.",
  },
  {
    icon: TrendingDown,
    title: "Sempre no vermelho?",
    description: "As contas não fecham e sobra mês no final do salário.",
  },
  {
    icon: HelpCircle,
    title: "Sem visão clara?",
    description: "Difícil entender onde você pode economizar.",
  },
];

const PainPoints = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Você se identifica com isso?
          </h2>
          <p className="text-lg text-muted-foreground">
            Você já se sentiu perdido(a) com seus gastos mensais? Tem dificuldade 
            para entender para onde o dinheiro está indo? Nosso app foi criado 
            justamente para resolver isso de um jeito descomplicado.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {pains.map((pain, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-gradient-card border border-border hover:shadow-card transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                <pain.icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{pain.title}</h3>
              <p className="text-muted-foreground">{pain.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
