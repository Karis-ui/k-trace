export function Switch({ checked, onCheckedChange, className }) {
  return (
    <button
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out ${checked ? 'bg-blue-600' : 'bg-gray-200'} ${className}`}
      onClick={() => onCheckedChange(!checked)}
    >
      <span
        className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-md transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
}
export function SwitchLabel({ children }) {
    return (
        <span className="text-sm font-medium text-gray-700">
        {children}
        </span>
    );
    }
export function SwitchDescription({ children }) {
    return (
        <span className="text-xs text-gray-500">
            {children}
        </span>
    );
}
export function SwitchGroup({ children, className }) {
    return (
        <div className={`flex items-center space-x-4 ${className}`}>
            {children}
        </div>
    );
}
export function SwitchGroupItem({ children, className }) {
    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            {children}
        </div>
    );
}
export function SwitchGroupLabel({ children }) {
    return (
        <span className="text-sm font-medium text-gray-700">
            {children}
        </span>
    );
}
export function SwitchGroupDescription({ children }) {
    return (
        <span className="text-xs text-gray-500">
            {children}
        </span>
    );
}
export function SwitchGroupControl({ children }) {
    return (
        <div className="flex items-center space-x-2">
            {children}
        </div>
    );
}
export function SwitchGroupControlItem({ children }) {
    return (
        <div className="flex items-center space-x-2">
            {children}
        </div>
    );
}
export function SwitchGroupControlLabel({ children }) {
    return (
        <span className="text-sm font-medium text-gray-700">
            {children}
        </span>
    );
}
export function SwitchGroupControlDescription({ children }) {
    return (
        <span className="text-xs text-gray-500">
            {children}
        </span>
    );
}