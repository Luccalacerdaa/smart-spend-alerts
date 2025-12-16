import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, PieChart, Target, ArrowRight, Sparkles } from 'lucide-react';

export default function FinanceHome() {
  const navigate = useNavigate();

  const features = [
    { icon: Wallet, title: 'Controle Simples', desc: 'Adicione gastos em segundos' },
    { icon: Target, title: 'Metas Visuais', desc: 'Veja seu progresso claramente' },
    { icon: PieChart, title: 'Por Categoria', desc: 'Entenda onde vai seu dinheiro' },
    { icon: TrendingUp, title: 'Histórico', desc: 'Acompanhe todas as transações' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Hero */}
      <div className="px-6 pt-16 pb-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-primary rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-primary/30"
        >
          <Wallet className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold mt-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
        >
          Finanças
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mt-3 text-lg"
        >
          Controle seus gastos de forma simples e visual
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Button 
            onClick={() => navigate('/app/dashboard')}
            size="lg"
            className="h-14 px-8 text-lg rounded-2xl shadow-lg shadow-primary/30"
          >
            Começar agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>

      {/* Features */}
      <div className="px-6 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Recursos</span>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-card rounded-2xl p-4 shadow-lg border"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
    </div>
  );
}
