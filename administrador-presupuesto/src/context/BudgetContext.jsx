import { createContext, useReducer, useEffect } from "react";
import axiosClient from "../axiosClient";

const BudgetContext = createContext();

const initialState = {
  user: null,
  categories: [],
  transactions: [],
  stats: null,
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER": return { ...state, user: action.payload };
    case "SET_CATEGORIES": return { ...state, categories: action.payload };
    case "SET_TRANSACTIONS": return { ...state, transactions: action.payload };
    case "SET_STATS": return { ...state, stats: action.payload };
    case "SET_LOADING": return { ...state, loading: action.payload };
    case "SET_ERROR": return { ...state, error: action.payload };
    case "LOGOUT":
      localStorage.removeItem("access_token");
      return { ...initialState };
    default: return state;
  }
}

export function BudgetProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getUser = async () => {
    try {
      const res = await axiosClient.get("/get_user/");
      dispatch({ type: "SET_USER", payload: res.data });
    } catch {
      dispatch({ type: "LOGOUT" });
    }
  };

  const fetchCategories = async () => {
    const res = await axiosClient.get("/categories/");
    dispatch({ type: "SET_CATEGORIES", payload: res.data });
  };

  const fetchTransactions = async () => {
    const res = await axiosClient.get("/transactions/");
    dispatch({ type: "SET_TRANSACTIONS", payload: res.data });
  };

  const createTransaction = async (data) => {
    await axiosClient.post("/transactions/", data);
    fetchTransactions();
    fetchStats();
  };

  const archiveTransaction = async (id) => {
    await axiosClient.post(`/transactions/${id}/archivar/`);
    fetchTransactions();
    fetchStats();
  };

  const fetchStats = async () => {
    const res = await axiosClient.get("/transactions/estadisticas");
    dispatch({ type: "SET_STATS", payload: res.data });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) getUser();
  }, []);

  return (
    <BudgetContext.Provider
      value={{
        ...state,
        logout,
        getUser,
        fetchCategories,
        fetchTransactions,
        createTransaction,
        archiveTransaction,
        fetchStats
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export default BudgetContext;
