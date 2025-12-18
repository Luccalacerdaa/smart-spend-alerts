import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  { name: "Maria S.", text: "Finalmente entendo meus gastos!", saved: "Mais organizada", avatar: "M" },
  { name: "Carlos R.", text: "Os alertas no WhatsApp são incríveis!", saved: "Nunca esqueço contas", avatar: "C" },
  { name: "Ana L.", text: "Interface linda e super fácil.", saved: "Controle total", avatar: "A" },
];

const Testimonials = () => {
  return (
    <section id="depoimentos" className="py-24 relative overflow-hidden">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">
            Resultados <span className="text-gradient">reais</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto perspective-1000">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              className="group relative p-8 rounded-3xl bg-card border border-border"
              initial={{ opacity: 0, y: 60, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: -15,
                rotateX: 8,
                rotateY: index === 0 ? 8 : index === 2 ? -8 : 0,
                scale: 1.02,
                boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.15)",
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <Star className="w-5 h-5 fill-primary text-primary" />
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <p className="text-xl md:text-2xl font-semibold mb-6">"{t.text}"</p>

              {/* Benefit */}
              <motion.div
                className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-lg mb-6"
                whileHover={{ scale: 1.05 }}
                style={{ transform: "translateZ(30px)" }}
              >
                {t.saved}
              </motion.div>

              {/* Avatar */}
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  style={{ transform: "translateZ(20px)" }}
                >
                  {t.avatar}
                </motion.div>
                <span className="font-semibold">{t.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
