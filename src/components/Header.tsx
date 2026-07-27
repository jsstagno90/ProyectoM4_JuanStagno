import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { auth } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";

import "./Header.css";

function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut(auth);
    navigate("/login");
  }

  return (
    <header className="header">
      <Link to="/" className="logo">
        📋 <span>Gestor Estratégico de Tareas</span>
      </Link>

      <nav className="nav">
        <Link to="/">Inicio</Link>

        {user ? (
          <>
            <Link to="/tasks">Mis tareas</Link>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;