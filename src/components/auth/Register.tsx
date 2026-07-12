import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usersApi } from '../../api/api';

interface RegisterFormData {
  nickName: string;
  name: string;
  email: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    nickName: '',
    name: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): string | null => {
    if (!formData.nickName.trim()) return 'El nickName es obligatorio';
    if (!formData.name.trim()) return 'El nombre completo es obligatorio';
    if (!formData.email.trim()) return 'El email es obligatorio';
    if (!EMAIL_REGEX.test(formData.email.trim())) return 'Ingresá un email válido (ej: nombre@mail.com)';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      await usersApi.create(formData);
      setSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error en registro:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error al registrar usuario. Verifique su conexión.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Creá tu cuenta</h1>
          <p style={{ color: 'var(--text)', fontSize: '0.95rem' }}>
            Sumate a UnaHur Anti-Social Net
          </p>
        </div>

        {success && (
          <div className="success-message">
            ✅ ¡Usuario registrado exitosamente! Redirigiendo al login...
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="nickName">NickName *</label>
            <input
              id="nickName"
              name="nickName"
              type="text"
              value={formData.nickName}
              onChange={handleChange}
              placeholder="Ej: juan123"
              disabled={isLoading || success}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="name">Nombre completo *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              disabled={isLoading || success}
            />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@mail.com"
              disabled={isLoading || success}
            />
          </div>

          {error && (
            <div className="error-message">❌ {error}</div>
          )}

          <button type="submit" disabled={isLoading || success} style={{ width: '100%', padding: '0.85rem', fontSize: '1.05rem' }}>
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};