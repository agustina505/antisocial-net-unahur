import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../api/api';

export const LoginPage: React.FC = () => {
  const [nickName, setNickName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Si ya está logueado, redirigir al home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Cargar nickName guardado
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

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
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
    <div style={{ 
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{ 
        maxWidth: '440px', 
        width: '100%',
        padding: '2.5rem', 
        background: 'white', 
        borderRadius: '16px', 
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0'
      }}>
        {/* Logo o icono */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem'
          }}>
            💬
          </div>
          <h1 style={{ 
            fontSize: '1.8rem', 
            color: '#2c3e50',
            marginBottom: '0.25rem',
            fontWeight: '700'
          }}>
            ¡Bienvenido!
          </h1>
          <p style={{ color: '#7f8c8d', fontSize: '0.95rem' }}>
            Ingresa a tu cuenta de UnaHur Anti-Social Net
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Campo NickName */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600',
              color: '#2c3e50',
              fontSize: '0.95rem'
            }}>
              👤 NickName
            </label>
            <input
              type="text"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
              placeholder="Ej: juan123"
              required
              disabled={isLoading}
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem', 
                border: '2px solid #e0e0e0', 
                borderRadius: '8px', 
                fontSize: '1rem',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                outline: 'none',
                background: '#fafafa'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Campo Contraseña */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600',
              color: '#2c3e50',
              fontSize: '0.95rem'
            }}>
              🔑 Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                disabled={isLoading}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem', 
                  border: '2px solid #e0e0e0', 
                  borderRadius: '8px', 
                  fontSize: '1rem',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                  outline: 'none',
                  background: '#fafafa',
                  paddingRight: '3rem'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#7f8c8d',
                  fontSize: '1.2rem',
                  padding: '0.25rem',
                  opacity: password ? 1 : 0.4
                }}
                disabled={!password}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '0.5rem'
            }}>
              <small style={{ color: '#95a5a6' }}>
                🔑 Contraseña: <strong style={{ color: '#e74c3c' }}>123456</strong>
              </small>
            </div>
          </div>

          {/* Opciones */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '0.9rem',
              color: '#555',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ 
                  marginRight: '0.5rem', 
                  width: '18px', 
                  height: '18px',
                  cursor: 'pointer'
                }}
              />
              Recordarme
            </label>
            <Link 
              to="/register" 
              style={{ 
                color: '#667eea', 
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#764ba2'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#667eea'}
            >
              ¿No tienes cuenta? → Registrarse
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div style={{ 
              background: '#fee', 
              color: '#c0392b', 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              marginBottom: '1.25rem',
              border: '1px solid #f5c6cb',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              animation: 'shake 0.5s ease-in-out'
            }}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Botón */}
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '0.85rem', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '1.05rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }}
          >
            {isLoading ? (
              <span>⏳ Iniciando sesión...</span>
            ) : (
              <span>Iniciar Sesión</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center', 
          color: '#95a5a6',
          fontSize: '0.85rem',
          borderTop: '1px solid #ecf0f1',
          paddingTop: '1.5rem'
        }}>
          <p style={{ margin: 0 }}>
            ¿Problemas para iniciar sesión? <br />
            <span style={{ color: '#667eea', fontWeight: '500' }}>
              soporte@unahur.edu.ar
            </span>
          </p>
        </div>

        {/* Animación CSS para el error */}
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            75% { transform: translateX(8px); }
          }
        `}</style>
      </div>
    </div>
  );
};