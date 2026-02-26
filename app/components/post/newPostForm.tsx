"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/app/components/post/editor/richTextEditor";
import { CreatePostSchema } from "@/app/types/createPost.schema";
import { calculateReadingTime } from "@/app/utils/readingTime";
import { ZodError } from "zod";

export default function NewPostForm() {
  const { user } = useAuth();
  const isAdmin = user?.groups.includes("admins");
  const router = useRouter();

  // Ref para saber si el usuario editó el excerpt manualmente
  const isExcerptDirty = useRef(false);
  const isSlugDirty = useRef(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: ``,
    tags: ["general"],
  });

  // 1. Efecto para generar el SLUG automáticamente a partir del Título
  useEffect(() => {
    if (!isSlugDirty.current && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
        .replace(/[^a-z0-9 -]/g, "") // Quitar caracteres raros
        .replace(/\s+/g, "-") // Espacios por guiones
        .replace(/-+/g, "-"); // Evitar guiones dobles

      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title]);

  // 2. Lógica para el Excerpt desde el Editor
  const handleEditorUpdate = (html: string) => {
    setFormData((prev) => {
      const newData = { ...prev, content: html };

      // Si el usuario NO ha escrito manualmente en el excerpt, lo autogeneramos
      if (!isExcerptDirty.current) {
        const plainText = html
          .replace(/<[^>]*>/g, " ") // Quitar etiquetas
          .replace(/\s+/g, " ") // Limpiar espacios
          .trim()
          .substring(0, 160);

        newData.excerpt = plainText;
      }
      return newData;
    });
  };

  const handleSubmit = async () => {
    try {
      // Calculamos el tiempo de lectura justo antes de validar
      const readingTime = calculateReadingTime(formData.content);

      const payload = {
        ...formData,
        readingTime,
        date: new Date().toISOString(), // Zod 4 espera formato ISO
      };

      // Validamos con Zod
      const validated = CreatePostSchema.parse(payload);

      console.log("Payload listo para la Lambda:", validated);

      // const res = await fetch('/api/posts', { method: 'POST', body: JSON.stringify(validated) });
      alert("Post validado correctamente. Listo para subir a AWS!");
    } catch (err: any) {
      if (err instanceof ZodError) {
        const messages = err.issues
          .map((i) => `${i.path}: ${i.message}`)
          .join("\n");
        alert("Validation Errors:\n" + messages);
      } else {
        alert("Error: " + (err.message || "Unknown error"));
      }
    }
  };

  if (!isAdmin) return <div className="p-20 text-center">No access 🙅‍♂️</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 text-black bg-white min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">
        Create New Post
      </h1>

      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Title
          </label>
          <input
            value={formData.title}
            placeholder="You know how to code? so teach them"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Slug (URL)
          </label>
          <input
            value={formData.slug}
            placeholder="url-del-post"
            className="w-full p-3 border rounded-lg bg-gray-50 text-gray-600 font-mono text-sm"
            onChange={(e) => {
              isSlugDirty.current = true;
              setFormData({ ...formData, slug: e.target.value });
            }}
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Excerpt (SEO Description) - {formData.excerpt.length}/160
          </label>
          <textarea
            value={formData.excerpt}
            placeholder="Resumen para Google..."
            className="w-full p-3 border rounded-lg h-24 resize-none focus:ring-2 focus:ring-orange-500 outline-none"
            onChange={(e) => {
              isExcerptDirty.current = true;
              setFormData({ ...formData, excerpt: e.target.value });
            }}
          />
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden shadow-sm">
        <RichTextEditor
          content={formData.content}
          onChange={handleEditorUpdate}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-8 w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 active:scale-[0.98] transition-all shadow-lg"
      >
        🚀 Publish Post
      </button>
    </div>
  );
}
