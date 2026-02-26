"use client";

import React, { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

// Extensiones adicionales
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { TableKit } from "@tiptap/extension-table";
import { Youtube } from "@tiptap/extension-youtube";
import { Twitch } from "@tiptap/extension-twitch";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextStyle } from "@tiptap/extension-text-style";

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

interface PostEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const uploadImageToS3 = async (file: File): Promise<string> => {
  console.log("Subiendo archivo:", file.name);
  return URL.createObjectURL(file);
};

const MenuBar = ({ editor }: { editor: any }) => {
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

export default function PostEditor({ content, onChange }: PostEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      CharacterCount,
      Table.configure({
        resizable: true, // Aquí sí debería reconocerlo correctamente
      }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({ width: 640, height: 480 }),
      Twitch,
      Image.configure({
        HTMLAttributes: {
          class:
            "rounded-lg shadow-md max-w-full mx-auto block my-6 border border-gray-100",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-orange-600 underline" },
      }),
      Placeholder.configure({ placeholder: "Escribe tu artículo..." }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-orange lg:prose-xl mx-auto focus:outline-none min-h-[500px] p-8 md:p-12 bg-white",
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
      <MenuBar editor={editor} />
      <div className="bg-white overflow-x-auto">
        <EditorContent editor={editor} />
      </div>
      <div className="bg-gray-50 p-2 px-6 text-[10px] text-gray-400 border-t flex justify-between uppercase tracking-widest font-bold">
        <span>Status: Ready</span>
        <span>{editor?.storage.characterCount.words()} Palabras</span>
      </div>
    </div>
  );
}
