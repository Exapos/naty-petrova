'use client';
import BlogEditor from "@/components/BlogEditor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [post, setPost] = useState<{ title: string; slug: string; content: string } | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    params.then(resolved => {
      setResolvedParams(resolved);
      fetch(`/api/blog/${resolved.id}`)
        .then(res => res.json())
        .then(data => setPost({ title: data.title, slug: data.slug, content: data.content }))
        .catch(() => setError("Nepodařilo se načíst článek."))
        .finally(() => setLoading(false));
    });
  }, [params]);

  async function handleSave(data: { title: string; slug: string; content: string }) {
    if (!resolvedParams) return;
    setSaving(true);
    setError("");
    const res = await fetch(`/api/blog/${resolvedParams.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/admin/blog");
    } else {
      const err = await res.json();
      setError(err.error || "Chyba při ukládání");
    }
    setSaving(false);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Načítání…</div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">Článek nenalezen</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-fuchsia-300 to-pink-400 dark:from-zinc-900 dark:via-indigo-900 dark:to-zinc-800 px-4 py-10">
      <div className="max-w-2xl w-full bg-white/90 dark:bg-zinc-900/90 shadow-2xl rounded-2xl p-8 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Upravit článek</h1>
        <BlogEditor initial={post} onSave={handleSave} loading={saving} submitLabel="Uložit změny" />
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </div>
  );
}
