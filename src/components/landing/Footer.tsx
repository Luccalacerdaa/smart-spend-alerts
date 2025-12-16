import { Wallet } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 bg-muted/30 border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">FinanceApp</span>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2024 FinanceApp. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
