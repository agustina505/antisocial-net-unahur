import React from 'react';
import './index.css'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
//import { Login } from './components/auth/Login';
import { LoginPage } from './pages/LoginPage';
import { Register } from './components/auth/Register';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { PostDetail } from './pages/PostDetail';
import { CreatePost } from './pages/CreatePost';


// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Componente Navbar mejorado
const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ 
      background: '#2c3e50', 
      padding: '1rem 2rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      color: 'white',
      flexWrap: 'wrap'
    }}>
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          UnaHur Anti-Social Net
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Inicio</Link>
        {user ? (
          <>
            <Link to="/profile" style={{ color: '#3498db', textDecoration: 'none' }}>
              @{user.nickName}
            </Link>
            <button 
              onClick={logout} 
              style={{ 
                background: '#e74c3c', 
                color: 'white', 
                border: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Iniciar Sesión</Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

// Componente Main
const AppContent: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/post/:id" element={<PostDetail />} />
                    <Route path="/create-post" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;