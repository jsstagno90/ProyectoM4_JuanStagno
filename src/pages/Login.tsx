import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/tasks");
    } catch (err) {
      setError("Email o contraseña inválidos. Volvé a intentar.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card login-card">
        <div className="auth-header">
          <div>
            <span className="auth-subtitle">Bienvenido de nuevo</span>
            <h1>Inicia sesión</h1>
          </div>
          <p className="auth-description">
            Accedé a tu panel de tareas y comenzá a organizar tu día.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              placeholder="ejemplo@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="primary-btn auth-submit" type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿No tenés cuenta? <Link to="/register">Registrate</Link>
          </p>
        </div>
      </div>
    </section>
  );
}



export default Login;