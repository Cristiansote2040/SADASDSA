// src/Pages/ResetPassword.jsx
import { useState } from "react";
import { resetPassword } from "../services/AuthServices";
import { useParams } from "react-router-dom";
import ErrorPage from "../Components/ErrorPage";
import Loading from "../Components/Loading";
import "../styles/ResetPassword.css";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errorPage, setErrorPage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 reglas de contraseña
  const passwordRules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const passwordStrength = Object.values(passwordRules).filter(Boolean).length * 25;
  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const submit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    setMsg("");
    setErrorMsg("");
    setErrorPage(null);
    setLoading(true);

    try {
      const res = await resetPassword(token, password);
      setMsg(res.msg);
    } catch (err) {
      const status = err.response?.status || 500;
      const message =
        err.response?.data?.msg || "Error crítico al cambiar contraseña";

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

  return (
    <div className="reset-container">
      <form className="reset-form" onSubmit={submit}>
        <h1>Nueva contraseña</h1>
        <p>Ingrese su nueva contraseña para actualizar su cuenta de forma segura.</p>

        {msg && <p className="success-msg">{msg}</p>}
        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* 🔥 barra de fuerza */}
        <div className="password-strength">
          <div className="strength-bar" style={{ width: `${passwordStrength}%` }} />
        </div>
        <p className="strength-text">Fortaleza: {passwordStrength}%</p>

        {/* 🔥 reglas */}
        <ul className="password-rules">
          <li className={passwordRules.length ? "valid" : ""}>Mínimo 8 caracteres</li>
          <li className={passwordRules.upper ? "valid" : ""}>Una mayúscula</li>
          <li className={passwordRules.number ? "valid" : ""}>Un número</li>
          <li className={passwordRules.special ? "valid" : ""}>Un símbolo</li>
        </ul>

        <button type="submit" disabled={loading || !isPasswordValid}>
          {loading ? "Cambiando..." : "Cambiar contraseña"}
        </button>
      </form>
    </div>
  );
}