import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../../types';

interface PostCardProps {
  post: Post;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
};

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const nick = post.user?.nickName || 'usuario';

  return (
    <Link to={`/post/${post.id}`} className="post-card">
      <div className="avatar avatar-md">{nick.charAt(0).toUpperCase()}</div>

      <div className="post-card-body">
        <div className="post-card-header">
          <span className="post-card-name">{post.user?.name || nick}</span>
          <span className="post-card-handle">@{nick}</span>
          {post.createdAt && <span className="post-card-date">· {formatDate(post.createdAt)}</span>}
        </div>

        <p className="post-card-text">{post.description}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="post-card-tags">
            {post.tags.map((tag, i) => (
              <span key={i} className="post-tag">#{tag}</span>
            ))}
          </div>
        )}

        {post.images && post.images.length > 0 && (
          <div className="post-card-images">
            {post.images.map((img, i) => (
              <img key={i} src={img.url} alt="" />
            ))}
          </div>
        )}

        <div className="post-card-footer">
          <span className="post-card-footer-item">
            💬 {post.comments?.length || 0}
          </span>
        </div>
      </div>
    </Link>
  );
};