import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 10v9h14v-9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ComposeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" strokeLinecap="round" />
  </svg>
);

const PeepholeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 20c-4 0-7-3.6-9-8 2-4.4 5-8 9-8s7 3.6 9 8c-2 4.4-5 8-9 8Z" />
    <line x1="3" y1="21" x2="21" y2="3" strokeLinecap="round" />
  </svg>
);

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div>
        <Link to="/" className="sidebar-brand">
          <span className="sidebar-brand-icon"><PeepholeIcon /></span>
          <span>UnaHur Anti-Social</span>
        </Link>

        <nav className="sidebar-nav">
          <Link to="/" className={`sidebar-link ${isActive('/') ? 'active' : ''}`}>
            <HomeIcon />
            <span>Inicio</span>
          </Link>

          {user && (
            <>
              <Link to="/create-post" className={`sidebar-link ${isActive('/create-post') ? 'active' : ''}`}>
                <ComposeIcon />
                <span>Publicar</span>
              </Link>
              <Link to="/profile" className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}>
                <ProfileIcon />
                <span>Perfil</span>
              </Link>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="sidebar-link sidebar-link-primary" style={{ marginTop: '1rem' }}>
                <span>Iniciar sesión</span>
              </Link>
              <Link to="/register" className="sidebar-link">
                <span>Registrarse</span>
              </Link>
            </>
          )}
        </nav>
      </div>

      {user && (
        <div className="sidebar-user">
          <div className="avatar avatar-sm">{user.nickName.charAt(0).toUpperCase()}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">@{user.nickName}</div>
            <button className="sidebar-user-logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
