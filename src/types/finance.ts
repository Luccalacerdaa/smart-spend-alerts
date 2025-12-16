export type Category = 'alimentacao' | 'transporte' | 'lazer' | 'contas' | 'outros';

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string;
  note?: string;
  type: 'expense';
  creditCardId?: string; // Se for gasto no cartão
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  date: string;
  note?: string;
  type: 'income';
}

export type Transaction = Expense | Income;

export interface MonthlyGoal {
  amount: number;
  month: string; // YYYY-MM format
}

export interface CreditCard {
  id: string;
  name: string;
  limit: number;
  closingDay: number; // Dia do fechamento
  dueDay: number; // Dia do vencimento
  color: string;
}

export interface FixedPayment {
  id: string;
  name: string;
  amount: number;
  dueDay: number; // Dia do vencimento
  category: Category;
  isPaid: boolean;
  month: string; // YYYY-MM
}

export const CATEGORY_LABELS: Record<Category, string> = {
  alimentacao: 'Alimentação',
  transporte: 'Transporte',
  lazer: 'Lazer',
  contas: 'Contas',
  outros: 'Outros',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  alimentacao: '🍔',
  transporte: '🚗',
  lazer: '🎮',
  contas: '📄',
  outros: '📦',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  alimentacao: 'hsl(25, 95%, 53%)',
  transporte: 'hsl(217, 91%, 60%)',
  lazer: 'hsl(280, 87%, 65%)',
  contas: 'hsl(142, 76%, 36%)',
  outros: 'hsl(0, 0%, 45%)',
};

export const CARD_COLORS = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
];
