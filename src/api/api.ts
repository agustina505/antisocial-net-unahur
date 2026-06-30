import type { User, Post, Comment, PostImage, Tag } from '../types';

const API_BASE_URL = 'http://localhost:3001';

//HELPER PARA MANEJAR RESPUESTAS
async function handleResponse<T>(response: Response): Promise<T> {
  // Verificar si la respuesta es exitosa (status 200-299)
  if (!response.ok) {
    let errorMessage = `Error en la respuesta del servidor: ${response.status}`;
    
    try {
      // Intentar obtener el mensaje de error del body
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // Si no se puede parsear el error, usar el mensaje por defecto
    }
    
    throw new Error(errorMessage);
  }
  
  // Procesar la respuesta como JSON
  try {
    const data = await response.json();
    return data as T;
  } catch (error) {
    // Error de parsing
    throw new Error('Error al procesar la respuesta del servidor');
  }
}

//METODOS HTTP

// GET - Obtener datos 
export async function get<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return await handleResponse<T>(response);
  } catch (error) {
    // Error inesperado (sin internet, DNS, etc.)
    console.error('Error inesperado en GET:', error);
    throw new Error('Error de conexión. Verifique su internet.');
  }
}

// POST - Crear datos
export async function post<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await handleResponse<T>(response);
  } catch (error) {
    console.error('Error inesperado en POST:', error);
    throw new Error('Error de conexión. Verifique su internet.');
  }
}

// PUT - Actualizar completamente
export async function put<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await handleResponse<T>(response);
  } catch (error) {
    console.error('Error inesperado en PUT:', error);
    throw new Error('Error de conexión. Verifique su internet.');
  }
}

// PATCH - Actualizar parcialmente
export async function patch<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await handleResponse<T>(response);
  } catch (error) {
    console.error('Error inesperado en PATCH:', error);
    throw new Error('Error de conexión. Verifique su internet.');
  }
}

// DELETE - Eliminar
export async function del<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    return await handleResponse<T>(response);
  } catch (error) {
    console.error('Error inesperado en DELETE:', error);
    throw new Error('Error de conexión. Verifique su internet.');
  }
}

// ENDPOINTS ESPECÍFICOS

// USERS
export const usersApi = {
  getAll: () => get<User[]>('/users'),
  getById: (id: number) => get<User>(`/users/${id}`),
  create: (userData: Omit<User, 'id'>) => post<User>('/users', userData),
};

// POSTS
export const postsApi = {
  getAll: () => get<Post[]>('/posts'),
  getById: (id: number) => get<Post>(`/posts/${id}`),
  getByUser: (userId: number) => get<Post[]>(`/posts?userId=${userId}`),
  create: (postData: { description: string; userId: number; tags?: string[] }) => 
    post<Post>('/posts', postData),
};

// COMMENTS
export const commentsApi = {
  getByPost: (postId: number) => get<Comment[]>(`/comments/post/${postId}`),
  create: (commentData: { content: string; postId: number; userId: number }) => 
    post<Comment>('/comments', commentData),
};

// POST IMAGES
export const postImagesApi = {
  getByPost: (postId: number) => get<PostImage[]>(`/postimages/post/${postId}`),
  create: (imageData: { url: string; postId: number }) => 
    post<PostImage>('/postimages', imageData),
};

// TAGS
export const tagsApi = {
  getAll: () => get<Tag[]>('/tags'),
};