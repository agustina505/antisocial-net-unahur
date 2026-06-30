import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsApi } from '../api/api';
import type { Post } from '../types';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        setLoading(true);
        const posts = await postsApi.getByUser(user.id);
        setUserPosts(posts);
      } catch (error) {
        console.error('Error al cargar posts del usuario:', error);
        setError('Error al cargar tus publicaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #eee' }}>
        <h1>Perfil de @{user.nickName}</h1>
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: '#e74c3c', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Cerrar sesión
        </button>
      </div>

      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <p><strong>Nombre:</strong> {user.name || user.nickName}</p>
        <p><strong>Email:</strong> {user.email || 'No especificado'}</p>
        <p><strong>Publicaciones:</strong> {userPosts.length}</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Link 
          to="/create-post" 
          style={{ 
            display: 'inline-block', 
            background: '#27ae60', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '4px', 
            textDecoration: 'none' 
          }}
        >
          + Crear nueva publicación
        </Link>
      </div>

      <h2>Mis Publicaciones</h2>
      
      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Cargando publicaciones...</p>
      ) : error ? (
        <p style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</p>
      ) : userPosts.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Aún no has creado publicaciones. ¡Crea tu primera publicación!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {userPosts.map((post) => (
            <div key={post.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>{post.description}</p>
              {post.tags && post.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {post.tags.map((tag, index) => (
                    <span key={index} style={{ background: '#e8f4fd', color: '#2c7fb8', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#666' }}>💬 {post.comments?.length || 0} comentarios</span>
                <Link to={`/post/${post.id}`} style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold' }}>
                  Ver más →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};