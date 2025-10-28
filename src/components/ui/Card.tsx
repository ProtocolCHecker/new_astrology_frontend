import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'cosmic' | 'glass' | 'solid';
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'cosmic',
  hoverable = true 
}) => {
  const baseClasses = 'rounded-xl transition-all duration-300';
  
  const variantClasses = {
    cosmic: 'bg-cosmic-dark/40 backdrop-blur-md border border-purple-500/20 shadow-lg',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl',
    solid: 'bg-cosmic-dark border border-purple-500/30 shadow-xl'
  };

  const hoverClasses = hoverable ? 'hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-400/30 hover:scale-105' : '';

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hoverable ? { y: -5 } : undefined}
    >
      {children}
    </motion.div>
  );
};

export default Card;