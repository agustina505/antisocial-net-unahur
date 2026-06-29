import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../api/api';
import { useNavigate, Link } from 'react-router-dom';

export const Login: React.FC = () => {
  const [nickName, setNickName] = useState('');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      //GET /users para obtener todos los usuarios
      const users = await usersApi.getAll();
      
      // Buscar el usuario por nickName
      const foundUser = users.find((u) => u.nickName === nickName);
      
      if (!foundUser) {
        setError('Usuario no encontrado. ¿Estás registrado?');
        setIsLoading(false);
        return;
      }

      //Validar contraseña (hardcodeada se como pide en el TP)
      if (password !== '123456') {
        setError('Contraseña incorrecta');
        setIsLoading(false);
        return;
      }

      //Login exitoso
      login(foundUser);
      navigate('/');
      
    } catch (error) {
      // Error inesperado
      console.error('Error en login:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error al iniciar sesión. Verifique su conexión.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nickName">NickName:</label>
          <input
            id="nickName"
            type="text"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            placeholder="Ingresa tu nickName"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            disabled={isLoading}
          />
          <small>Contraseña fija: 123456</small>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
};