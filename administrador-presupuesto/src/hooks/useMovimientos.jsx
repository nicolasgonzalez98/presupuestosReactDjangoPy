import { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../axiosClient';

const MovimientosContext = createContext();

export const MovimientosProvider = ({ children }) => {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovimientos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/transactions');
      setMovimientos(response.data);
    } catch (err) {
      setError('Error al cargar movimientos');
    } finally {
      setLoading(false);
    }
  };

  const addMovimiento = async (nuevo) => {
    try {
      const response = await axiosClient.post('/movimientos/', nuevo);
      setMovimientos((prev) => [response.data, ...prev]);
    } catch (err) {
      console.error('Error al agregar movimiento');
    }
  };

  const deleteMovimiento = async (id) => {
    try {
      await axiosClient.delete(`/movimientos/${id}/`);
      setMovimientos((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Error al eliminar movimiento');
    }
  };

  const updateMovimiento = async (id, datos) => {
    try {
      const response = await axiosClient.put(`/movimientos/${id}/`, datos);
      setMovimientos((prev) =>
        prev.map((m) => (m.id === id ? response.data : m))
      );
    } catch (err) {
      console.error('Error al actualizar movimiento');
    }
  };

  return (
    <MovimientosContext.Provider
      value={{
        movimientos,
        loading,
        error,
        fetchMovimientos,
        addMovimiento,
        deleteMovimiento,
        updateMovimiento,
      }}
    >
      {children}
    </MovimientosContext.Provider>
  );
};

export const useMovimientos = () => useContext(MovimientosContext);
