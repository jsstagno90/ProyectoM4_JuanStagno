import { useState } from "react";
import { register } from "../services/auth";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await register(email, password);
      console.log(user);
      alert("Usuario registrado correctamente");
    } catch (error) {
      console.error(error);
        alert("Error al registrar el usuario");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Registro</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Registrarse</button>
    </form>
  );
}

export default Register;