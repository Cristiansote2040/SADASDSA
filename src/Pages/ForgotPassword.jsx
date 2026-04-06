import { useState } from "react";
import { forgotPassword } from "../services/AuthServices";
import Loading from "../Components/Loading";
import ErrorPage from "../Components/ErrorPage";
import ContactOverlay from "../Components/Contactame"; // <--- Importamos el overlay
import "../styles/ForgotPassword.css"; 

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errorPage, setErrorPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false); // 🔥 Control del cartel

  const submit = async (e) => {
    e.preventDefault();
    
    // 🔥 INTERRUPCIÓN ESTRATÉGICA:
    // Mostramos el cartel y frenamos el envío real del email.
    // Todo el código de abajo queda intacto por si lo necesitás después.
    setShowOverlay(true);
    return;

    // eslint-disable-next-line no-unreachable
    setMsg("");
    setErrorMsg("");
    setErrorPage(null);
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      setMsg(res.msg);
    } catch (err) {
      const status = err.response?.status || 500;
      const message = err.response?.data?.msg || "Error crítico al enviar email";

      if (status >= 500) {
        setErrorPage({ code: status, message });
      } else {
        setErrorMsg(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (errorPage) return <ErrorPage code={errorPage.code} message={errorPage.message} />;

  // Envolvemos el formulario original
  const forgotFormJSX = (
    <form className="forgot-form" onSubmit={submit}>
      <h1>Recuperar contraseña</h1>
      <p>
        Ingresá tu correo electrónico y te enviaremos un enlace seguro para restablecer tu contraseña.
        Seguí las instrucciones del email para crear una nueva contraseña y volver a acceder a tu cuenta.
      </p>

      {msg && <p className="success-msg">{msg}</p>}
      {errorMsg && <p className="error-msg">{errorMsg}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar enlace"}
      </button>
    </form>
  );

  return (
    <div className="forgot-container">
      {showOverlay ? (
        <ContactOverlay onClose={() => setShowOverlay(false)}>
          {forgotFormJSX}
        </ContactOverlay>
      ) : (
        forgotFormJSX
      )}
    </div>
  );
}