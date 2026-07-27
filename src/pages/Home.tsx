import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";

function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut(auth);
    navigate("/login");
  }

  return (
    <section className="home-page">
      <div className="home-panel">
        <div className="home-hero">
          <span className="home-tag">✨ Organizá tu día con foco</span>
          <h1>Bienvenido a Gestor Estratégico de Tareas</h1>
          <p>
            Crea, organiza y completa tus tareas desde un solo lugar.
            Controlá tu tiempo con una interfaz clara y moderna.
          </p>

          {!loading && !user && (
            <div className="home-buttons">
              <Link to="/login" className="home-link">
                <button className="primary-btn">Iniciar sesión</button>
              </Link>

              <Link to="/register" className="home-link">
                <button className="secondary-btn">Crear cuenta</button>
              </Link>
            </div>
          )}

          {!loading && user && (
            <div className="home-welcome">
              <div className="home-welcome-text">
                <p className="home-welcome-greeting">
                  Hola {user.email ?? "usuario"}.
                </p>
              </div>
              <div className="home-welcome-actions">
                <Link to="/tasks" className="home-link">
                  <button className="primary-btn">Ir a mis tareas</button>
                </Link>
              </div>
            </div>
          )}

          {!loading && user && (
            <div className="home-logout-card">
              <p className="home-logout-text">
                No eres {user.email ?? "usuario"}?
              </p>
              <button
                className="secondary-btn logout-btn"
                onClick={handleLogout}
                type="button"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

        <div className="home-highlight">
          <div className="home-highlight-card">
            <div className="home-card-heading">
              <span className="home-card-icon">🎯</span>
              <h2>Todo bajo control</h2>
            </div>
            <p>Prioriza lo importante y trabaja con claridad.</p>
          </div>
          <div className="home-highlight-card">
            <div className="home-card-heading">
              <span className="home-card-icon">✨</span>
              <h2>Diseño simple</h2>
            </div>
            <p>Una experiencia limpia para enfocarte en lo que importa.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;