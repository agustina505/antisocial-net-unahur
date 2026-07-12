import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsApi, commentsApi } from '../api/api';
import type { Post, Comment } from '../types';

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');

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

        const [postData, commentsData] = await Promise.all([
          postsApi.getById(Number(id)),
          commentsApi.getByPost(Number(id)),
        ]);

        setPost(postData);
        setComments(commentsData);
      } catch (error) {
        console.error('Error al cargar el post:', error);
        setError('Error al cargar la publicación');
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentError('');

    if (!user) {
      setCommentError('Debes iniciar sesión para comentar');
      return;
    }

    if (!newComment.trim()) {
      setCommentError('El comentario no puede estar vacío');
      return;
    }

    try {
      setSubmitting(true);

      const commentData = {
        content: newComment,
        postId: Number(id),
        userId: user.id,
      };

      const newCommentData = await commentsApi.create(commentData);
      setComments([...comments, { ...newCommentData, user }]);
      setNewComment('');
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      setCommentError('Error al enviar el comentario. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="timeline"><div className="timeline-status">Cargando publicación...</div></div>;
  }

  if (error || !post) {
    return (
      <div className="timeline">
        <div className="timeline-status">
          ❌ {error || 'Publicación no encontrada'}
          <div style={{ marginTop: '1rem' }}>
            <Link to="/">← Volver al inicio</Link>
          </div>
        </div>
      </div>
    );
  }

  const nick = post.user?.nickName || 'usuario';

  return (
    <div className="timeline">
      <Link to="/" className="back-link">← Volver</Link>

      <div className="post-detail-main">
        <div className="post-detail-header">
          <div className="avatar avatar-md">{nick.charAt(0).toUpperCase()}</div>
          <div>
            <span className="post-detail-name">{post.user?.name || nick}</span>
            <span className="post-detail-handle">@{nick}</span>
          </div>
        </div>

        <p className="post-detail-text">{post.description}</p>

        {post.images && post.images.length > 0 && (
          <div className="post-card-images" style={{ marginBottom: '1rem' }}>
            {post.images.map((img, i) => (
              <img key={i} src={img.url} alt="" />
            ))}
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="post-card-tags">
            {post.tags.map((tag, i) => (
              <span key={i} className="post-tag">#{tag}</span>
            ))}
          </div>
        )}

        {post.createdAt && <div className="post-detail-date">{formatDate(post.createdAt)}</div>}

        <div className="post-card-footer" style={{ paddingTop: '0.75rem' }}>
          <span className="post-card-footer-item">💬 {comments.length} comentarios</span>
        </div>
      </div>

      {user ? (
        <div className="comment-form">
          <div className="avatar avatar-sm">{user.nickName.charAt(0).toUpperCase()}</div>
          <form onSubmit={handleSubmitComment} noValidate>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribí tu comentario"
              disabled={submitting}
              rows={2}
            />
            {commentError && <div className="error-message" style={{ marginTop: '0.5rem' }}>❌ {commentError}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" disabled={submitting || !newComment.trim()} style={{ borderRadius: '999px' }}>
                {submitting ? 'Enviando...' : 'Comentar'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="timeline-status">
          <Link to="/login">Inicia sesión</Link> para comentar
        </div>
      )}

      {comments.length === 0 ? (
        <div className="timeline-empty">💭 No hay comentarios aún. ¡Sé el primero!</div>
      ) : (
        comments.map((comment) => {
          const cNick = comment.user?.nickName || 'usuario';
          return (
            <div key={comment.id} className="comment-row">
              <div className="avatar avatar-sm">{cNick.charAt(0).toUpperCase()}</div>
              <div className="comment-body">
                <div className="comment-header">
                  <span className="comment-name">@{cNick}</span>
                  {comment.createdAt && <span className="comment-date">· {formatDate(comment.createdAt)}</span>}
                </div>
                <p className="comment-text">{comment.content}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};