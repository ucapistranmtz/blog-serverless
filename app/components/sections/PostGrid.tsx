"use client";

import Link from "next/link";
import { PostCard } from "../post/PostCard";
import { type PostCard as Post } from "../../types/postCard.schema"; // Importa tu tipo
import { usePosts } from "@/app/hooks/usePosts";
import { useEffect, useMemo, useState } from "react";

const CACHE_KEY = "posts_grid_cache";

export const PostGrid = () => {
  const {
    postCards: remotePosts,
    isLoading,
    hasMore,
    error,
    loadMore,
  } = usePosts(6);
  const [cachedPosts, setCachedPosts] = useState<Post[]>([]);
  const [isRestored, setIsRestored] = useState(false);

  //get cache
  useEffect(() => {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      try {
        setCachedPosts(JSON.parse(saved));
      } catch (e) {
        console.error("Error restoring posts cache", e);
      }
    }
    setIsRestored(true);
  }, []);

  useEffect(() => {
    if (remotePosts.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(remotePosts));
    }
  }, [remotePosts]);

  const displayPosts = useMemo(() => {
    return remotePosts.length > 0 ? remotePosts : cachedPosts;
  }, [remotePosts, cachedPosts]);

  // 1. Consumimos todo directamente del hook.
  // No necesitamos useState locales aquí.

  // 2. Estado de carga inicial (cuando no hay posts aún)
  if (isLoading && displayPosts.length === 0) {
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
        {displayPosts.map((post: Post) => (
          <Link
            key={`${post.id}${post.slug}`}
            href={`/posts?slug=${post.slug}`}
          >
            <PostCard key={post.id} {...post}></PostCard>
          </Link>
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
