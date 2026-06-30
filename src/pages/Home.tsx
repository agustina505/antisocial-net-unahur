import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsApi } from '../api/api';
import type { Post } from '../types';

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const postsData = await postsApi.getAll();
        setPosts(postsData);
      } catch (error) {
        console.error('Error al cargar posts:', error);
        setError('Error al cargar las publicaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando publicaciones...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>❌ {error}</div>;
  }

  return (
    <div>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '3rem', 
        borderRadius: '8px', 
        textAlign: 'center', 
        marginBottom: '2rem' 
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Bienvenido a UnaHur Anti-Social Net</h1>
        <p>Conecta, comparte y descubre contenido único</p>
      </div>

      <h2>Publicaciones recientes</h2>
      
      {posts.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No hay publicaciones aún. ¡Sé el primero en publicar!</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem', 
          marginTop: '1.5rem' 
        }}>
          {posts.map((post) => (
            <div key={post.id} style={{ 
              background: 'white', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)' 
            }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>{post.description}</p>
              {post.tags && post.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {post.tags.map((tag, index) => (
                    <span key={index} style={{ 
                      background: '#e8f4fd', 
                      color: '#2c7fb8', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px', 
                      fontSize: '0.85rem' 
                    }}>
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