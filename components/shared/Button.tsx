import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

  const variantClasses = {
    primary: 'bg-brand-primary text-white hover:bg-blue-600 focus:ring-blue-300 shadow-md hover:shadow-lg',
    secondary: 'bg-brand-secondary text-white hover:bg-green-600 focus:ring-green-300 shadow-md hover:shadow-lg',
    ghost: 'bg-transparent text-brand-muted hover:bg-gray-200 hover:text-brand-dark focus:ring-gray-300',
  };

  const sizeClasses = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-2.5 px-5 text-base',
    lg: 'py-3 px-8 text-lg uppercase tracking-wider',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;