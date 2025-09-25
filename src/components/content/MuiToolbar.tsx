
import * as React from "react";
import { Editor } from "@tiptap/react";
import { Paper, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";
import MuiImageDialog from "./MuiImageDialog";


export default function MuiToolbar({ editor }: { editor: Editor | null }) {
  const [showImageDialog, setShowImageDialog] = React.useState(false);
  const [activeMarks, setActiveMarks] = React.useState<{ [key: string]: boolean }>({});

  if (!editor) return null;

  const handleMark = (mark: string, toggleFn: () => void) => {
    toggleFn();
    setActiveMarks((prev) => ({ ...prev, [mark]: !prev[mark] }));
  };

  return (
    <>
      <Paper elevation={1} sx={{ display: "flex", flexWrap: "wrap", mb: 2, p: 1, borderRadius: 2 }}>
        <ToggleButtonGroup size="small" exclusive>
          <ToggleButton value="bold" selected={activeMarks.bold || editor.isActive("bold")} onClick={() => handleMark("bold", () => editor.chain().focus().toggleBold().run())}><Tooltip title="Tučně"><FormatBoldIcon /></Tooltip></ToggleButton>
          <ToggleButton value="italic" selected={activeMarks.italic || editor.isActive("italic")} onClick={() => handleMark("italic", () => editor.chain().focus().toggleItalic().run())}><Tooltip title="Kurzíva"><FormatItalicIcon /></Tooltip></ToggleButton>
          <ToggleButton value="underline" selected={activeMarks.underline || editor.isActive("underline")} onClick={() => handleMark("underline", () => editor.chain().focus().toggleUnderline().run())}><Tooltip title="Podtržení"><FormatUnderlinedIcon /></Tooltip></ToggleButton>
          <ToggleButton value="bulletList" selected={activeMarks.bulletList || editor.isActive("bulletList")} onClick={() => handleMark("bulletList", () => editor.chain().focus().toggleBulletList().run())}><Tooltip title="Seznam"><FormatListBulletedIcon /></Tooltip></ToggleButton>
          <ToggleButton value="orderedList" selected={activeMarks.orderedList || editor.isActive("orderedList")} onClick={() => handleMark("orderedList", () => editor.chain().focus().toggleOrderedList().run())}><Tooltip title="Číslovaný seznam"><FormatListNumberedIcon /></Tooltip></ToggleButton>
          <ToggleButton value="link" selected={activeMarks.link || editor.isActive("link")} onClick={() => {
            const url = window.prompt("Vložte URL odkazu");
            if (url) {
              handleMark("link", () => editor.chain().focus().setLink({ href: url }).run());
            }
          }}><Tooltip title="Odkaz"><LinkIcon /></Tooltip></ToggleButton>
          <ToggleButton value="image" selected={activeMarks.image || editor.isActive("image")} onClick={() => setShowImageDialog(true)}><Tooltip title="Obrázek"><ImageIcon /></Tooltip></ToggleButton>
        </ToggleButtonGroup>
      </Paper>
      <MuiImageDialog
        open={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        onInsert={(src, alt) => {
          editor.chain().focus().setImage({ src, alt }).run();
        }}
      />
    </>
  );
}
