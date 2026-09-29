import React from 'react';

const Card = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[var(--border-color)] rounded-2xl p-5 shadow-2xs transition-all duration-150 ${
        hoverable ? 'hover:border-slate-300 hover:shadow-xs cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
