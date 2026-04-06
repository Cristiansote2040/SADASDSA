import { useState, useContext, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import ErrorPage from "../Components/ErrorPage";
import Loading from "../Components/Loading";
import ContactOverlay from "../Components/Contactame"; // <--- Importamos el overlay
import "../styles/Login.css"; 

export default function Login() {
  const { login, message: authMessage, setMessage } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const queryMsg = searchParams.get("msg");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(queryMsg || "");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false); // 🔥 Estado para el cartel

  useEffect(() => {
    if (authMessage?.text) {
      setMsg(authMessage.text);
      setMessage(null);
    }
  }, [authMessage, setMessage]);

  const submit = async (e) => {
    e.preventDefault();
    
    // 🔥 ACÁ ESTÁ EL TRUCO:
    // En lugar de llamar a la API, mostramos el cartel de contacto.
    // Dejamos el resto del código abajo por si lo querés reactivar, 
    // pero el return frena la ejecución real.
    setShowOverlay(true);
    return;

    // eslint-disable-next-line no-unreachable
    setMsg("");
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res?.error) {
        setMsg(res.error);
      } else {
        setMsg("Login exitoso 🎉");
      }
    } catch (err) {
      setError({
        code: err.response?.status || 500,
        message: err.response?.data?.msg || "Error crítico de servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorPage code={error.code} message={error.message} />;

  // Envolvemos el formulario en una constante
  const loginFormJSX = (
    <form className="login-form" onSubmit={submit}>
      <h2>Iniciar Sesión</h2>
      {msg && (
        <p className={`login-msg ${msg.toLowerCase().includes("error") ? "error" : "success"}`}>
          {msg}
        </p>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Ingresando..." : "Entrar"}
      </button>

      <Link to="/forgot" className="forgot-link">
        ¿Olvidaste tu contraseña?
      </Link>
      <Link to="/register" className="forgot-link">
        ¿No tienes cuenta?
      </Link>
    </form>
  );

  return (
    <div className="login-container">
      {showOverlay ? (
        <ContactOverlay onClose={() => setShowOverlay(false)}>
          {loginFormJSX}
        </ContactOverlay>
      ) : (
        loginFormJSX
      )}
    </div>
  );
}