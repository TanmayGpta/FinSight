export function Button({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium ${className}`}
    >
      {children}
    </button>
  );
}