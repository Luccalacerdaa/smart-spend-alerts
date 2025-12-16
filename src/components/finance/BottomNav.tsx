import { NavLink, useLocation } from 'react-router-dom';
import { Home, PieChart, Clock, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/app/dashboard', icon: Home, label: 'Início' },
  { path: '/app/categorias', icon: PieChart, label: 'Categorias' },
  { path: '/app/historico', icon: Clock, label: 'Histórico' },
  { path: '/app/meta', icon: Target, label: 'Meta' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center w-full h-full relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 w-12 h-1 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <item.icon 
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`} 
              />
              <span className={`text-xs mt-1 transition-colors ${
                isActive ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
