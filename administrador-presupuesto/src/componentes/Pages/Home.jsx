import { useEffect, useState } from 'react';
import { useMovimientos } from '../../hooks/useMovimientos';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Button } from "primereact/button";
import FormularioMovimiento from "../FormularioMovimiento";
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const COLORS = ['#00C49F', '#FF8042', '#FFBB28', '#8884d8'];

const Home = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const { movimientos, fetchMovimientos, loading } = useMovimientos();

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const ingresos = movimientos
    .filter((m) => m.type === 'INCOME')
    .reduce((acc, m) => acc + Number(m.amount), 0);

  const gastos = movimientos
    .filter((m) => m.type === 'EXPENSE')
    .reduce((acc, m) => acc + Number(m.amount), 0);

  const balance = ingresos - gastos;

  const dataPie = movimientos
    .filter((m) => m.type === 'EXPENSE' && m.category)
    .reduce((acc, m) => {
      const categoria = m.category.name;
      const existente = acc.find((item) => item.name === categoria);
      const monto = Number(m.amount);
      if (existente) {
        existente.value += monto;
      } else {
        acc.push({ name: categoria, value: monto });
      }
      return acc;
  }, []);

  const resumenMensual = movimientos.reduce((acc, mov) => {
    if (!mov.date || !mov.amount || !mov.type) return acc;

    const fecha = parseISO(mov.date);
    const mes = format(fecha, 'MMM', { locale: es }); // 'ene', 'feb', etc.

    let mesExistente = acc.find((item) => item.mes === mes);
    if (!mesExistente) {
      mesExistente = { mes, ingresos: 0, gastos: 0 };
      acc.push(mesExistente);
    }

    if (mov.type === 'INCOME') {
      mesExistente.ingresos += Number(mov.amount);
    } else if (mov.type === 'EXPENSE') {
      mesExistente.gastos += Number(mov.amount);
    }

    return acc;
  }, []);

  // Ordenamos los meses por fecha (opcional)
  const mesesOrden = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const dataBar = resumenMensual.sort((a, b) => mesesOrden.indexOf(a.mes) - mesesOrden.indexOf(b.mes));

  const ultimosMovimientos = [...movimientos]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Resumen del mes</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-100 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-green-800">Ingresos</h2>
          <p className="text-2xl font-bold text-green-900">${ingresos.toLocaleString()}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-red-800">Gastos</h2>
          <p className="text-2xl font-bold text-red-900">${gastos.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-xl shadow ${balance >= 0 ? 'bg-blue-100' : 'bg-yellow-100'}`}>
          <h2 className="text-lg font-semibold text-blue-800">Balance</h2>
          <p className="text-2xl font-bold text-blue-900">${balance.toLocaleString()}</p>
        </div>
      </div>

      {/* Gráficos (temporales) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Gastos por categoría</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataPie}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {dataPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Evolución mensual</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dataBar}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ingresos" fill="#00C49F" />
              <Bar dataKey="gastos" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Tus movimientos</h2>
          <Button
            label="Agregar"
            icon="pi pi-plus"
            onClick={() => setModalVisible(true)}
            className="p-button-success"
          />
        </div>

        <div className="bg-white rounded-xl shadow p-4 col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Últimos movimientos</h2>
            <ul className="divide-y divide-gray-200">
              {ultimosMovimientos.map((mov) => (
                <li key={mov.id} className="py-2 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-800">{mov.description}</p>
                    <p className="text-xs text-gray-500">{mov.date}</p>
                  </div>
                  <div className={`font-semibold ${mov.tipo === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                    {mov.tipo === 'INCOME' ? '+' : '-'}${mov.amount.toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
        </div>

        <FormularioMovimiento
          visible={modalVisible}
          onHide={() => setModalVisible(false)}
          onSubmit={fetchMovimientos}
        />
      </div>
    </div>
  );
};

export default Home;

