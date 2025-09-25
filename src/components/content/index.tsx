"use client";
import React from "react";
import {
  useEditor,
  EditorContent,
} from "@tiptap/react";
import { extensions } from "./extensions";

import MuiToolbar from "./MuiToolbar";
import EditorStyled from "./style";



export default function EditorComponent({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) {
  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <EditorStyled>
  <MuiToolbar editor={editor} />
      <EditorContent editor={editor} />
    </EditorStyled>
  );
}
