import React from "react";

export function Sidebar({ children, className }) {
  return (
    <div className={`rounded-lg border shadow-sm p-4 bg-white ${className || ""}`}>
      {children}
    </div>
  );
}

export function SidebarContent({ children }) {
  return <div className="mb-2">{children}</div>;
}

export function SidebarGroup({ children, className }) {
  return <h3 className={`font-bold text-lg ${className || ""}`}>{children}</h3>;
}

export function SidebarGroupContent({ children, className }) {
  return <div className={className}>{children}</div>;
}

export function SidebarGroupLabel({ children }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}
export function SidebarMenu({ children }) {
  return <ul className="space-y-2">{children}</ul>;
}
export function SidebarMenuItem({ children }) {
  return <li className="flex items-center">{children}</li>;
}
export function SidebarMenuButton({ children, asChild }) {
  return (
    <button className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md">
      {children}
    </button>
  );
}
export function SidebarTrigger({ children }) {
  return (
    <button className="p-2 hover:bg-gray-100 rounded-md">
      {children}
    </button>
  );
}
export function useSidebar() {
  return { state: { isOpen: true } };
}