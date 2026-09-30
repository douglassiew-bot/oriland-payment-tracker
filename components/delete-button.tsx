"use client";

export function DeleteButton({ label = "Delete" }: { label?: string }) {
  return <button className="text-button danger" type="submit" onClick={(event) => { if (!window.confirm("Delete this item? This cannot be undone.")) event.preventDefault(); }}>{label}</button>;
}
