import React from "react";
import clsx from "clsx";

export function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-green-100 text-green-800",
    outline: "border border-gray-300 text-gray-700",
    success: "bg-green-200 text-green-800",
    warning: "bg-yellow-200 text-yellow-800",
  };

  return (
    <span
      className={clsx(
        "px-2 py-1 rounded-full text-xs font-semibold",
        variants[variant] || variants.default
      )}
    >
      {children}
    </span>
  );
}
