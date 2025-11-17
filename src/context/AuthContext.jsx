import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

// --------------------------------------------------
// Estado inicial
// --------------------------------------------------
const initialState = {
  user: JSON.parse(localStorage.getItem("trailerflix_user")) || null,
};

// --------------------------------------------------
// Reducer
// --------------------------------------------------
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
}

// --------------------------------------------------
// Provider
// --------------------------------------------------
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Persistir en localStorage
  useEffect(() => {
    if (state.user) {
      localStorage.setItem("trailerflix_user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("trailerflix_user");
    }
  }, [state.user]);

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------
  const login = async (username, password) => {
    try {
      const res = await fetch("/data/usuarios.json");
      if (!res.ok) {
        console.error("Login: error al cargar usuarios", res.status);
        return { ok: false, error: "Error al cargar usuarios" };
      }
      const data = await res.json();
      const users = Array.isArray(data) ? data : data.user || data.users || [];
      const user = users.find(
        (u) => u.username === username && u.password === password
      );
      if (user) {
        dispatch({ type: "LOGIN", payload: user });
        return { ok: true, user };
      } else {
        return { ok: false, error: "Usuario o contraseña inválidos" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { ok: false, error: "Error de red" };
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  // --------------------------------------------------
  // Exponer contexto
  // --------------------------------------------------
  return (
    <AuthContext.Provider value={{ user: state.user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

