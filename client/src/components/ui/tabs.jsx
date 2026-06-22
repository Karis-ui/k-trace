export function Tabs({ children, className }) {
  return (
    <div className={`tabs ${className || ""}`}>
      {children}
    </div>
  );
}
export function TabsList({ children, className }) {
    return (
        <div className={`tabs-list flex space-x-4 ${className || ""}`}>
        {children}
        </div>
    );
    }
export function TabsTrigger({ children, className, onClick }) {
    return (
        <button
            className={`tabs-trigger px-4 py-2 rounded-md hover:bg-gray-100 ${className || ""}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
export function TabsContent({ children, className }) {
    return (
        <div className={`tabs-content p-4 bg-white rounded-md shadow-sm ${className || ""}`}>
            {children}
        </div>
    );
}
export function TabsPanel({ children, className }) {
    return (
        <div className={`tabs-panel ${className || ""}`}>
            {children}
        </div>
    );
}
export function TabsBadge({ children, variant = "default" }) {
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