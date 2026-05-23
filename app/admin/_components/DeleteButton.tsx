'use client';

export function DeleteButton({ label = 'Delete' }: { label?: string }) {
  return (
    <button
      type="submit"
      className="text-xs text-red-400 hover:text-red-300"
      onClick={(e) => {
        if (!confirm('Delete this item? This cannot be undone.')) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
