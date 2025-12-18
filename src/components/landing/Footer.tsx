import { Wallet } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 bg-muted/30 border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img 
              src="/logo-512.png" 
              alt="FlowFinance" 
              className="w-10 h-10"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              FlowFinance
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2024 FlowFinance. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
