import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 LOGIN REAL CON FLASK (ya usando apiFetch)
  const login = async (dni, password) => {
    try {
      // 1) Login → devuelve token
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ dni, password }),
      });

      const tokenValue = data.access_token;

      // 2) Obtener datos del usuario
      const userData = await apiFetch("/auth/me", {
        headers: { Authorization: `Bearer ${tokenValue}` },
      });

      // 3) Guardar sesión
      setUser(userData);
      setToken(tokenValue);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", tokenValue);

      return true;

    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  // 🔓 LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // 🔄 Cargar sesión guardada al abrir la app
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
