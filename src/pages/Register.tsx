import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/auth";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden. Revisá e intentá de nuevo.");
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
      navigate("/tasks");
    } catch (err) {
      setError("No se pudo registrar. Revisá tus datos y volvé a intentar.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-header">
          <div>
            <span className="auth-subtitle">Creá tu cuenta</span>
            <h1>Registro</h1>
          </div>
          <p className="auth-description">
            Registrate para empezar a administrar tus tareas y mantener todo bajo control.
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

          <label>
            Confirmar contraseña
            <input
              type="password"
              placeholder="Repetí tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="primary-btn auth-submit" type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarme"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tenés cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;