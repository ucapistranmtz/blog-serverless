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

import { MenuBar } from "./menuBar";

interface RichTextEditorProps {
  content: string;
  authToken: string;
  onChange: (html: string) => void;
}

const OptimizedImage = Image.extend({
  renderHTML({ HTMLAttributes }) {
    const src = HTMLAttributes.src;

    // 1. Check if it's our S3/CloudFront image
    if (src && src.includes("/uploads/")) {
      // 2. Transform URL: uploads -> optimized AND remove extension
      // Example: .../uploads/my-photo.png -> .../optimized/my-photo
      const baseUrl = src
        .replace("/uploads/", "/optimized/")
        .replace(/\.(jpg|jpeg|png|webp|gif)$/i, ""); // Remove any extension

      // 3. Construct the responsive <picture> tag
      return [
        "picture",
        { class: "block my-6" },
        [
          "source",
          {
            srcset: `${baseUrl}-lg.webp`,
            media: "(min-width: 1024px)",
            type: "image/webp",
          },
        ],
        [
          "source",
          {
            srcset: `${baseUrl}-md.webp`,
            media: "(min-width: 640px)",
            type: "image/webp",
          },
        ],
        [
          "img",
          {
            ...HTMLAttributes,
            src: `${baseUrl}-lg.webp`, // <--- CAMBIO: Guardamos la LG como principal
            loading: "lazy",
            class:
              "rounded-lg shadow-md max-w-full mx-auto block border border-gray-100",
            onerror: `this.onerror=null; this.src='${src}';`,
          },
        ],
      ];
    }

    return ["img", HTMLAttributes];
  },
});

export default function RichTextEditor({
  content,
  authToken,
  onChange,
}: RichTextEditorProps) {
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
      OptimizedImage.configure({
        allowBase64: true,
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
      <MenuBar editor={editor} authToken={authToken} />
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
