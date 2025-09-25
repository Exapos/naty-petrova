import React, { useState } from "react";

export default function ImageDialog({ open, onClose, onInsert }: { open: boolean; onClose: () => void; onInsert: (src: string, alt: string) => void }) {
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");

  function handleInsert(e: React.FormEvent) {
    e.preventDefault();
    if (src) {
      onInsert(src, alt);
      setSrc("");
      setAlt("");
      onClose();
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form onSubmit={handleInsert} className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Vložit obrázek</h2>
        <input
          type="url"
          placeholder="URL obrázku"
          className="w-full mb-3 px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
          value={src}
          onChange={e => setSrc(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Popisek (alt)"
          className="w-full mb-4 px-3 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
          value={alt}
          onChange={e => setAlt(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200">Zrušit</button>
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-bold">Vložit</button>
        </div>
      </form>
    </div>
  );
}
