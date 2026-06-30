import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsApi, commentsApi } from '../api/api';
import type { Post, Comment } from '../types';

export const PostDetail: React.FC = () => {
  // Obtener el ID de la URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Estados
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');

  // Cargar post y comentarios al montar el componente
  useEffect(() => {
    const fetchPostData = async () => {
      if (!id) {
        setError('ID de publicación no válido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        // Obtener post y comentarios en paralelo
        const [postData, commentsData] = await Promise.all([
          postsApi.getById(Number(id)),
          commentsApi.getByPost(Number(id))
        ]);
        
        setPost(postData);
        setComments(commentsData);
        
      } catch (error) {
        console.error('Error al cargar el post:', error);
        if (error instanceof Error) {
          setError(`Error al cargar la publicación: ${error.message}`);
        } else {
          setError('Error al cargar la publicación');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  // Enviar comentario
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError('');
    
    // Validar que el usuario esté logueado
    if (!user) {
      setCommentError('Debes iniciar sesión para comentar');
      return;
    }

    // Validar que el comentario no esté vacío
    if (!newComment.trim()) {
      setCommentError('El comentario no puede estar vacío');
      return;
    }

    try {
      setSubmitting(true);
      
      const commentData = {
        content: newComment,
        postId: Number(id),
        userId: user.id
      };
      
      const newCommentData = await commentsApi.create(commentData);
      
      // Agregar el comentario a la lista con el usuario actual
      setComments([...comments, { 
        ...newCommentData, 
        user: user 
      }]);
      setNewComment('');
      
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      setCommentError('Error al enviar el comentario. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  // Mostrar loading
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        flexDirection: 'column'
      }}>
        <div style={{ fontSize: '1.5rem', color: '#666' }}>Cargando publicación...</div>
        <div style={{ marginTop: '1rem', color: '#999' }}>Por favor espera</div>
      </div>
    );
  }

  // Mostrar error
  if (error || !post) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '2rem auto', 
        padding: '2rem', 
        background: '#fee', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#c0392b' }}>❌ Error</h2>
        <p style={{ color: '#c0392b' }}>{error || 'Publicación no encontrada'}</p>
        <Link 
          to="/" 
          style={{ 
            display: 'inline-block', 
            marginTop: '1rem', 
            color: '#3498db', 
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Botón volver */}
      <Link 
        to="/" 
        style={{ 
          display: 'inline-block', 
          marginBottom: '1.5rem', 
          color: '#3498db', 
          textDecoration: 'none',
          fontWeight: 'bold'
        }}
      >
        ← Volver al inicio
      </Link>

      {/* Publicación completa */}
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '8px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
          {post.description}
        </h1>
        
        {post.user && (
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Publicado por: <strong>@{post.user.nickName}</strong>
          </p>
        )}
        
        {/* Imágenes */}
        {post.images && post.images.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#333' }}>Imágenes:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {post.images.map((img, index) => (
                <img 
                  key={index} 
                  src={img.url} 
                  alt={`Imagen ${index + 1}`} 
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    border: '1px solid #eee'
                  }}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Etiquetas */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#333' }}>Etiquetas:</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {post.tags.map((tag, index) => (
                <span 
                  key={index} 
                  style={{ 
                    background: '#e8f4fd', 
                    color: '#2c7fb8', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '20px', 
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '1rem' }}>
          <span>💬 {comments.length} comentarios</span>
        </div>
      </div>

      {/* Sección de comentarios */}
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '8px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>
          Comentarios ({comments.length})
        </h2>
        
        {/* Lista de comentarios */}
        {comments.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            color: '#666',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '1.1rem' }}>💭 No hay comentarios aún</p>
            <p style={{ fontSize: '0.9rem' }}>¡Sé el primero en comentar!</p>
          </div>
        ) : (
          <div style={{ marginBottom: '2rem' }}>
            {comments.map((comment) => (
              <div 
                key={comment.id} 
                style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid #eee',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#2c3e50' }}>
                    @{comment.user?.nickName || 'Usuario desconocido'}
                  </strong>
                  {comment.createdAt && (
                    <span style={{ color: '#999', fontSize: '0.85rem' }}>
                      {new Date(comment.createdAt).toLocaleDateString('es-AR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, lineHeight: '1.5', color: '#333' }}>
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Formulario para agregar comentario */}
        {user ? (
          <form onSubmit={handleSubmitComment} style={{ marginTop: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                Escribe tu comentario:
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="¿Qué opinas sobre esta publicación?"
                required
                disabled={submitting}
                rows={4}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px', 
                  fontSize: '1rem',
                  resize: 'vertical',
                  minHeight: '80px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {commentError && (
              <div style={{ 
                background: '#fee', 
                color: '#c0392b', 
                padding: '0.75rem', 
                borderRadius: '4px', 
                marginBottom: '1rem' 
              }}>
                ❌ {commentError}
              </div>
            )}

            <button 
              type="submit" 
              disabled={submitting || !newComment.trim()}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                background: '#3498db', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting || !newComment.trim() ? 0.6 : 1
              }}
            >
              {submitting ? 'Enviando comentario...' : 'Enviar comentario'}
            </button>
          </form>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '1.5rem', 
            background: '#f8f9fa', 
            borderRadius: '8px',
            marginTop: '1.5rem'
          }}>
            <p style={{ marginBottom: '0.5rem', color: '#666' }}>
              <Link to="/login" style={{ color: '#3498db', fontWeight: 'bold' }}>
                Inicia sesión
              </Link> para comentar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};