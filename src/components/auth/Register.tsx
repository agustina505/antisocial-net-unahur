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
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Registro de Usuario</h2>
      
      {success && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>
          ✅ ¡Usuario registrado exitosamente! Redirigiendo al login...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>NickName *:</label>
          <input
            name="nickName"
            type="text"
            value={formData.nickName}
            onChange={handleChange}
            placeholder="Ej: juan123"
            required
            disabled={isLoading || success}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nombre completo *:</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Juan Pérez"
            required
            disabled={isLoading || success}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email *:</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@mail.com"
            required
            disabled={isLoading || success}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        {error && (
          <div style={{ background: '#fee', color: '#c0392b', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>
            ❌ {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading || success}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            background: '#27ae60', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#3498db' }}>Inicia sesión aquí</Link>
      </p>
    </div>
  );
};