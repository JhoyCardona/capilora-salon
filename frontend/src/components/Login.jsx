// components/Login.jsx
import { useState } from 'react';
import { apiPost } from '../api/client';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const data = await apiPost('/business/login', { email, password });
      localStorage.setItem('authToken', data.token);
      onLoginSuccess(data.business);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="login">
      <h2>Panel del negocio</h2>
      <p className="login-subtitle">Ingresá con tu cuenta de Capilora Salón</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-label" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />

        <label className="login-label" htmlFor="login-password">
          Contraseña
        </label>
        <input
          id="login-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        {error && <p className="login-error">Error: {error}</p>}

        <button type="submit" className="login-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </section>
  );
}

export default Login;