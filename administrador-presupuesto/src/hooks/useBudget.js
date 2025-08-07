import { useContext } from "react";
import BudgetContext from "../context/BudgetContext";

export const useBudget = () => useContext(BudgetContext);