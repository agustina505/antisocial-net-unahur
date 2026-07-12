import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../api/api';

export const LoginPage: React.FC = () => {
  const [nickName, setNickName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const savedNick = localStorage.getItem('rememberedNick');
    if (savedNick) {
      setNickName(savedNick);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!nickName.trim()) {
      setError('Por favor ingresa tu nickName');
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña');
      setIsLoading(false);
      return;
    }

    try {
      const users = await usersApi.getAll();
      const foundUser = users.find(
        (u) => u.nickName.toLowerCase() === nickName.toLowerCase()
      );

      if (!foundUser) {
        setError('Usuario no encontrado. ¿Estás registrado?');
        setIsLoading(false);
        return;
      }

      if (password !== '123456') {
        setError('Contraseña incorrecta');
        setIsLoading(false);
        return;
      }

      if (rememberMe) {
        localStorage.setItem('rememberedNick', nickName);
      } else {
        localStorage.removeItem('rememberedNick');
      }

      login(foundUser);
      navigate('/');
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error al conectar con el servidor. Verifica tu conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>¡Bienvenido!</h1>
          <p style={{ color: 'var(--text)', fontSize: '0.95rem' }}>
            Ingresa a tu cuenta de UnaHur Anti-Social Net
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="nickName">NickName</label>
            <input
              id="nickName"
              type="text"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
              placeholder="Ej: juan123"
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              disabled={isLoading}
            />
            <div style={{ marginTop: '0.5rem' }}>
              <small style={{ color: 'var(--text)' }}>
                Contraseña: <strong style={{ color: 'var(--accent)' }}>123456</strong>
              </small>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.75rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontWeight: '400',
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Recordarme
            </label>
            <Link to="/register">¿No tienes cuenta? → Registrarse</Link>
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '1.05rem',
            }}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};