// components/ui/select.jsx
import { useState, createContext, useContext } from "react";

const SelectContext = createContext();

export function Select({ children, onValueChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const handleValueChange = (value) => {
    setSelectedValue(value);
    onValueChange?.(value);
    setIsOpen(false); // close dropdown after selection
  };

  return (
    <SelectContext.Provider
      value={{ isOpen, setIsOpen, selectedValue, onValueChange: handleValueChange }}
    >
      <div className="relative w-full">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className = "" }) {
  const { isOpen, setIsOpen, selectedValue } = useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={`border border-gray-300 rounded-md px-3 py-2 text-sm text-left w-full ${className}`}
    >
      {selectedValue || <span className="text-gray-500">Select...</span>}
    </button>
  );
}

export function SelectContent({ children }) {
  const { isOpen } = useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <div className="absolute z-10 bg-white border mt-1 w-full rounded-md shadow-md">
      {children}
    </div>
  );
}

export function SelectItem({ children, value }) {
  const { onValueChange } = useContext(SelectContext);

  return (
    <div
      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
      onClick={() => onValueChange?.(value)}
    >
      {children}
    </div>
  );
}

// Deprecated: kept only for placeholder compatibility if you still use it
export function SelectValue({ placeholder }) {
  return <span className="text-gray-500 text-sm">{placeholder}</span>;
}
