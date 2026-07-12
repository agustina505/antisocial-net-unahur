import type { User, Post, Comment, PostImage, Tag } from '../types';

const API_BASE_URL = 'http://localhost:3001';

//HELPER PARA MANEJAR RESPUESTAS
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Error en la respuesta del servidor: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // Si no se puede parsear el error, usar el mensaje por defecto
    }
    throw new Error(errorMessage);
  }

  try {
    const data = await response.json();
    return data as T;
  } catch (error) {
    throw new Error('Error al procesar la respuesta del servidor');
  }
}

//METODOS HTTP

export async function get<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return await handleResponse<T>(response);
  } catch (error) {
    console.error('Error inesperado en GET:', error);
    throw new Error('Error de conexión. Verifique su internet.');
  }
}

export async function post<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse<T>(response);
  } catch (error) {
    console.error('Error inesperado en POST:', error);
    throw new Error('Error de conexión. Verifique su internet.');
  }
}

export async function put<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse<T>(response);
  } catch (error) {
    console.error('Error inesperado en PUT:', error);
    throw new Error('Error de conexión. Verifique su internet.');
  }
}

export async function patch<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse<T>(response);
  } catch (error) {
    console.error('Error inesperado en PATCH:', error);
    throw new Error('Error de conexión. Verifique su internet.');
  }
}

export async function del<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'DELETE' });
    return await handleResponse<T>(response);
  } catch (error) {
    console.error('Error inesperado en DELETE:', error);
    throw new Error('Error de conexión. Verifique su internet.');
  }
}

// ===== HELPER: mapa de usuarios en memoria =====
// El backend no incluye el User relacionado en posts/comments,
// así que lo resolvemos acá: pedimos todos los users una vez
// y los "pegamos" por userId. Se cachea 30s para no golpear
// /users en cada render.

let usersCache: User[] | null = null;
let usersCacheTime = 0;
const USERS_CACHE_MS = 30_000;

async function getUsersMap(): Promise<Map<number, User>> {
  const now = Date.now();
  if (!usersCache || now - usersCacheTime > USERS_CACHE_MS) {
    usersCache = await get<User[]>('/users');
    usersCacheTime = now;
  }
  // Normalizamos a Number: si el backend manda id como string,
  // el Map no matchea contra userId numérico (o viceversa).
  return new Map(usersCache.map((u) => [Number(u.id), u]));
}

function attachUserToPost(post: Post, usersMap: Map<number, User>): Post {
  const fk = (post as any).UserId ?? post.userId;
  return {
    ...post,
    user: post.user ?? usersMap.get(Number(fk)),
  };
}

function attachUserToComment(comment: Comment, usersMap: Map<number, User>): Comment {
  const fk = (comment as any).UserId ?? comment.userId;
  return {
    ...comment,
    user: comment.user ?? usersMap.get(Number(fk)),
  };
}

// El backend tampoco incluye las imágenes en /posts, así que las
// pedimos aparte (igual que con el usuario) y las pegamos.
async function attachImagesToPost(post: Post): Promise<Post> {
  if (post.images && post.images.length > 0) {
    return post;
  }
  try {
    const images = await get<PostImage[]>(`/postimages/post/${post.id}`);
    return { ...post, images };
  } catch (error) {
    console.error(`Error al cargar imágenes del post ${post.id}:`, error);
    return { ...post, images: [] };
  }
}

// El backend manda "Tags" como array de objetos {id, name, ...}
// (por la relación belongsToMany), pero el frontend espera
// "tags" como array de strings. Normalizamos acá.
function normalizeTags(post: Post): Post {
  if (post.tags && post.tags.length > 0) {
    return post;
  }
  const rawTags = (post as any).Tags;
  if (Array.isArray(rawTags)) {
    return { ...post, tags: rawTags.map((t: any) => t.name) };
  }
  return post;
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
  getAll: async () => {
    const [posts, usersMap] = await Promise.all([
      get<Post[]>('/posts'),
      getUsersMap(),
    ]);
    const withUser = posts.map((p) => normalizeTags(attachUserToPost(p, usersMap)));
    return Promise.all(withUser.map(attachImagesToPost));
  },
  getById: async (id: number) => {
    const [post, usersMap] = await Promise.all([
      get<Post>(`/posts/${id}`),
      getUsersMap(),
    ]);
    const withUser = normalizeTags(attachUserToPost(post, usersMap));
    return attachImagesToPost(withUser);
  },
  getByUser: async (userId: number) => {
    const [posts, usersMap] = await Promise.all([
      get<Post[]>(`/posts?userId=${userId}`),
      getUsersMap(),
    ]);
    const withUser = posts.map((p) => normalizeTags(attachUserToPost(p, usersMap)));
    return Promise.all(withUser.map(attachImagesToPost));
  },
  create: (postData: { description: string; userId: number; tagIds?: number[] }) =>
    post<Post>('/posts', postData),
};

// COMMENTS
export const commentsApi = {
  getByPost: async (postId: number) => {
    const [comments, usersMap] = await Promise.all([
      get<Comment[]>(`/comments/post/${postId}`),
      getUsersMap(),
    ]);
    return comments.map((c) => attachUserToComment(c, usersMap));
  },
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