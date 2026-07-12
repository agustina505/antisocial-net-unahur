import React from 'react';
import type { Post } from '../../types';
import { PostCard } from './PostCard';

interface PostFeedProps {
  posts: Post[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
}

export const PostFeed: React.FC<PostFeedProps> = ({
  posts,
  loading,
  error,
  emptyMessage = 'No hay publicaciones aún. ¡Sé el primero en publicar!',
}) => {
  if (loading) {
    return <div className="timeline-status">Cargando publicaciones...</div>;
  }

  if (error) {
    return <div className="timeline-status">❌ {error}</div>;
  }

  if (posts.length === 0) {
    return <div className="timeline-empty">{emptyMessage}</div>;
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};