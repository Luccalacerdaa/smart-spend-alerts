import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { FinanceProvider } from "@/contexts/FinanceContext";
import Index from "./pages/Index";
import FinanceHome from "./pages/FinanceHome";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import AddIncome from "./pages/AddIncome";
import MonthlyGoal from "./pages/MonthlyGoal";
import Categories from "./pages/Categories";
import History from "./pages/History";
import CreditCards from "./pages/CreditCards";
import FixedPayments from "./pages/FixedPayments";
import AddCardExpense from "./pages/AddCardExpense";
import BottomNav from "./components/finance/BottomNav";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const showBottomNav = ['/app/dashboard', '/app/categorias', '/app/historico', '/app/meta', '/app/cartoes', '/app/fixos'].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/app" element={<FinanceHome />} />
        <Route path="/app/dashboard" element={<Dashboard />} />
        <Route path="/app/gasto" element={<AddExpense />} />
        <Route path="/app/receita" element={<AddIncome />} />
        <Route path="/app/meta" element={<MonthlyGoal />} />
        <Route path="/app/categorias" element={<Categories />} />
        <Route path="/app/historico" element={<History />} />
        <Route path="/app/cartoes" element={<CreditCards />} />
        <Route path="/app/cartoes/:cardId/gasto" element={<AddCardExpense />} />
        <Route path="/app/fixos" element={<FixedPayments />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FinanceProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </FinanceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
