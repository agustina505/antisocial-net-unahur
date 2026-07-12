import React, { useState, useEffect } from 'react';
import { postsApi } from '../api/api';
import type { Post } from '../types';
import { PostFeed } from '../components/common/PostFeed';

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

  return (
    <div className="timeline">
      <div className="timeline-header">
        <h1>Inicio</h1>
      </div>
      <PostFeed posts={posts} loading={loading} error={error} />
    </div>
  );
};
