import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsApi, postImagesApi, tagsApi } from '../api/api';
import type { Tag } from '../types';

export const CreatePost: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Traer las etiquetas disponibles desde la API para armar la selección
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await tagsApi.getAll();
        setAvailableTags(tags);
      } catch (error) {
        console.error('Error al cargar etiquetas:', error);
      } finally {
        setTagsLoading(false);
      }
    };
    fetchTags();
  }, []);

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (!description.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    setError('');
    setLoading(true);
    setSuccess(false);

    try {
      const newPost = await postsApi.create({
        description: description.trim(),
        userId: user.id,
        tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      });

      const imageUrlsArray = imageUrls.split(',').map((u) => u.trim()).filter(Boolean);

      if (imageUrlsArray.length > 0) {
        await Promise.all(
          imageUrlsArray.map((url) => postImagesApi.create({ url, postId: newPost.id }))
        );
      }

      setSuccess(true);
      setTimeout(() => navigate('/profile'), 1500);
    } catch (error) {
      console.error('Error al crear publicación:', error);
      if (error instanceof Error) {
        setError(`Error: ${error.message}`);
      } else {
        setError('Error al crear la publicación. Verifica los datos e intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="timeline">
      <Link to="/profile" className="back-link">← Volver a mi perfil</Link>

      <div className="composer">
        <div className="avatar avatar-md">{user.nickName.charAt(0).toUpperCase()}</div>
        <form onSubmit={handleSubmit} noValidate>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="¿Qué estás pensando?"
            disabled={loading || success}
            rows={3}
          />

          <div style={{ marginTop: '0.75rem' }}>
            <input
              name="imageUrls"
              type="text"
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              placeholder="URLs de imágenes separadas por coma (opcional)"
              disabled={loading || success}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label style={{ marginBottom: '0.5rem' }}>Etiquetas</label>
            {tagsLoading ? (
              <p style={{ color: 'var(--text)', fontSize: '0.9rem' }}>Cargando etiquetas...</p>
            ) : availableTags.length === 0 ? (
              <p style={{ color: 'var(--text)', fontSize: '0.9rem' }}>No hay etiquetas disponibles.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {availableTags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      type="button"
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      disabled={loading || success}
                      style={{
                        padding: '0.4rem 1rem',
                        borderRadius: '999px',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        border: `1px solid ${isSelected ? 'transparent' : 'var(--border)'}`,
                        background: isSelected ? 'var(--accent)' : 'transparent',
                        color: isSelected ? 'white' : 'var(--text-h)',
                      }}
                    >
                      #{tag.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {success && (
            <div className="success-message" style={{ marginTop: '0.75rem' }}>
              ✅ ¡Publicación creada! Redirigiendo...
            </div>
          )}

          {error && (
            <div className="error-message" style={{ marginTop: '0.75rem' }}>
              ❌ {error}
            </div>
          )}

          <div className="composer-footer">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              disabled={loading || success}
              style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}
            >
              Cancelar
            </button>
            <button type="submit" disabled={loading || success || !description.trim()}>
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};