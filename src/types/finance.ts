export type Category = 'alimentacao' | 'transporte' | 'lazer' | 'contas' | 'outros';

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string;
  note?: string;
  type: 'expense';
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
