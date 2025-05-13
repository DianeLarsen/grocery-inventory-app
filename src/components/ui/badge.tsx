import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, className = "", ...props }) => (
  <span
    className={`inline-block rounded-full bg-muted px-2 py-1 text-xs font-medium ${className}`}
    {...props}
  >
    {children}
  </span>
);

export default Badge;
