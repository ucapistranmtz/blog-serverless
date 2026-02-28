"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/app/components/post/editor/richTextEditor";
import {
  CreatePostInput,
  CreatePostSchema,
} from "@/app/types/createPost.schema";
import { calculateReadingTime } from "@/app/utils/readingTime";
import { extractFirstImageUrl } from "@/app/utils/extractImageUrl";
import { useCreatePost } from "@/app/hooks/useCreatePost";
import { ZodError } from "zod";
import { ulid } from "ulid";

const CACHE_KEY = "blog_post_draft";

export default function NewPostForm() {
  const { user, token } = useAuth();
  const isAdmin = user?.groups.includes("admins");
  const router = useRouter();
  const { createPost, isUploading, error: apiError, success } = useCreatePost();
  const isExcerptDirty = useRef(false);
  const isSlugDirty = useRef(false);
  const [isRestored, setIsRestored] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: ``,
    tags: ["general"],
  });

  useEffect(() => {
    if (!isSlugDirty.current && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title]);

  useEffect(() => {
    const savedDraft = localStorage.getItem(CACHE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed);
        if (parsed.excerpt) isExcerptDirty.current = true;
        if (parsed.slug) isSlugDirty.current = true;
        console.log("Draft restored from cache 📦");
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
    setIsRestored(true);
  }, []);

  useEffect(() => {
    if (!isRestored) return; // <--- NO guardes nada si no hemos terminado de cargar el borrador anterior

    const timeoutId = setTimeout(() => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(formData));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData, isRestored]);

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
      const readingTime = calculateReadingTime(formData.content);
      const id = ulid();

      const firstImage = extractFirstImageUrl(formData.content);
      const rawPayload = {
        ...formData,
        id,
        readingTime,
        date: new Date().toISOString(),
        imageUrl: firstImage || "/board.png",
        authorId: user?.id ?? "",
        author: user?.name ?? "Unknown",
      };
      const validatedPayload = CreatePostSchema.parse(rawPayload);

      const result = await createPost(validatedPayload);
      if (result) {
        localStorage.removeItem(CACHE_KEY);
        alert("🚀 Post published successfully!");
        router.push("/");
      }
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
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
          <strong>Error:</strong> {apiError}
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 mb-8">
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
          authToken={token ? token : ""}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isUploading}
        className={`mt-8 w-full font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2
          ${
            isUploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
          }`}
      >
        {isUploading ? (
          <>
            <span className="animate-spin text-xl">🌀</span> Publishing...
          </>
        ) : (
          "🚀 Publish Post"
        )}
      </button>
      {success && (
        <p className="mt-4 text-center text-green-600 font-medium italic">
          Redirecting to home...
        </p>
      )}
    </div>
  );
}
