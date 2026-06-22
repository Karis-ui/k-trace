export default function Avatar({ src, alt, className }) {
  return (
    <img
      src={src}
        alt={alt}
        className={`rounded-full object-cover ${className || ""}`}
    />
  );
}
export function AvatarGroup({ children, className }) {
  return (
    <div className={`flex items-center space-x-2 ${className || ""}`}>
      {children}
    </div>
  );
}
export function AvatarBadge({ children, variant = "default" }) {
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
export function AvatarFallback({ children, className }) {       
  return (
    <div className={`flex items-center justify-center rounded-full bg-gray-300 text-gray-700 ${className || ""}`}>
      {children}
    </div>
  );
}   
export function Users ({ children, className }) {
  return (
    <div className={`flex items-center space-x-2 ${className || ""}`}>
      {children}
    </div>
  );
}