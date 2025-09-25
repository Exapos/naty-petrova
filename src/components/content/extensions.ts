
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TypographyExtension from "@tiptap/extension-typography";
import UnderlineExtension from "@tiptap/extension-underline";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Dropcursor from "@tiptap/extension-dropcursor";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import Code from "@tiptap/extension-code";
import TextAlign from "@tiptap/extension-text-align";
import Focus from "@tiptap/extension-focus";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Image from "@tiptap/extension-image";

export const extensions = [
  StarterKit,
  Subscript,
  Superscript,
  Highlight,
  TypographyExtension,
  UnderlineExtension,
  Document,
  Paragraph,
  Text,
  Dropcursor,
  Code,
  Link,
  CharacterCount,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Focus.configure({ className: "has-focus", mode: "all" }),
  Image,
];
