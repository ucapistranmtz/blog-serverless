"use client";

import Link from "next/link";
import { PostCard } from "../post/PostCard";
import { type PostCard as Post } from "../../types/postCard.schema"; // Importa tu tipo
import { usePosts } from "@/app/hooks/usePosts";

export const PostGrid = () => {
  // 1. Consumimos todo directamente del hook.
  // No necesitamos useState locales aquí.
  const { postCards, isLoading, hasMore, error, loadMore } = usePosts(6);

  // 2. Estado de carga inicial (cuando no hay posts aún)
  if (isLoading && postCards.length === 0) {
    return <div className="text-center py-10">Loading stories from AWS...</div>;
  }

  // 3. Manejo de errores (como el 429 o fallos de Zod)
  if (error) {
    return (
      <div className="text-center py-10 text-red-500 border border-red-200 rounded-lg">
        <p>Ups! Something went wrong: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-blue-600 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Latest Stories</h2>
        <Link href="/posts" className="text-blue-700 hover:underline">
          View all
        </Link>
      </div>

      {/* 4. Mapeamos 'postCards' que viene del hook */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {postCards.map((post: Post) => (
          <PostCard
            key={post.id}
            {...post} // Pasamos todas las props (title, imageUrl, etc.)
          />
        ))}
      </div>

      {/* 5. Botón para cargar más (Paginación) */}
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? "Loading..." : "Load more stories"}
          </button>
        </div>
      )}
    </section>
  );
};
