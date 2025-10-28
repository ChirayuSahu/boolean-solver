import { create } from 'zustand';

interface ExpressionState {
  expression: string;
  setExpression: (newExpression: string) => void;
}

export const useExpressionStore = create<ExpressionState>((set) => ({
  expression: "", 
  
  setExpression: (newExpression) => {
    set({ expression: newExpression });
  },
}));