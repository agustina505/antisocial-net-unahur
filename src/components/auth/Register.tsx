import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usersApi } from '../../api/api';

interface RegisterFormData {
  nickName: string;
  name: string;
  email: string;
}

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      // Validar campos requeridos
      if (!formData.nickName || !formData.name || !formData.email) {
        setError('Todos los campos son obligatorios');
        setIsLoading(false);
        return;
      }

      // POST /users
      const newUser = await usersApi.create(formData);
      
      setSuccess(true);
      
      // Redirigir al login después de 2 segundos
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
  <div className="card" style={{ margin: '2rem auto' }}>
    <h2>Registro de Usuario</h2>

    {success && (
      <div className="success-message">
        ✅ ¡Usuario registrado exitosamente! Redirigiendo al login...
      </div>
    )}

    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="nickName">NickName *:</label>
        <input
          id="nickName"
          name="nickName"
          type="text"
          value={formData.nickName}
          onChange={handleChange}
          placeholder="Ej: juan123"
          required
          disabled={isLoading || success}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="name">Nombre completo *:</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej: Juan Pérez"
          required
          disabled={isLoading || success}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="email">Email *:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="ejemplo@mail.com"
          required
          disabled={isLoading || success}
        />
      </div>

      {error && <div className="error-message">❌ {error}</div>}

      <button type="submit" disabled={isLoading || success}>
        {isLoading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>

    <p style={{ textAlign: 'center', marginTop: '1rem' }}>
      ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
    </p>
  </div>
);
};