export function Label({ children, className }) {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className || ""}`}>
      {children}
    </label>
  );
}
export function label({ htmlFor, children, className }) {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className || ""}`}>
      {children}
    </label>
  );
}
export function LabelText({ children, className }) {
  return (
    <span className={`text-sm text-gray-600 ${className || ""}`}>
      {children}
    </span>
  );
}
export function LabelRequired({ children }) {
  return (
    <span className="text-red-500 ml-1" aria-hidden="true">
      {children}
    </span>
  );
}
export function LabelOptional({ children }) {
  return (
    <span className="text-gray-500 ml-1" aria-hidden="true">
      {children}
    </span>
  );
}
export function LabelError({ children }) {
  return (
    <span className="text-red-500 text-sm mt-1">
      {children}
    </span>
  );
}