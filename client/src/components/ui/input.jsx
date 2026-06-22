export function Input({ type = "text", placeholder, value, onChange, className }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`input px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`}
    />
  );
}
export function InputLabel({ children }) {
  return (
    <label className="text-sm font-medium text-gray-700">
      {children}
    </label>
  );
}
export function InputError({ children }) {
    return (
        <span className="text-red-500 text-sm">
        {children}
        </span>
    );
    }
export function InputGroup({ children, className }) {
    return (
        <div className={`flex items-center space-x-2 ${className || ""}`}>
        {children}
        </div>
    );
    }
export function InputGroupLabel({ children }) {
    return (
        <span className="text-sm font-medium text-gray-700">
            {children}
        </span>
    );
}
export function InputGroupControl({ children }) {
    return (
        <div className="flex items-center space-x-2">
            {children}
        </div>
    );
}
export function InputGroupControlItem({ children }) {
    return (
        <div className="flex items-center space-x-2">
            {children}
        </div>
    );
}
export function InputGroupControlLabel({ children }) {
    return (
        <span className="text-sm font-medium text-gray-700">
            {children}
        </span>
    );
}
export function InputDescription({ children }) {
    return (
        <span className="text-xs text-gray-500">
            {children}
        </span>
    );
}
export function InputRequired({ children }) {
    return (
        <span className="text-red-500 ml-1" aria-hidden="true">
            {children}
        </span>
    );
}
export function InputOptional({ children }) {
    return (
        <span className="text-gray-500 ml-1" aria-hidden="true">
            {children}
        </span>
    );
}