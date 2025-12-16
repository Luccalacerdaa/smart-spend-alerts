import { 
  Wallet, 
  PieChart, 
  Bell, 
  MessageCircle,
  Target,
  Shield
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Cadastro Simples",
    description: "Adicione despesas e receitas em segundos, sem complicação.",
  },
  {
    icon: Target,
    title: "Orçamentos Personalizados",
    description: "Defina limites para cada categoria e mantenha o controle.",
  },
  {
    icon: PieChart,
    title: "Gráficos Intuitivos",
    description: "Visualize seus gastos de forma clara e objetiva.",
  },
  {
    icon: MessageCircle,
    title: "Alertas no WhatsApp",
    description: "Receba notificações antes de estourar o orçamento.",
  },
  {
    icon: Bell,
    title: "Lembretes de Contas",
    description: "Nunca mais esqueça uma conta importante.",
  },
  {
    icon: Shield,
    title: "Dados Seguros",
    description: "Suas informações protegidas com criptografia.",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Como o App <span className="text-gradient">Resolve</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Com nosso app, você cadastra suas despesas e receitas facilmente, 
            define orçamentos e acompanha tudo por gráficos simples. E o melhor: 
            se você estiver perto de exceder seus limites, você recebe uma 
            notificação diretamente no seu WhatsApp.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border hover:shadow-card transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
