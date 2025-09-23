"use client";
import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

const AdminBlogPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const editor = useEditor({
    extensions: [StarterKit, Image, Link],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Zde bude logika pro odeslání článku na backend
    alert(`Název: ${title}\nObsah: ${content}`);
  };

  return (
    <main>
      <h1>Admin Blog Editor (TipTap)</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 700 }}>
        <input
          type="text"
          placeholder="Název článku"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: 16, padding: 8 }}
          required
        />
        <div style={{ marginBottom: 16, border: "1px solid #ccc", borderRadius: 4 }}>
          <EditorContent editor={editor} style={{ minHeight: 200, padding: 8 }} />
        </div>
        <button type="submit" style={{ padding: "8px 24px" }}>
          Uložit článek
        </button>
      </form>
    </main>
  );
};

export default AdminBlogPage;
