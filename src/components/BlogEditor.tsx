"use client";
import React, { useState } from "react";
import EditorComponent from "./content";
import MuiEditorThemeProvider from "./MuiEditorThemeProvider";

type Props = {
	initial?: { title: string; slug: string; content: string };
	onSave: (data: { title: string; slug: string; content: string }) => void;
	loading?: boolean;
	submitLabel?: string;
};

export default function BlogEditor({ initial, onSave, loading, submitLabel = "Uložit" }: Props) {
	const [title, setTitle] = useState(initial?.title || "");
	const [slug, setSlug] = useState(initial?.slug || "");
	const [content, setContent] = useState(initial?.content || "<p></p>");

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		onSave({ title, slug, content });
	}

		return (
			<MuiEditorThemeProvider>
				<form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
					<div>
						<label style={{ fontWeight: 500, marginBottom: 4, display: "block" }}>Titulek</label>
						<input
							type="text"
							style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #d1d5db", fontSize: 16, marginBottom: 8 }}
							value={title}
							onChange={e => setTitle(e.target.value)}
							required
						/>
					</div>
					<div>
						<label style={{ fontWeight: 500, marginBottom: 4, display: "block" }}>Slug (URL)</label>
						<input
							type="text"
							style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #d1d5db", fontSize: 16, marginBottom: 8 }}
							value={slug}
							onChange={e => setSlug(e.target.value)}
							required
						/>
					</div>
					<div>
						<label style={{ fontWeight: 500, marginBottom: 4, display: "block" }}>Obsah</label>
						<EditorComponent content={content} onChange={setContent} />
					</div>
					<button
						type="submit"
						style={{ padding: "12px 32px", borderRadius: 8, background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 16, border: 0, boxShadow: "0 2px 8px #2563eb22", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
						disabled={loading}
					>
						{loading ? "Ukládám…" : submitLabel}
					</button>
				</form>
			</MuiEditorThemeProvider>
		);
}
