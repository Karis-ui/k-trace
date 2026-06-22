import React from "react";

export function Card({ children, className }) {
  return (
    <div className={`rounded-lg border shadow-sm p-4 bg-white ${className || ""}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return <div className="mb-2">{children}</div>;
}

export function CardTitle({ children, className }) {
  return <h3 className={`font-bold text-lg ${className || ""}`}>{children}</h3>;
}

export function CardContent({ children, className }) {
  return <div className={className}>{children}</div>;
}

export function CardDescription({ children }) {
  return <p className="text-sm text-gray-500">{children}</p>;

}
export function CardFooter({ children }) {
  return <div className="mt-4">{children}</div>;
}
export function CardImage({ src, alt, className }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-lg object-cover ${className || ""}`}
    />
  );
}
export function CardActions({ children }) {
  return (
    <div className="flex items-center justify-between mt-4">
      {children}
    </div>
  );
}
export function CardBadge({ children, variant = "default" }) {
  const variantClasses = {
    default: "bg-gray-200 text-gray-800",
    primary: "bg-blue-500 text-white",
    secondary: "bg-green-500 text-white",
    danger: "bg-red-500 text-white",
  };

  return (
    <span className={`px-2 py-1 rounded ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
export function CardLink({ href, children, className }) {
  return (
    <a
      href={href}
      className={`text-blue-600 hover:underline ${className || ""}`}
    >
      {children}
    </a>
  );
}