
import ImageDialog from "./ImageDialog";

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const [showImageDialog, setShowImageDialog] = React.useState(false);
  if (!editor) return null;
  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "bg-blue-600 text-white px-2 py-1 rounded" : "px-2 py-1 rounded"} title="Tučně">
          <BoldIcon className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "bg-blue-600 text-white px-2 py-1 rounded" : "px-2 py-1 rounded"} title="Kurzíva">
          <ItalicIcon className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive("underline") ? "bg-blue-600 text-white px-2 py-1 rounded" : "px-2 py-1 rounded"} title="Podtržení">
          <UnderlineIcon className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "bg-blue-600 text-white px-2 py-1 rounded" : "px-2 py-1 rounded"} title="Seznam">
          <ListIcon className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "bg-blue-600 text-white px-2 py-1 rounded" : "px-2 py-1 rounded"} title="Číslovaný seznam">
          <OrderedListIcon className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => {
          const url = window.prompt("Vložte URL odkazu");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }} className={editor.isActive("link") ? "bg-blue-600 text-white px-2 py-1 rounded" : "px-2 py-1 rounded"} title="Odkaz">
          <LinkIcon className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => setShowImageDialog(true)} className={editor.isActive("image") ? "bg-blue-600 text-white px-2 py-1 rounded" : "px-2 py-1 rounded"} title="Obrázek">
          <ImageIcon className="w-5 h-5" />
        </button>
      </div>
      <ImageDialog
        open={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        onInsert={(src, alt) => {
          editor.chain().focus().setImage({ src, alt }).run();
        }}
      />
    </>
  );
};

export default Toolbar;
import * as React from "react";
import type { Editor } from "@tiptap/react";
import { BoldIcon, ItalicIcon, UnderlineIcon, ListIcon, OrderedListIcon, LinkIcon, ImageIcon } from "../Icons";
