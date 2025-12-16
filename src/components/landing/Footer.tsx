import { Wallet } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FinanceApp</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Recursos
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Preços
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Sobre
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Suporte
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Privacidade
            </a>
          </nav>

          <p className="text-sm text-muted-foreground">
            © 2024 FinanceApp. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
