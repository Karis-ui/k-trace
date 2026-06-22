export function Select() {
    return (
        <select className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
        </select>
    );
    }
export function SelectLabel({ children }) {
    return (
        <label className="text-sm font-medium text-gray-700">
            {children}
        </label>
    );
}
export function SelectError({ children }) {
    return (
        <span className="text-red-500 text-sm">
            {children}
        </span>
    );
}
export function SelectGroup({ children, className }) {
    return (
        <div className={`flex items-center space-x-2 ${className || ""}`}>
            {children}
        </div>
    );
}
export function SelectGroupLabel({ children }) {
    return (
        <span className="text-sm font-medium text-gray-700">
            {children}
        </span>
    );
}
export function SelectGroupControl({ children }) {
    return (
        <div className="flex items-center space-x-2">
            {children}
        </div>
    );
}
export function SelectGroupControlItem({ children }) {
    return (
        <div className="flex items-center space-x-2">
            {children}
        </div>
    );
}
export function SelectGroupControlLabel({ children }) {
    return (
        <span className="text-sm font-medium text-gray-700">
            {children}
        </span>
    );
}
export function SelectDescription({ children }) {
    return (
        <span className="text-xs text-gray-500">
            {children}
        </span>
    );
}
export function SelectRequired({ children }) {
    return (
        <span className="text-red-500 ml-1" aria-hidden="true">
            {children}
        </span>
    );
}
export function SelectOptional({ children }) {
    return (
        <span className="text-gray-500 ml-1" aria-hidden="true">
            {children}
        </span>
    );
}
export function SelectTrigger({ children, className }) {
    return (
        <button
            className={`px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors ${className || ""}`}
        >
            {children}
        </button>
    );
}
export function SelectContent({ children, className }) {
    return (
        <div className={`bg-white border rounded-md shadow-lg ${className || ""}`}>
            {children}
        </div>
    );
}
export function SelectItem({ value, children, className }) {
    return (
        <option value={value} className={`p-2 hover:bg-gray-100 ${className || ""}`}>
            {children}
        </option>
    );
}
export function SelectGroupHeader({ children }) {
    return (
        <div className="px-4 py-2 bg-gray-100 text-gray-700 font-medium">
            {children}
        </div>
    );
}   
export function SelectGroupFooter({ children }) {
    return (
        <div className="px-4 py-2 bg-gray-100 text-gray-700 font-medium">
            {children}
        </div>
    );
}
export function SelectGroupItem({ children, className }) {
    return (
        <div className={`p-2 hover:bg-gray-100 ${className || ""}`}>
            {children}
        </div>
    );
}
export function SelectGroupItemLabel({ children }) {
    return (
        <span className="text-sm font-medium text-gray-700">
            {children}
        </span>
    );
}
export function SelectGroupItemDescription({ children }) {
    return (
        <span className="text-xs text-gray-500">
            {children}
        </span>
    );
}
export function SelectGroupItemIcon({ icon }) {
    return (
        <span className="inline-block mr-2">
            {icon}
        </span>
    );
}
export function SelectGroupItemAction({ children, className }) {
    return (
        <button
            className={`px-2 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors ${className || ""}`}
        >
            {children}
        </button>
    );
}
export function SelectValue({ value, className }) {
    return (
        <span className={`text-sm text-gray-700 ${className || ""}`}>
            {value}
        </span>
    );
}