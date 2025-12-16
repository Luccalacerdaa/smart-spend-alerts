import { Wallet, PieChart, Bell, Target } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import moneyFloating from "@/assets/money-floating.png";

const features = [
  { icon: Wallet, title: "Cadastro Rápido", color: "bg-primary/20 text-primary" },
  { icon: Target, title: "Orçamentos", color: "bg-accent text-accent-foreground" },
  { icon: PieChart, title: "Gráficos Claros", color: "bg-secondary text-secondary-foreground" },
  { icon: Bell, title: "Alertas Smart", color: "bg-[hsl(142_70%_45%)]/20 text-[hsl(142_70%_40%)]" },
];

const Features = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const imageX = useTransform(scrollYProgress, [0, 1], [-100, 0]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-20, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  return (
    <section ref={ref} id="recursos" className="py-24 relative overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual side with 3D scroll */}
          <motion.div
            className="relative order-2 lg:order-1"
            style={{
              x: imageX,
              rotateY: imageRotate,
              scale: imageScale,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="relative perspective-1000">
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full transform scale-75" />

              <motion.img
                src={moneyFloating}
                alt="Crescimento financeiro"
                className="relative w-full max-w-md mx-auto rounded-3xl"
                whileHover={{ rotateY: 15, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              />
            </div>
          </motion.div>

          {/* Content side */}
          <div className="order-1 lg:order-2 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Tudo que você
                <br />
                <span className="text-gradient">precisa</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 perspective-1000">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group p-6 rounded-2xl bg-card border border-border"
                  initial={{ opacity: 0, y: 40, rotateX: -10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{
                    y: -10,
                    rotateX: 5,
                    rotateY: index % 2 === 0 ? 5 : -5,
                    scale: 1.03,
                    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.1)",
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4`}
                    whileHover={{ scale: 1.1, rotateZ: 10 }}
                    style={{ transform: "translateZ(20px)" }}
                  >
                    <feature.icon className="w-7 h-7" />
                  </motion.div>
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
