import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const pains = [
  { emoji: "😰", title: "Sem Controle" },
  { emoji: "😤", title: "Sempre no Vermelho" },
  { emoji: "🤷", title: "Sem Visibilidade" },
];

const PainPoints = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />

      <div className="container relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">
            Cansado disso?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto perspective-1000">
          {pains.map((pain, index) => (
            <motion.div
              key={index}
              className="group text-center p-8 rounded-3xl bg-card border border-border cursor-default"
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
                rotateX: 10,
                rotateY: index === 0 ? 5 : index === 2 ? -5 : 0,
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                className="text-6xl md:text-7xl mb-4"
                whileHover={{ scale: 1.2, rotateZ: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {pain.emoji}
              </motion.div>
              <h3 className="text-xl md:text-2xl font-bold">{pain.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
