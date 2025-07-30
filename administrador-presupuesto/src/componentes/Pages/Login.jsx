
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: form.email,  // 👈 SimpleJWT espera "username"
                password: form.password,
            }),
            });

            if (response.ok) {
            const data = await response.json();
            console.log("Login OK", data);
            
            // Guardar token en localStorage (u otra solución segura)
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            navigate("/"); // Redirigí al home o dashboard
            } else {
            const data = await response.json();
            setError(data.detail || "Credenciales inválidas");
            }
        } catch (err) {
            setError("Error de red");
        }
    };


  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50 px-4">
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

