import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { useAuth } from "../context/AuthProvider";

export default function Navbar() {
  const { auth, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-blue-100 shadow-md">
      <h1 className="text-lg font-bold">💰 Presupuesto Personal</h1>

      <div className="flex gap-3 items-center">
        {isAuthenticated ? (
          <>
            <span className="font-medium">Hola, {auth.user?.username || "usuario"}</span>
            <Button
              label="Cerrar sesión"
              icon="pi pi-sign-out"
              className="p-button-sm p-button-danger"
              onClick={handleLogout}
            />
          </>
        ) : (
          <>
            <Link to="/login">
              <Button label="Iniciar sesión" icon="pi pi-sign-in" className="p-button-sm" />
            </Link>
            <Link to="/register">
              <Button label="Registrarse" icon="pi pi-user-plus" className="p-button-sm p-button-secondary" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

