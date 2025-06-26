
import { useState } from "react";

export function Select({ children, onValueChange }) {
  return <div className="relative">{children}</div>;
}

export function SelectTrigger({ children, className = "", onClick }) {
  return (
    <button
      onClick={onClick}
      className={`border border-gray-300 rounded-md px-3 py-2 text-sm text-left w-full ${className}`}
    >
      {children}
    </button>
  );
}

export function SelectContent({ children }) {
  return (
    <div className="absolute z-10 bg-white border mt-1 w-full rounded-md shadow-md">
      {children}
    </div>
  );
}

export function SelectItem({ children, value, onClick }) {
  return (
    <div
      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
      onClick={() => onClick(value)}
    >
      {children}
    </div>
  );
}

export function SelectValue({ placeholder }) {
  return <span className="text-gray-500 text-sm">{placeholder}</span>;
}