"use client";
import BlogEditor from "@/components/BlogEditor";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(data: { title: string; slug: string; content: string }) {
    setLoading(true);
    setError("");
    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/admin/blog");
    } else {
      const err = await res.json();
      setError(err.error || "Chyba při ukládání");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-fuchsia-300 to-pink-400 dark:from-zinc-900 dark:via-indigo-900 dark:to-zinc-800 px-4 py-10">
      <div className="max-w-2xl w-full bg-white/90 dark:bg-zinc-900/90 shadow-2xl rounded-2xl p-8 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Nový článek</h1>
        <BlogEditor onSave={handleSave} loading={loading} submitLabel="Vytvořit" />
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </div>
  );
}
