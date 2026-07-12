import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsApi } from '../api/api';
import type { Post } from '../types';
import { PostFeed } from '../components/common/PostFeed';

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
    <div className="timeline">
      <div className="timeline-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>@{user.nickName}</h1>
        <button onClick={handleLogout} style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem' }}>
          Cerrar sesión
        </button>
      </div>

      <div className="post-detail-main" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div className="avatar avatar-lg">{user.nickName.charAt(0).toUpperCase()}</div>
        <div>
          <div className="post-detail-name">{user.name || user.nickName}</div>
          <div className="post-detail-handle">@{user.nickName}</div>
          {user.email && <div className="post-detail-handle">{user.email}</div>}
          <div className="post-detail-handle">{userPosts.length} publicaciones</div>
        </div>
      </div>

      <Link
        to="/create-post"
        className="sidebar-link-primary"
        style={{ display: 'block', textAlign: 'center', margin: '1rem 1.25rem', textDecoration: 'none' }}
      >
        + Crear nueva publicación
      </Link>

      <PostFeed
        posts={userPosts}
        loading={loading}
        error={error}
        emptyMessage="Aún no has creado publicaciones. ¡Crea tu primera publicación!"
      />
    </div>
  );
};