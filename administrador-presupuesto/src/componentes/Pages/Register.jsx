import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import axiosAuth from "../../axiosAuth";

const Register = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "El nombre es obligatorio";
    if (!form.email) newErrors.email = "El email es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email inválido";
    if (!form.password) newErrors.password = "La contraseña es obligatoria";
    if (form.password !== form.passwordConfirm) newErrors.passwordConfirm = "Las contraseñas no coinciden";
    return newErrors;
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      const validationErrors = validate();

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setErrors({});

      try {
        await axiosAuth.post("/register", {
          username: form.name, 
          email: form.email,
          password: form.password,
        });

        navigate("/login?exito=1");
      } catch (error) {
        if (error.response?.data) {
          const data = error.response.data;
          // Podés mapear los errores si vienen como { email: ["..."], password: ["..."] }
          const formattedErrors = {};
          for (let key in data) {
            formattedErrors[key] = Array.isArray(data[key]) ? data[key][0] : data[key];
          }
          setErrors(formattedErrors);
        } else {
          console.error("Error:", error.message);
        }
      }
    };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 px-4">
      <Card
        className="w-full max-w-md shadow-2xl border border-blue-100"
        title={<h2 className="text-2xl font-bold text-center text-blue-700">Crear cuenta</h2>}
      >
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-semibold text-gray-700">
              Nombre
            </label>
            <InputText id="name" name="name" value={form.name} onChange={handleChange} className="w-full" />
            {errors.name && <small className="text-red-500">{errors.name}</small>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-gray-700">
              Email
            </label>
            <InputText id="email" name="email" value={form.email} onChange={handleChange} className="w-full" />
            {errors.email && <small className="text-red-500">{errors.email}</small>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold text-gray-700">
              Contraseña
            </label>
            <Password
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full"
              inputClassName="w-full"
              toggleMask
              feedback={false}
            />
            {errors.password && <small className="text-red-500">{errors.password}</small>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="passwordConfirm" className="text-sm font-semibold text-gray-700">
              Confirmar contraseña
            </label>
            <Password
              id="passwordConfirm"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              className="w-full"
              inputClassName="w-full"
              toggleMask
              feedback={false}
            />
            {errors.passwordConfirm && <small className="text-red-500">{errors.passwordConfirm}</small>}
          </div>

          <Button label="Registrarse" className="w-full bg-blue-600 hover:bg-blue-700 text-white" />
        </form>
      </Card>
    </div>
  );
};

export default Register;

