import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-brand-surface border border-brand-gray rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;