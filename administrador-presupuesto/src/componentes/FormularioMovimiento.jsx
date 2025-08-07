import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import axiosClient from '../axiosClient.js'

export default function FormularioMovimiento({ visible, onHide, onSubmit }) {
  const [form, setForm] = useState({
    amount: null,
    type: "INCOME",
    category: null,
    description: "",
    date: new Date(),
  });

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosClient
      .get(`/categories`)
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Error cargando categorías", err));
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.amount || !form.type || !form.category || !form.date) return;
    console.log({
          ...form,
          category: form.category.id,
          date: formatDate(form.date)
        })
        
    setLoading(true);
    try {
      await axiosClient.post(
        `/transactions/`,
        {
          ...form,
          category: form.category.id,
          date: formatDate(form.date)
        }
      );
      onSubmit(); // refresca movimientos
      onHide();   // cierra modal
    } catch (error) {
      console.error("Error al crear movimiento", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0]; // "2025-08-07"
    };

  return (
    <Dialog header="Nuevo Movimiento" visible={visible} onHide={onHide} style={{ width: "30rem" }}>
      <div className="flex flex-col gap-3 mt-3">
        <InputNumber
          value={form.amount}
          onValueChange={(e) => handleChange("amount", e.value)}
          placeholder="Monto"
          mode="currency"
          currency="ARS"
          locale="es-AR"
          className="w-full"
        />
        <Dropdown
          value={form.type}
          options={[
            { label: "Ingreso", value: "INCOME" },
            { label: "Egreso", value: "EXPENSE" },
          ]}
          onChange={(e) => handleChange("type", e.value)}
          placeholder="Tipo"
          className="w-full"
        />
        <Dropdown
          value={form.category}
          options={categorias}
          optionLabel="name"
          placeholder="Categoría"
          onChange={(e) => handleChange("category", e.value)}
          className="w-full"
        />
        <InputText
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Descripción"
          className="w-full"
        />
        <Calendar
          value={form.date}
          onChange={(e) => handleChange("date", e.value)}
          showIcon
          dateFormat="dd/mm/yy"
          className="w-full"
        />
        <Button label="Guardar" icon="pi pi-check" onClick={handleSubmit} loading={loading} />
      </div>
    </Dialog>
  );
}
