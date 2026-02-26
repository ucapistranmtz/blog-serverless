"use client";
import { useRef } from "react";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Link as LinkIcon,
  Undo,
  Redo,
  Table as TableIcon,
  Youtube as YoutubeIcon,
  Tv,
  Highlighter, // Nombre corregido
  Subscript as SubIcon,
  Superscript as SuperIcon,
  Quote,
} from "lucide-react";

import { uploadImageToS3 } from "../../../utils/uploadImage";

export const MenuBar = ({ editor }: { editor: any }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  if (!editor) return null;

  const addYoutubeVideo = () => {
    const url = prompt("Introduce la URL de YouTube");
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const addTwitchVideo = () => {
    const url = prompt("Introduce la URL de Twitch");
    if (url) editor.chain().focus().setTwitchVideo({ src: url }).run();
  };

  const Btn = ({ onClick, active, children, title }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded transition-all ${
        active
          ? "bg-orange-600 text-white shadow-sm"
          : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 bg-white/95 backdrop-blur-md p-2 border-b border-gray-200">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const url = await uploadImageToS3(file);
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
      />

      <div className="flex gap-1 pr-2 border-r">
        <Btn onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo size={18} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo size={18} />
        </Btn>
      </div>

      <div className="flex gap-1 px-2 border-r">
        <Btn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold size={18} />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic size={18} />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
        >
          <Code size={18} />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive("highlight")}
        >
          <Highlighter size={18} />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          active={editor.isActive("subscript")}
        >
          <SubIcon size={18} />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          active={editor.isActive("superscript")}
        >
          <SuperIcon size={18} />
        </Btn>
      </div>

      <div className="flex gap-1 px-2 border-r">
        <Btn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 size={18} />
        </Btn>
        <Btn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 size={18} />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List size={18} />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered size={18} />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          <Quote size={18} />
        </Btn>
      </div>

      <div className="flex gap-1 px-2">
        <Btn onClick={() => fileInputRef.current?.click()} title="Imagen">
          <ImageIcon size={18} />
        </Btn>
        <Btn onClick={addYoutubeVideo}>
          <YoutubeIcon size={18} />
        </Btn>
        <Btn onClick={addTwitchVideo}>
          <Tv size={18} />
        </Btn>
        <Btn
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          <TableIcon size={18} />
        </Btn>
      </div>
    </div>
  );
};
