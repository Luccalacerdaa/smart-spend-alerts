import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container">
        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Background with gradient border */}
          <div className="relative rounded-[2.5rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-20" />

            <motion.div
              className="relative bg-card m-[2px] rounded-[calc(2.5rem-2px)] p-12 md:p-16 text-center"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Animated blobs */}
              <motion.div
                className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  x: [0, 20, 0],
                }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  x: [0, -20, 0],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />

              <div className="relative z-10 space-y-8">
                <motion.div
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-semibold"
                  whileHover={{ scale: 1.05 }}
                >
                  <Sparkles className="w-4 h-4" />
                  100% Grátis para começar
                </motion.div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                  Pronto para ter
                  <br />
                  <span className="text-gradient">controle total?</span>
                </h2>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="hero" size="xl" className="group">
                    Criar Conta Grátis
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>

                <p className="text-muted-foreground">
                  Sem cartão de crédito • Cancele quando quiser
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
