import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsApi, postImagesApi } from '../api/api';

interface PostFormData {
  description: string;
  tags: string;
  imageUrls: string;
}

export const CreatePost: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<PostFormData>({
    description: '',
    tags: '',
    imageUrls: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirigir si no está logueado
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    // Validar que la descripción no esté vacía
    if (!formData.description.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    setError('');
    setLoading(true);
    setSuccess(false);

    try {
      // 1. Crear el post
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      const postData = {
        description: formData.description.trim(),
        userId: user.id,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      };

      const newPost = await postsApi.create(postData);

      // 2. Si hay URLs de imágenes, subirlas
      const imageUrlsArray = formData.imageUrls
        .split(',')
        .map(url => url.trim())
        .filter(url => url !== '');

      if (imageUrlsArray.length > 0) {
        const imagePromises = imageUrlsArray.map(url =>
          postImagesApi.create({
            url: url,
            postId: newPost.id,
          })
        );
        
        await Promise.all(imagePromises);
      }

      // 3. Mostrar éxito y redirigir
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
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

  if (!user) {
    return null;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Link 
        to="/profile" 
        style={{ 
          display: 'inline-block', 
          marginBottom: '1.5rem', 
          color: '#3498db', 
          textDecoration: 'none',
          fontWeight: 'bold'
        }}
      >
        ← Volver a mi perfil
      </Link>

      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '8px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          Crear Nueva Publicación
        </h2>
        
        {success && (
          <div style={{ 
            background: '#d4edda', 
            color: '#155724', 
            padding: '1rem', 
            borderRadius: '4px', 
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            ✅ ¡Publicación creada exitosamente! Redirigiendo...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Descripción */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="¿Qué estás pensando?"
              required
              disabled={loading || success}
              rows={4}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                fontSize: '1rem',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
              Describe tu publicación (máximo 500 caracteres)
            </small>
          </div>

          {/* Etiquetas */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Etiquetas
            </label>
            <input
              name="tags"
              type="text"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Ej: viaje, comida, tecnología"
              disabled={loading || success}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                fontSize: '1rem'
              }}
            />
            <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
              Separa las etiquetas con comas. Ej: viaje, comida, tecnología
            </small>
          </div>

          {/* URLs de imágenes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              URLs de imágenes
            </label>
            <input
              name="imageUrls"
              type="text"
              value={formData.imageUrls}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
              disabled={loading || success}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                fontSize: '1rem'
              }}
            />
            <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
              Separa las URLs con comas. Las imágenes se mostrarán en la publicación.
            </small>
          </div>

          {error && (
            <div style={{ 
              background: '#fee', 
              color: '#c0392b', 
              padding: '0.75rem', 
              borderRadius: '4px', 
              marginBottom: '1rem' 
            }}>
              ❌ {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="button" 
              onClick={() => navigate('/profile')}
              disabled={loading || success}
              style={{ 
                flex: 1,
                padding: '0.75rem', 
                background: '#95a5a6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading || success || !formData.description.trim()}
              style={{ 
                flex: 2,
                padding: '0.75rem', 
                background: '#27ae60', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: loading || success ? 'not-allowed' : 'pointer',
                opacity: loading || success || !formData.description.trim() ? 0.6 : 1
              }}
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};