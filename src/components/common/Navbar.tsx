import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav style={{ 
      background: '#2c3e50', 
      padding: '1rem 2rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      color: 'white',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      {/* Logo / Brand */}
      <div>
        <Link to="/" style={{ 
          color: 'white', 
          textDecoration: 'none', 
          fontSize: '1.5rem', 
          fontWeight: 'bold' 
        }}>
          💬 UnaHur Anti-Social Net
        </Link>
      </div>

      {/* Links */}
      <div style={{ 
        display: 'flex', 
        gap: '1.5rem', 
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Inicio
        </Link>
        
        {user ? (
          <>
            <Link to="/create-post" style={{ 
              color: '#27ae60', 
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              ✏️ Nueva Publicación
            </Link>
            <Link to="/profile" style={{ 
              color: '#3498db', 
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              👤 @{user.nickName}
            </Link>
            <button 
              onClick={handleLogout} 
              style={{ 
                background: '#e74c3c', 
                color: 'white', 
                border: 'none', 
                padding: '0.5rem 1.2rem', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#c0392b'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#e74c3c'}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              background: '#3498db',
              borderRadius: '6px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#2980b9'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#3498db'}
            >
              Iniciar Sesión
            </Link>
            <Link to="/register" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              background: '#27ae60',
              borderRadius: '6px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#219a52'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#27ae60'}
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};