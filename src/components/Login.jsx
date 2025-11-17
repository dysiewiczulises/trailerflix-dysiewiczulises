import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const { user, login, logout, loadingAuth } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await login(username.trim(), password);
    if (!result.ok) {
      setError(result.message);
    } else {
      setUsername('');
      setPassword('');
      setError(null);
    }
    setSubmitting(false);
  };

  if (loadingAuth) {
    return <div className="login-placeholder">Cargando usuario...</div>;
  }

  if (user) {
    return (
      <div className='login-container'>
        <div id='userInfo'>
          <span id='userNameDisplay'>Hola, {user.firstName}</span>
          <button id='logoutBtn' onClick={logout}>Cerrar sesión</button>
        </div>
      </div>
    );
  }


  return (

    <div className="login-container">

      <form id='loginForm' onSubmit={handleSubmit}>
        <input
          className="input-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuario"
          required
        />
        <input
          className="input-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />

        <div className="form-row">
          <button className="btn-login" type="submit" disabled={submitting}>
            {submitting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </div>
        {error && <p className="login-error" role="alert">{error}</p>}
      </form>
    </div>
  );
}
