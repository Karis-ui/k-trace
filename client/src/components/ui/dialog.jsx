export function Dialog({ children, className }) {
  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ${className || ""}`}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {children}
      </div>
    </div>
  );
}
export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}   
export function DialogTitle({ children, className }) {
  return <h2 className={`text-xl font-bold ${className || ""}`}>{children}</h2>;
}
export function DialogContent({ children, className }) {
  return <div className={`text-gray-700 ${className || ""}`}>{children}</div>;
}   
export function DialogFooter({ children }) {
  return <div className="mt-4 flex justify-end space-x-2">{children}</div>;
}
export function DialogButton({ onClick, children, className }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors ${className || ""}`}
    >
      {children}
    </button>
  );
}
export function DialogTrigger({ onClick, children, className }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors ${className || ""}`}
    >
      {children}
    </button>
  );
}
export function DialogClose({ onClick, children, className }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors ${className || ""}`}
    >
      {children}
    </button>
  );
}   
export function DialogOverlay({ onClick, className }) {
  return (
    <div
      onClick={onClick}
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 ${className || ""}`}
    />
  );
}