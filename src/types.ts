export interface SideHustleIdea {
  id: string;
  title: string;
  description: string;
  estimatedMonthly: number;
  timeRequiredHours: number;
  capitalRequired: number;
  skills: string[];
  risk: "low" | "medium" | "high";
  score: number;
}

export interface ExpenseCategory {
  name: string;
  monthly: number;
  optimizable: boolean;
  recommendation?: string;
}

export interface CashflowProfile {
  skills: string[];
  location: string;
  availableHours: number;
  capital: number;
  currentExpenses: ExpenseCategory[];
}
