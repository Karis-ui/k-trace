import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, description, variant }]);

    // auto-remove after 3s (optional)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return { toasts, toast };
}
