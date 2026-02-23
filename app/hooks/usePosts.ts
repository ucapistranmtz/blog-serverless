"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PostCardSchema, type PostCard } from "../types/postCard.schema";
import { z } from "zod";

const PaginatedResponseSchema = z.object({
  items: z.array(PostCardSchema),
  nextCursor: z.string().nullable(),
});

export function usePosts(limit: number = 6) {
  const [postCards, setPostCards] = useState<PostCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Candado para evitar ejecuciones dobles (común en Strict Mode)
  const initialized = useRef(false);

  const fetchPosts = useCallback(
    async (isInitial: boolean = false) => {
      // 2. Si ya terminó la carga o no hay más, salimos
      if (!isInitial && !hasMore) return;

      try {
        setIsLoading(true);
        setError(null);

        const currentCursor = isInitial ? null : cursor;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!baseUrl) throw new Error("API URL is missing in .env.local");

        const url = new URL(`${baseUrl}/posts`);
        url.searchParams.append("limit", limit.toString());
        if (currentCursor) url.searchParams.append("cursor", currentCursor);

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          if (response.status === 429)
            throw new Error("Too many requests. Please wait.");
          throw new Error(`Server error: ${response.status}`);
        }

        const rawData = await response.json();

        // 3. Validación estricta con Zod 4 [cite: 2026-02-23]
        const { items, nextCursor } = PaginatedResponseSchema.parse(rawData);

        setPostCards((prev) => (isInitial ? items : [...prev, ...items]));
        setCursor(nextCursor);
        setHasMore(nextCursor !== null);
      } catch (err) {
        // Manejo de errores sin 'any' [cite: 2026-02-18]
        if (err instanceof z.ZodError) {
          setError("Data format invalid");
          console.error("Zod Issues:", err.issues);
        } else {
          setError(err instanceof Error ? err.message : "Unexpected error");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [limit, cursor, hasMore],
  );

  // 4. El "Guardián" del useEffect [cite: 2026-01-31]
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetchPosts(true);
    }
  }, []); // Array vacío = Solo se ejecuta al montar el componente

  return {
    postCards,
    isLoading,
    hasMore,
    error,
    loadMore: () => fetchPosts(false),
  };
}
