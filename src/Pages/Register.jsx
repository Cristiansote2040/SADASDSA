import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import ContactOverlay from "../Components/Contactame"; // Importalo
import "../styles/Register.css";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [showOverlay, setShowOverlay] = useState(false); // <--- Controlamos el cartel
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const passwordRules = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password),
  };

  const passwordStrength = Object.values(passwordRules).filter(Boolean).length * 25;
  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    setLoading(true);
    try {
      //await register(form.name, form.email, form.password);//
      // Cuando termina, saltamos el mensaje
      setShowOverlay(true); 
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // Metemos el form en una constante para no repetir código
  const formJSX = (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Crear cuenta</h2>
      <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />

      <div className="password-strength">
        <div className="strength-bar" style={{ width: `${passwordStrength}%`, background: `linear-gradient(90deg, orange, darkorange)` }} />
      </div>

      <p className="strength-text">Fortaleza: {passwordStrength}%</p>

      <ul className="password-rules">
        <li className={passwordRules.length ? "valid" : ""}>Mínimo 8 caracteres</li>
        <li className={passwordRules.upper ? "valid" : ""}>Una mayúscula</li>
        <li className={passwordRules.number ? "valid" : ""}>Un número</li>
        <li className={passwordRules.special ? "valid" : ""}>Un símbolo</li>
      </ul>

      <button disabled={loading || !isPasswordValid}>
        {loading ? "Registrando..." : "Registrarse"}
      </button>

      <p>¿Ya tenés cuenta? <Link to={'/Login'}>Iniciar sesión</Link></p>
    </form>
  );

  return (
    <div className="register-container">
      {showOverlay ? (
        <ContactOverlay onClose={() => setShowOverlay(false)}>
          {formJSX}
        </ContactOverlay>
      ) : (
        formJSX
      )}
    </div>
  );
}