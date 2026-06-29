export interface User {
  id: number;
  nickName: string;
  name?: string;
  email?: string;
  createdAt?: string;
}

export interface Post {
  id: number;
  description: string;
  userId: number;
  tags?: string[];
  createdAt?: string;
  images?: PostImage[];
  comments?: Comment[];
  user?: User;
}

export interface PostImage {
  id: number;
  url: string;
  postId: number;
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  userId: number;
  createdAt?: string;
  user?: User;
}

export interface Tag {
  id: number;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}