import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from 'react';
import { Toast } from "primereact/toast";
import axiosAuth from "../../axiosAuth";
import { useAuth } from "../../context/AuthProvider";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef(null);
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosAuth.post("/token/", {
        username: form.email,
        password: form.password,
      });

      const data = response.data;
      const access = data.access;
      const refresh = data.refresh;

      const userRes = await axiosAuth.get("/get_user/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const user = userRes.data;

      login({ access, refresh, user })

      navigate("/"); // Redirigir al dashboard o página principal
    } catch (error) {
      if (error.response) {
        setError(error.response.data.detail || "Credenciales inválidas");
      } else {
        setError("Error de red");
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("exito") === "1") {
      toast.current?.show({
        severity: "success",
        summary: "Registro exitoso",
        detail: "Ya podés iniciar sesión",
        life: 3000,
      });

      navigate("/login", { replace: true });
    }
  }, [location.search, navigate]);


  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50 px-4">

      <Toast ref={toast} />
      
      <Card className="w-full max-w-md shadow-2xl p-6">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</label>
            <InputText id="email" name="email" value={form.email} onChange={handleChange} className="w-full p-2" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold text-gray-700">Contraseña</label>
            <Password id="password" name="password" value={form.password} onChange={handleChange} className="w-full" inputClassName="w-full" toggleMask feedback={false} />
          </div>

          {error && <small className="text-red-500">{error}</small>}

          <Button label="Ingresar" className="w-full p-button-lg" />
        </form>
      </Card>
    </div>
  );
};

export default Login;

