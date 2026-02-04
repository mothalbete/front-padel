import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // ⭐ NUEVO

  // 🔐 LOGIN REAL CON FLASK
  const login = async (dni, password) => {
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      const tokenValue = data.access_token;

      const meRes = await fetch("http://localhost:5000/auth/me", {
        headers: {
          "Authorization": `Bearer ${tokenValue}`
        }
      });

      const userData = await meRes.json();

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

    setLoading(false); // ⭐ IMPORTANTE
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
