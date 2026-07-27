import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import { ProtectedRoute } from "./routes/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";

function App() {
  return (
    <Routes>
      {/* Todas las páginas comparten el Header */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;