import React from 'react';
import '../styles/styles.css';

const SkeletonCard = () => (
  <div className="movie-card skeleton-card">
    <div className="skeleton skeleton-img" />
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-meta" />
  </div>
);

export default SkeletonCard;
