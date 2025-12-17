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
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import AppHeader from "./components/AppHeader";
import BottomNav from "./components/finance/BottomNav";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const showBottomNav = ['/app/dashboard', '/app/categorias', '/app/historico', '/app/meta', '/app/cartoes', '/app/fixos', '/app/perfil'].includes(location.pathname);
  const showHeader = location.pathname.startsWith('/app/') && location.pathname !== '/app';

  return (
    <>
      {showHeader && <AppHeader />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/app" element={
          <ProtectedRoute>
            <FinanceHome />
          </ProtectedRoute>
        } />
        <Route path="/app/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/app/gasto" element={
          <ProtectedRoute>
            <AddExpense />
          </ProtectedRoute>
        } />
        <Route path="/app/receita" element={
          <ProtectedRoute>
            <AddIncome />
          </ProtectedRoute>
        } />
        <Route path="/app/meta" element={
          <ProtectedRoute>
            <MonthlyGoal />
          </ProtectedRoute>
        } />
        <Route path="/app/categorias" element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        } />
        <Route path="/app/historico" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } />
        <Route path="/app/cartoes" element={
          <ProtectedRoute>
            <CreditCards />
          </ProtectedRoute>
        } />
        <Route path="/app/cartoes/:cardId/gasto" element={
          <ProtectedRoute>
            <AddCardExpense />
          </ProtectedRoute>
        } />
        <Route path="/app/fixos" element={
          <ProtectedRoute>
            <FixedPayments />
          </ProtectedRoute>
        } />
        <Route path="/app/perfil" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
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
